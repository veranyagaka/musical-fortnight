import { motion } from 'motion/react';
import type { Detection } from '../data/mockDetections';


interface BoundingBoxProps {
  detection: Detection;
  frame: Detection['frames'][0];
  videoWidth: number;
  videoHeight: number;
  onHover: (detection: Detection | null) => void;
}

const colorMap = {
  person: '#6366f1',
  car: '#22c55e',
  truck: '#f59e0b',
};

export function BoundingBox({ detection, frame, videoWidth, videoHeight, onHover }: BoundingBoxProps) {
  const color = colorMap[detection.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute pointer-events-auto"
      style={{
        left: `${(frame.bbox.x / 800) * 100}%`,
        top: `${(frame.bbox.y / 450) * 100}%`,
        width: `${(frame.bbox.width / 800) * 100}%`,
        height: `${(frame.bbox.height / 450) * 100}%`,
        border: `2px solid ${color}`,
        backgroundColor: `${color}10`,
      }}
      onMouseEnter={() => onHover(detection)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Label */}
      <div
        className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {detection.type.toUpperCase()} #{detection.trackId}
        <span className="ml-1 opacity-80">{(detection.confidence * 100).toFixed(0)}%</span>
      </div>
    </motion.div>
  );
}
