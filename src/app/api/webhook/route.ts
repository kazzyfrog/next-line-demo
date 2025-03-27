import {
  getReservationsByLineUserId,
  updateReservationStatus,
} from "@/lib/reservations";
import crypto from "crypto";
import { NextRequest } from "next/server";

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "";

if (!LINE_CHANNEL_SECRET) {
  throw new Error("LINE_CHANNEL_SECRET environment variable is not defined");
}

// LINE署名の検証
function validateSignature(signature: string, body: string): boolean {
  const hmac = crypto.createHmac("SHA256", LINE_CHANNEL_SECRET);
  const digest = hmac.update(body).digest("base64");
  return signature === digest;
}

export async function POST(request: NextRequest) {
  // リクエストボディの取得
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  // 署名検証
  if (!validateSignature(signature, body)) {
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    const webhookData = JSON.parse(body);
    const events = webhookData.events;

    // イベント処理
    for (const event of events) {
      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            // テキストメッセージの処理
            if (event.message.text === "カウンセリングを予約する") {
              // LIFFアプリへのリンクを送信
              await sendLiffLink(event.replyToken);
            } else if (event.message.text === "予約確認") {
              // 予約確認メッセージの処理
              await sendReservationConfirmMessage(
                event.replyToken,
                event.source.userId
              );
            } else if (event.message.text === "キャンセル確認") {
              // キャンセルメッセージの処理
              await sendCancelMessage(event.replyToken);
            } else if (event.message.text === "キャンセルを確定する") {
              // キャンセルメッセージの処理
              await sendCancelConfirmMessage(
                event.replyToken,
                event.source.userId
              );
            }
          }
          break;
        case "follow":
          // 友達追加時のウェルカムメッセージ
          await sendWelcomeMessage(event.replyToken);
          break;
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// LIFF予約フォームへのリンクを送信（これくらいシンプルでいいね！）
async function sendLiffLink(replyToken: string) {
  const liffUrl = process.env.NEXT_PUBLIC_LIFF_URL || "";

  const message = {
    type: "template",
    altText: "カウンセリング予約",
    template: {
      type: "buttons",
      title: "無料カウンセリング予約",
      text: "予約フォームに進んで日時を選択してください",
      actions: [
        {
          type: "uri",
          label: "予約フォームを開く",
          uri: liffUrl,
        },
      ],
    },
  };

  await replyMessage(replyToken, [message]);
}

// ウェルカムメッセージを送信
async function sendWelcomeMessage(replyToken: string) {
  const message = {
    type: "text",
    text: "プログラミングスクールへようこそ！「カウンセリングを予約する」と入力すると、無料カウンセリングの予約ができます。",
  };

  await replyMessage(replyToken, [message]);
}

type Message = {
  type: string;
  text?: string;
  altText?: string;
  template?: {
    type: string;
    title: string;
    text: string;
    actions: {
      type: string;
      label: string;
      uri: string;
    }[];
  };
};

// LINE Messaging APIで返信
async function replyMessage(replyToken: string, messages: Message[]) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  return response;
}

// ユーザー情報を取得し、予約詳細を確認。DBから予約を取得。見つからなければ、「予約情報が見つかりませんでした。」と返す
// actionsにキャンセルボタンを設置
const sendReservationConfirmMessage = async (
  replyToken: string,
  userId: string
) => {
  const reservations = await getReservationsByLineUserId(userId);

  const reservation = reservations[0];
  if (reservation) {
    const message = {
      type: "text",
      text: `予約情報\n名前：${reservation.name}\n日時：${reservation.desired_date}\n内容：${reservation.content}`,
      actions: [
        {
          type: "message",
          label: "キャンセル",
          text: "キャンセル確認",
        },
      ],
    };
    await replyMessage(replyToken, [message]);
  } else {
    const message = {
      type: "text",
      text: "予約情報が見つかりませんでした。",
    };
    await replyMessage(replyToken, [message]);
  }
};

const sendCancelMessage = async (replyToken: string) => {
  const message = {
    type: "text",
    text: "キャンセルを確定しますか?",
    actions: [
      {
        type: "message",
        label: "キャンセルを確定する",
        text: "キャンセルを確定する",
      },
    ],
  };
  await replyMessage(replyToken, [message]);
};

// ユーザー情報を取得し、DBから予約を削除。見つからなければ、「予約情報が見つかりませんでした。」と返す
const sendCancelConfirmMessage = async (replyToken: string, userId: string) => {
  const reservations = await getReservationsByLineUserId(userId);

  const reservation = reservations[0];
  // 見つからなければ、「予約情報が見つかりませんでした。」と返す
  if (!reservation) {
    const message = {
      type: "text",
      text: "予約情報が見つかりませんでした。",
    };
    await replyMessage(replyToken, [message]);
    return;
  }
  // 見つかった場合は、DBから予約を削除（stasusをcancelledに変更）
  await updateReservationStatus(reservation.id, "cancelled");
  const message = {
    type: "text",
    text: "予約をキャンセルしました",
  };
  await replyMessage(replyToken, [message]);
};
