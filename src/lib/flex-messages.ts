import { formatDateTime } from "./line-messaging";
import type { Reservation } from "./db";

/**
 * 予約確認用Flex Messageテンプレートを生成
 */
export function createReservationConfirmFlex(reservation: Reservation) {
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
            style: "primary",
            action: {
              type: "uri",
              label: "予約を変更する",
              uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`,
            },
          },
          {
            type: "button",
            style: "secondary",
            action: {
              type: "uri",
              label: "ウェブサイトを見る",
              uri: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
            },
          },
        ],
        flex: 0,
      },
    },
  };
}

/**
 * 予約リマインダー用Flex Message
 */
export function createReservationReminderFlex(reservation: Reservation) {
  const formattedDate = formatDateTime(new Date(reservation.desired_date));

  return {
    type: "flex",
    altText: "カウンセリング予約のリマインダー",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "リマインダー",
            weight: "bold",
            size: "xl",
            color: "#ffffff",
          },
        ],
        backgroundColor: "#F39C12",
        paddingAll: "20px",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "カウンセリング予約が近づいています",
            weight: "bold",
            size: "md",
            wrap: true,
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
                    text: "日時",
                    size: "sm",
                    color: "#555555",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: formattedDate,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                    flex: 2,
                    wrap: true,
                  },
                ],
              },
            ],
          },
          {
            type: "text",
            text: "オンラインでの実施となります。予約時間になりましたら、LINEでご連絡いたします。",
            margin: "lg",
            size: "sm",
            wrap: true,
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
            style: "primary",
            action: {
              type: "postback",
              label: "予約を確認する",
              data: `action=viewReservation&id=${reservation.id}`,
            },
          },
          {
            type: "button",
            style: "secondary",
            action: {
              type: "postback",
              label: "キャンセルする",
              data: `action=cancelReservation&id=${reservation.id}`,
            },
          },
        ],
        flex: 0,
      },
    },
  };
}
