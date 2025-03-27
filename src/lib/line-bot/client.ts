import * as line from "@line/bot-sdk";

// LINE設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

// 環境変数チェック
if (!config.channelAccessToken) {
  throw new Error(
    "LINE_CHANNEL_ACCESS_TOKEN environment variable is not defined"
  );
}

if (!config.channelSecret) {
  throw new Error("LINE_CHANNEL_SECRET environment variable is not defined");
}

// LINE MessagingApiClient - メッセージ送信用
export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

// Webhook署名検証用のヘルパー関数
export const verifySignature = (body: string, signature: string): boolean => {
  return line.validateSignature(body, config.channelSecret, signature);
};

// 基本的なテキストメッセージの作成
export const createTextMessage = (text: string) => {
  return {
    type: "text" as const,
    text,
  };
};

// ボタンテンプレートメッセージの作成
export const createButtonsTemplate = (
  title: string,
  text: string,
  actions: Array<{
    type: string;
    label: string;
    uri?: string;
    text?: string;
  }>
) => {
  return {
    type: "template",
    altText: title,
    template: {
      type: "buttons",
      title,
      text,
      actions,
    },
  };
};

// LIFFアプリへのリンクボタン作成
export const createLiffLinkMessage = (
  title: string,
  text: string,
  label: string
) => {
  const liffUrl = process.env.NEXT_PUBLIC_LIFF_URL || "";
  return createButtonsTemplate(title, text, [
    {
      type: "uri",
      label,
      uri: liffUrl,
    },
  ]);
};
