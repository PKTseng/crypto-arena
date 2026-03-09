import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'win' | 'lose' | 'draw' | 'up' | 'down' | 'default';
  className?: string;
}

const variantStyles: Record<string, string> = {
  win:     'bg-green-900/60 text-green-400 border border-green-700',
  lose:    'bg-red-900/60 text-red-400 border border-red-700',
  draw:    'bg-gray-800 text-gray-400 border border-gray-600',
  up:      'bg-green-900/60 text-green-400 border border-green-700',
  down:    'bg-red-900/60 text-red-400 border border-red-700',
  default: 'bg-gray-800 text-gray-300 border border-gray-700',
};

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
