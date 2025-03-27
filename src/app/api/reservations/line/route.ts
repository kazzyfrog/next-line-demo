import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservations";
import { createReservationConfirmFlex } from "@/lib/flex-messages";
import { sendPushMessage } from "@/lib/line-messaging";
import { checkDuplicateReservation } from "@/lib/db";

// interface LineVerifyResponse {
//   iss: string;
//   sub: string;
//   aud: string;
//   exp: number;
//   iat: number;
//   name: string;
//   picture: string;
// }

interface LineUserProfile {
  userId: string; // ユーザーID（LINE内でユニーク）
  displayName: string; // 表示名
  pictureUrl?: string; // プロフィール画像URL（設定していない場合はなし）
  statusMessage?: string; // ステータスメッセージ（設定していない場合はなし）
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.name || !body.desired_date || !body.id_token) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // IDトークンの検証
    // const verifyResponse = await fetch(
    //   "https://api.line.me/oauth2/v2.1/verify",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       id_token: body.id_token,
    //       client_id: process.env.LIFF_CHANNEL_ID || "",
    //     }).toString(),
    //   }
    // );

    const verifyResponse = await fetch(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${body.id_token}`,
      {
        method: "GET",
      }
    );

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "LINEの認証に失敗しました" },
        { status: 401 }
      );
    }

    const response = await fetch("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${body.id_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("LINEプロフィールの取得に失敗しました");
    }

    const lineUserInfo: LineUserProfile = await response.json();

    // const lineUserInfo: LineVerifyResponse = await verifyResponse.json();

    // 予約の重複チェック
    const isDuplicate = await checkDuplicateReservation(
      new Date(body.desired_date)
    );
    if (isDuplicate) {
      return NextResponse.json(
        { error: "同じ日時に予約があるので、別の日時を選択してください" },
        { status: 400 }
      );
    }

    // 予約の作成
    const reservation = await createReservation({
      name: body.name,
      line_user_id: lineUserInfo.userId, // LINE User ID
      desired_date: new Date(body.desired_date),
      content: body.content,
    });

    // LINE Messaging APIを使って予約確認メッセージを送信
    // (このステップは次の「簡易的な予約フロー」で実装)

    // LINE Messaging APIを使って予約確認メッセージを送信
    const flexMessage = createReservationConfirmFlex(reservation);
    await sendPushMessage(lineUserInfo.userId, [flexMessage]);

    return NextResponse.json(reservation);

    // return NextResponse.json(reservation);
  } catch (error) {
    console.error("予約作成エラー:", error);
    return NextResponse.json(
      { error: "予約の作成に失敗しました" },
      { status: 500 }
    );
  }
}
