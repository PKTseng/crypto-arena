// Orbitron + DM Sans 字體變數已在 root layout 注入，這裡只做背景覆蓋
export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-[calc(100vh-8rem)] rounded-2xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-8"
      style={{ background: '#0A0A0F' }}
    >
      {children}
    </div>
  );
}
