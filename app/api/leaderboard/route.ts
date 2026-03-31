import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Отримуємо ID, ім'я та бали, сортуємо від більшого до меншого
    const data = await sql`
      SELECT id, username, score 
      FROM users 
      ORDER BY score DESC
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Помилка завантаження лідерборду:", error);
    return NextResponse.json({ error: "Не вдалося отримати дані" }, { status: 500 });
  }
}