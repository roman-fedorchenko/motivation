import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { action, username, password } = await req.json();
  const sql = neon(process.env.DATABASE_URL!);

  try {
    if (action === 'register') {
      const result = await sql`
        INSERT INTO users (username, password, score) 
        VALUES (${username}, ${password}, 0) 
        RETURNING id, username
      `;
      return NextResponse.json(result[0]);
    }

    if (action === 'login') {
      const result = await sql`
        SELECT id, username FROM users 
        WHERE username = ${username} AND password = ${password}
      `;
      if (result.length > 0) return NextResponse.json(result[0]);
      return NextResponse.json({ error: "Невірний логін або пароль" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Користувач вже існує або помилка БД" }, { status: 400 });
  }
}