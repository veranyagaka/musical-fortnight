import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export type Status = 'processed' | 'processing' | 'error';

interface StatusBadgeProps {
  status: Status;
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const statusConfig = {
    processed: {
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: text || 'Processed',
    },
    processing: {
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      label: text || 'Processing...',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: text || 'Error',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.bg} ${config.border}`}
    >
      <Icon className={`w-3 h-3 ${config.color}`} />
      <span className={`text-xs ${config.color}`}>{config.label}</span>
    </motion.div>
  );
}
