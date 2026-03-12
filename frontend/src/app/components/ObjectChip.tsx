import { motion } from 'motion/react';

interface ObjectChipProps {
  type: 'person' | 'car' | 'truck';
  count: number;
  active: boolean;
  onClick: () => void;
}

const colorMap = {
  person: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    activeBg: 'bg-indigo-500',
    activeText: 'text-white',
  },
  car: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    activeBg: 'bg-emerald-500',
    activeText: 'text-white',
  },
  truck: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    activeBg: 'bg-amber-500',
    activeText: 'text-white',
  },
};

export function ObjectChip({ type, count, active, onClick }: ObjectChipProps) {
  const colors = colorMap[type];
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <motion.button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border transition-all text-sm ${
        active
          ? `${colors.activeBg} ${colors.activeText} border-transparent`
          : `${colors.bg} ${colors.text} ${colors.border}`
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label} <span className="opacity-70">({count})</span>
    </motion.button>
  );
}
