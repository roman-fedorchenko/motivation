'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [user, setUser] = useState<{id: number, username: string} | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Стан для теми
  const [darkMode, setDarkMode] = useState(false);

  // Ініціалізація теми та користувача
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
    
    fetchLeaderboard();
  }, []);

  // Збереження теми при зміні
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const fetchLeaderboard = async () => {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    setLeaderboard(data);
  };

  const handleAuth = async () => {
    setLoading(true);
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ ...form, action: isRegister ? 'register' : 'login' }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      fetchLeaderboard();
    } else {
      alert(data.error);
    }
    setLoading(false);
  };

  const addScore = async () => {
    if (!amount || parseInt(amount) === 0) return;
    setLoading(true);
    await fetch('/api/add-score', {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id, amount: parseInt(amount) }),
    });
    setAmount('');
    await fetchLeaderboard();
    setLoading(false);
  };

  // Базові класи для шрифту та кольору
  const themeClass = darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  const cardClass = darkMode ? "bg-slate-900 border-slate-800 shadow-none" : "bg-white border-slate-200 shadow-sm";
  const inputClass = darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200 text-slate-900";

if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${themeClass}`}>
        <div className={`p-12 rounded-[3rem] border w-full max-w-xl ${cardClass}`}>
          <h1 className="text-6xl font-black text-center mb-10 italic tracking-tighter uppercase">
            {isRegister ? 'Реєстрація' : 'Вхід'}
          </h1>
          
          <div className="space-y-8">
            <input 
              className={`w-full p-7 rounded-3xl text-2xl outline-none focus:ring-4 focus:ring-blue-500/50 transition border ${inputClass}`}
              placeholder="Ваш логін" 
              onChange={e => setForm({...form, username: e.target.value})} 
            />
            <input 
              className={`w-full p-7 rounded-3xl text-2xl outline-none focus:ring-4 focus:ring-blue-500/50 transition border ${inputClass}`}
              type="password" 
              placeholder="Пароль" 
              onChange={e => setForm({...form, password: e.target.value})} 
            />
            
            <button 
              onClick={handleAuth} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-7 rounded-3xl font-black text-3xl shadow-2xl transition transform active:scale-95 uppercase tracking-tight"
            >
              {loading ? '...' : (isRegister ? 'Створити' : 'Увійти')}
            </button>
            
            <button 
              onClick={() => setIsRegister(!isRegister)} 
              className="w-full text-xl font-bold opacity-60 hover:opacity-100 transition"
            >
              {isRegister ? '← Вже є акаунт? Увійти' : 'Немає акаунту? Реєстрація →'}
            </button>

            {/* Збільшене попередження */}
            <div className={`mt-8 p-6 rounded-2xl border-2 shadow-inner ${darkMode ? 'border-amber-900/50 bg-amber-900/20' : 'border-amber-200 bg-amber-50'}`}>
              <p className={`text-sm md:text-base leading-relaxed font-medium ${darkMode ? 'text-amber-200/80' : 'text-amber-800'}`}>
                ⚠️ <span className="font-black underline">УВАГА:</span> Це відкритий навчальний проект. 
                Дані передаються без шифрування. 
                <span className="block mt-2 text-red-500 font-black uppercase">
                  НЕ використовуйте свої справжні паролі!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-10 transition-colors duration-300 font-sans ${themeClass}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Навігація */}
      <nav className={`sticky top-0 z-10 border-b backdrop-blur-md ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <span className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            SCORE MASTER
          </span>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className={`p-3 rounded-xl border transition ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
            >
              {darkMode ? '🌙 Темна' : '☀️ Світла'}
            </button>
            <button 
              onClick={() => {localStorage.clear(); setUser(null);}} 
              className="text-base font-bold text-red-500"
            >
              Вихід
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Панель керування */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-8 rounded-[2rem] border ${cardClass}`}>
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest opacity-70">Додати бали</h2>
            <div className="space-y-6">
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className={`w-full p-6 rounded-2xl text-4xl font-bold border outline-none focus:ring-4 focus:ring-blue-500/30 transition ${inputClass}`}
                placeholder="0" 
              />
              <button 
                onClick={addScore} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl font-black text-2xl shadow-xl transition transform active:scale-95"
              >
                ДОДАТИ
              </button>
            </div>
          </div>
        </div>

        {/* Таблиця */}
        <div className="lg:col-span-8">
          <div className={`rounded-[2rem] border overflow-hidden ${cardClass}`}>
            <div className="p-8 border-b border-inherit flex justify-between items-center">
              <h2 className="text-3xl font-black tracking-tight uppercase">Лідерборд</h2>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-sm font-bold opacity-50 uppercase">Online</span>
              </div>
            </div>
            
            <div className="divide-y divide-inherit">
              {leaderboard.map((u, i) => (
                <div 
                  key={u.id} 
                  className={`flex justify-between items-center p-7 transition ${u.id === user.id ? (darkMode ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`text-2xl font-black w-10 ${
                      i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-500' : 'opacity-20'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-2xl font-bold ${u.id === user.id ? 'text-blue-500' : ''}`}>
                      {u.username} {u.id === user.id && "👤"}
                    </span>
                  </div>
                  <span className="text-4xl font-black tracking-tighter">{u.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}