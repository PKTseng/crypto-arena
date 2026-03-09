import Link from 'next/link';
import { ArrowRight, Zap, BarChart2, Trophy } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} className="text-yellow-500" />,
    title: '即時 BTC 價格',
    desc: '透過 Binance WebSocket 串流，毫秒級即時行情',
  },
  {
    icon: <BarChart2 size={24} className="text-emerald-500" />,
    title: '視覺化圖表',
    desc: '即時價格走勢圖，一眼看出市場動向',
  },
  {
    icon: <Trophy size={24} className="text-orange-500" />,
    title: '連勝加成系統',
    desc: '連續預測正確獲得加倍分數，挑戰最高連勝紀錄',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center gap-16 py-12">

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 max-w-2xl">
        <div className="text-6xl">₿</div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-glow-yellow">
          Crypto<span className="text-yellow-500">Arena</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-lg leading-relaxed">
          即時 BTC 漲跌預測競技平台。<br />
          選擇 UP 或 DOWN，考驗你的市場直覺。
        </p>
        <Link
          href="/arena"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-2xl text-lg transition-colors duration-150 shadow-[0_0_30px_rgba(234,179,8,0.25)]"
        >
          進入 Arena <ArrowRight size={20} />
        </Link>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 text-left border transition-colors duration-150
                       bg-white border-slate-200 hover:border-slate-300
                       dark:bg-gray-900/60 dark:border-gray-800 dark:hover:border-gray-700"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-bold mb-1 text-slate-900 dark:text-white">{f.title}</h3>
            <p className="text-slate-500 dark:text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How to play */}
      <section className="max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-gray-200">遊戲規則</h2>
        <ol className="flex flex-col gap-4 text-left">
          {[
            '每回合開始，你有 10 秒選擇 UP（漲）或 DOWN（跌）',
            '選擇後鎖定，15 秒後比較當前價格與鎖定時的價格',
            '預測正確得 +100 分，連勝每次額外加 10 分',
            '預測錯誤扣 50 分（最低 0 分），挑戰最高連勝！',
          ].map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-500 dark:text-gray-400 text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
