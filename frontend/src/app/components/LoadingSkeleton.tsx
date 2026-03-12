import { motion } from 'motion/react';

export function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-8 w-28 bg-gray-100 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <motion.div
              className="h-5 w-20 bg-gray-100 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
            <motion.div
              className="h-10 w-full bg-gray-100 rounded-md"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessingIndicator({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <div className="text-center">
        <p className="text-gray-700 mb-1">Processing Video...</p>
        <p className="text-sm text-gray-500">Detecting objects in footage</p>
      </div>
      <div className="w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-sm text-gray-500">{progress}% complete</p>
    </div>
  );
}
