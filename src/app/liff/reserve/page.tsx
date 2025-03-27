"use client";

import { useState, useEffect } from "react";
import { initializeLiff, getLiffToken, closeLiff } from "@/lib/liff";
// import { format } from "date-fns";
// import { ja } from "date-fns/locale";

export default function LiffReservationPage() {
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initLiff = async () => {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

      if (!liffId) {
        console.error("LIFF ID is not defined");
        setIsLoading(false);
        return;
      }

      const result = await initializeLiff(liffId);
      setIsLiffInitialized(result.success);
      setIsLoading(false);
    };

    initLiff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // IDトークンの取得
      const idToken = getLiffToken();

      if (!idToken) {
        setMessage("LINEによる認証ができませんでした。");
        setIsLoading(false);
        return;
      }

      // 予約データの送信
      const response = await fetch("/api/reservations/line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          desired_date: desiredDate,
          content,
          id_token: idToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("予約が完了しました！");
        // フォームのリセット
        setName("");
        setDesiredDate("");
        setContent("");

        // 3秒後にLIFFを閉じる
        setTimeout(() => {
          closeLiff();
        }, 3000);
      } else {
        setMessage(`エラー: ${data.error || "予約の作成に失敗しました"}`);
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setMessage("予約処理中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isLiffInitialized) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>LIFFの初期化に失敗しました。LINEアプリから開いてください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">無料カウンセリング予約</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("エラー")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            予約名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            希望日時
          </label>
          <input
            type="datetime-local"
            value={desiredDate}
            onChange={(e) => setDesiredDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            特に聞きたいこと等（ありましたら）
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "送信中..." : "予約する"}
        </button>
      </form>
    </div>
  );
}
