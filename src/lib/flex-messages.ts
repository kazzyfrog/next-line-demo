import { formatDateTime } from "./line-messaging";
import type { Reservation } from "./db";
import { messagingApi } from "@line/bot-sdk";

/**
 * 予約確認用Flex Messageテンプレートを生成
 */
export function createReservationConfirmFlex(
  reservation: Reservation
): messagingApi.FlexMessage {
  const formattedDate = formatDateTime(new Date(reservation.desired_date));

  return {
    type: "flex",
    altText: "予約が確定しました",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "予約完了",
            weight: "bold",
            size: "xl",
            color: "#ffffff",
          },
        ],
        backgroundColor: "#27ACB2",
        paddingAll: "20px",
      },
      hero: {
        type: "image",
        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "カウンセリング予約内容",
            weight: "bold",
            size: "lg",
            margin: "md",
          },
          {
            type: "separator",
            margin: "lg",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "お名前",
                    size: "sm",
                    color: "#555555",
                    flex: 2,
                  },
                  {
                    type: "text",
                    text: reservation.name,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                    flex: 3,
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "日時",
                    size: "sm",
                    color: "#555555",
                    flex: 2,
                  },
                  {
                    type: "text",
                    text: formattedDate,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                    flex: 3,
                  },
                ],
                margin: "md",
              },
            ],
          },
          {
            type: "separator",
            margin: "lg",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            contents: [
              {
                type: "text",
                text: "相談内容",
                size: "sm",
                color: "#555555",
              },
              {
                type: "text",
                text: reservation.content || "（未入力）",
                size: "sm",
                color: "#111111",
                margin: "md",
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "button",
            style: "secondary",
            action: {
              type: "message",
              label: "予約を取り消す",
              text: "キャンセル確認",
            },
          },
        ],
        flex: 0,
      },
    },
  };
}
