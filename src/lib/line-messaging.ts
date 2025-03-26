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

/**
 * LINE Messaging APIを使用するためのヘルパー関数
 */

// プッシュメッセージを送信（特定ユーザーへ）
export async function sendPushMessage(
  userId: string,
  messages: Message[]
): Promise<boolean> {
  const url = "https://api.line.me/v2/bot/message/push";
  const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: userId,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("LINE API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send LINE message:", error);
    return false;
  }
}

// 日時をフォーマット（Flex Message用）
export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}
