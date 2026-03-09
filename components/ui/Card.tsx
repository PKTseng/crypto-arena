import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'green' | 'red' | 'yellow' | 'none';
}

const glowStyles: Record<string, string> = {
  green:  'shadow-[0_0_30px_rgba(34,197,94,0.15)] border-green-900/50',
  red:    'shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-900/50',
  yellow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)] border-yellow-900/50',
  none:   'border-gray-800',
};

export default function Card({ children, className, glow = 'none' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900/80 backdrop-blur-sm border rounded-2xl p-6',
        glowStyles[glow],
        className,
      )}
    >
      {children}
    </div>
  );
}
