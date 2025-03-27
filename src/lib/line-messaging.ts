import { messagingApi } from "@line/bot-sdk";
import { lineClient } from "./line-bot/client";

/**
 * LINE Messaging APIを使用するためのヘルパー関数
 */

export async function sendPushMessage(
  userId: string,
  messages: messagingApi.Message[]
): Promise<boolean> {
  try {
    await lineClient.pushMessage({
      to: userId,
      messages: messages,
    });
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
