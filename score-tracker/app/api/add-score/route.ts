import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();
    
    // Перевірка вхідних даних
    if (!userId || isNaN(parseInt(amount))) {
      return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // SQL запит: сумуємо старі бали з новими
    const result = await sql`
      UPDATE users 
      SET score = score + ${parseInt(amount)} 
      WHERE id = ${userId}
      RETURNING score, username
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      newScore: result[0].score 
    });

  } catch (error) {
    console.error("Помилка при додаванні балів:", error);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}