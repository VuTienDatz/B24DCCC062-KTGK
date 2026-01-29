import React, { useState } from 'react';
import { GuessForm } from './GuessForm'; // Import con vào

// Định nghĩa kiểu dữ liệu cho kết quả lượt chơi
type GameResult = {
  userNumber: number;
  systemNumber: number;
  isCorrect: boolean;
  message: string;
};

export const LuckyNumberGame = () => {
  // State lưu kết quả (có thể null nếu chưa chơi ván nào)
  const [result, setResult] = useState<GameResult | null>(null);
  
  // Logic chính nằm ở đây
  const handlePlayGame = (userNumber: number) => {
    // 1. Hệ thống random số từ 1 đến 10
    const systemNumber = Math.floor(Math.random() * 10) + 1;

    // 2. So sánh
    const isCorrect = userNumber === systemNumber;

    // 3. Cập nhật State
    setResult({
      userNumber,
      systemNumber,
      isCorrect,
      message: isCorrect 
        ? "🎉 Chúc mừng! Anh đoán quá chuẩn!" 
        : "💀 Sai rồi! Thử lại nhé."
    });
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Game Dự Đoán Số</h1>
      
      {/* Truyền hàm handlePlayGame xuống cho con dùng */}
      <GuessForm onGuess={handlePlayGame} />

      {/* Hiển thị kết quả (Chỉ hiện khi result khác null) */}
      {result && (
        <div className={`p-4 rounded ${result.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="text-xl font-bold">{result.message}</h2>
          <p>Anh chọn: <strong>{result.userNumber}</strong></p>
          <p>Máy chọn: <strong>{result.systemNumber}</strong></p>
        </div>
      )}
    </div>
  );
};