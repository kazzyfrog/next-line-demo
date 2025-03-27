import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Postgres接続クライアントを作成
export const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production",
});

// 予約データ型の定義import { sql, Reservation } from './db';

// 新規予約を作成
export async function createReservation(data: {
  name: string;
  email: string;
  line_user_id?: string;
  desired_date: Date;
  content?: string;
}): Promise<Reservation> {
  const [reservation] = await sql<Reservation[]>`
      INSERT INTO reservations (
        name, email, line_user_id, desired_date, content
      ) VALUES (
        ${data.name}, ${data.email}, ${data.line_user_id || null}, 
        ${data.desired_date}, ${data.content || null}
      )
      RETURNING *
    `;

  return reservation;
}

// 同じ日時に予約が入っていないかをチェック（stasusがconfirmedのもの）
export async function checkDuplicateReservation(
  desiredDate: Date
): Promise<boolean> {
  const [result] = await sql<{ count: number }[]>`
    SELECT COUNT(*) AS count FROM reservations
    WHERE desired_date = ${desiredDate} AND status = 'confirmed'
  `;
  return result.count > 0;
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
export type Reservation = {
  id: number;
  name: string;
  email?: string;
  line_user_id: string | null;
  desired_date: Date;
  content: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: Date;
  updated_at: Date;
};
