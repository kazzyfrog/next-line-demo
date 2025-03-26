// import { NextResponse } from "next/server";
import crypto from "crypto";

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "";

// LINE署名の検証
function validateSignature(signature: string, body: string): boolean {
  const hmac = crypto.createHmac("sha256", LINE_CHANNEL_SECRET);
  const digest = hmac.update(body).digest("base64");
  return signature === digest;
}

export async function POST(request: Request) {
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

// LIFF予約フォームへのリンクを送信
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
