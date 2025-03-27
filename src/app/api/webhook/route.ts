import {
  createTextMessage,
  lineClient,
  verifySignature,
} from "@/lib/line-bot/client";
import { formatDateTime } from "@/lib/line-bot/flex-messages";
import {
  getReservationsByLineUserId,
  updateReservationStatus,
} from "@/lib/neon/reservations";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // リクエストボディの取得
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  // 署名検証
  if (!verifySignature(body, signature)) {
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
            if (event.message.text === "予約確認") {
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
          await lineClient.replyMessage({
            replyToken: event.replyToken,
            messages: [
              createTextMessage(
                "プログラミングスクールへようこそ！「カウンセリングを予約する」と入力すると、無料カウンセリングの予約ができます。"
              ),
            ],
          });
          break;
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// ユーザー情報を取得し、予約詳細を確認。DBから予約を取得。見つからなければ、「予約情報が見つかりませんでした。」と返す
// actionsにキャンセルボタンを設置
const sendReservationConfirmMessage = async (
  replyToken: string,
  userId: string
) => {
  const reservations = await getReservationsByLineUserId(userId);

  if (reservations[0]) {
    const reservation = reservations[0];
    const formattedDate = formatDateTime(new Date(reservation.desired_date));

    const message = {
      type: "template" as const,
      altText: "予約内容",
      template: {
        type: "buttons" as const,
        title: "予約内容",
        text: `名前：${reservation.name}\n日時：${formattedDate}\n内容：${reservation.content}`,
        actions: [
          {
            type: "message" as const,
            label: "キャンセルしますか？",
            text: "キャンセル確認",
          },
        ],
      },
    };

    await lineClient.replyMessage({
      replyToken,
      messages: [message],
    });
  } else {
    await lineClient.replyMessage({
      replyToken,
      messages: [createTextMessage("予約情報が見つかりませんでした。")],
    });
  }
};

const sendCancelMessage = async (replyToken: string) => {
  const message = {
    type: "template" as const,
    altText: "キャンセルを確定しますか?",
    template: {
      type: "buttons" as const,
      title: "キャンセルを確定しますか?",
      text: `この処理は、取り消せません。`,
      actions: [
        {
          type: "message" as const,
          label: "キャンセルを確定する",
          text: "キャンセルを確定する",
        },
      ],
    },
  };

  await lineClient.replyMessage({
    replyToken,
    messages: [message],
  });
};

// ユーザー情報を取得し、DBから予約を削除。見つからなければ、「予約情報が見つかりませんでした。」と返す
const sendCancelConfirmMessage = async (replyToken: string, userId: string) => {
  const reservations = await getReservationsByLineUserId(userId);

  const reservation = reservations[0];
  // 見つからなければ、「予約情報が見つかりませんでした。」と返す
  if (!reservation) {
    await lineClient.replyMessage({
      replyToken,
      messages: [createTextMessage("予約情報が見つかりませんでした。")],
    });
    return;
  }
  // 見つかった場合は、DBから予約を削除（stasusをcancelledに変更）
  await updateReservationStatus(reservation.id, "cancelled");

  await lineClient.replyMessage({
    replyToken,
    messages: [
      createTextMessage(
        "予約をキャンセルしました。\nまたのご予約をお待ちしております。"
      ),
    ],
  });
};
