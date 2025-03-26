"use server";

import { sql, Reservation } from "./db";

// 新規予約を作成
export async function createReservation(data: {
  name: string;
  email?: string; // 任意に変更
  line_user_id?: string;
  desired_date: Date;
  content?: string;
}): Promise<Reservation> {
  const [reservation] = await sql<Reservation[]>`
      INSERT INTO reservations (
        name, email, line_user_id, desired_date, content
      ) VALUES (
        ${data.name}, ${data.email || null}, ${data.line_user_id || null}, 
        ${data.desired_date}, ${data.content || null}
      )
      RETURNING *
    `;

  return reservation;
}

// 予約一覧を取得
export async function getReservations(): Promise<Reservation[]> {
  return await sql<Reservation[]>`
    SELECT * FROM reservations
    ORDER BY desired_date DESC
  `;
}

// 特定のLINEユーザーIDの予約を取得
export async function getReservationsByLineUserId(
  lineUserId: string
): Promise<Reservation[]> {
  return await sql<Reservation[]>`
    SELECT * FROM reservations
    WHERE line_user_id = ${lineUserId}
    ORDER BY desired_date DESC
  `;
}

// 予約ステータスを更新
export async function updateReservationStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled"
): Promise<Reservation> {
  const [reservation] = await sql<Reservation[]>`
    UPDATE reservations
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  return reservation;
}
