// Arena 頁面跟隨全站 light/dark 主題
export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-[calc(100vh-8rem)] rounded-2xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-8
                 bg-slate-50 dark:bg-[#0A0A0F] transition-colors duration-200"
    >
      {children}
    </div>
  );
}
