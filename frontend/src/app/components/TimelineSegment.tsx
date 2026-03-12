import { motion } from 'motion/react';
// import { Detection, VerificationStatus } from '../data/mockDetections';
import { useState } from 'react';
import { Check, X, AlertTriangle, CheckCircle2, XCircle, Pencil, RefreshCw } from 'lucide-react';
import type { Detection, VerificationStatus } from '../data/mockDetections';

interface TimelineSegmentProps {
  detection: Detection;
  duration: number;
  zoom: number;
  onClick: () => void;
  onHover: (detection: Detection | null) => void;
  isHighlighted: boolean;
  isReviewMode?: boolean;
  onVerify?: (id: string, status: VerificationStatus) => void;
  onSelect?: (detection: Detection) => void;
}

const colorMap = {
  person: '#6366f1',
  car: '#22c55e',
  truck: '#f59e0b',
};

const statusIcons = {
  verified: { icon: CheckCircle2, color: '#22c55e' },
  rejected: { icon: XCircle, color: '#ef4444' },
  'needs-review': { icon: AlertTriangle, color: '#f59e0b' },
  unreviewed: { icon: null, color: '#94a3b8' },
};

export function TimelineSegment({
  detection,
  duration,
  zoom,
  onClick,
  onHover,
  isHighlighted,
  isReviewMode = false,
  onVerify,
  onSelect,
}: TimelineSegmentProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const color = colorMap[detection.type];

  const left = (detection.startTime / duration) * 100;
  const width = ((detection.endTime - detection.startTime) / duration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isRejected = detection.verificationStatus === 'rejected';
  const isVerified = detection.verificationStatus === 'verified';
  const isNeedsReview = detection.verificationStatus === 'needs-review';

  const getBorderStyle = () => {
    if (isVerified) return `2px solid ${color}`;
    if (isRejected) return '2px solid #ef4444';
    if (isNeedsReview) return `2px dashed ${color}`;
    return 'none';
  };

  const StatusIcon = statusIcons[detection.verificationStatus]?.icon;

  return (
    <>
      <motion.div
        className="absolute rounded-md cursor-pointer transition-all"
        style={{
          left: `${left}%`,
          width: `${Math.max(width, 0.5)}%`,
          height: isReviewMode ? '100%' : 'calc(100% - 4px)',
          top: isReviewMode ? '0' : '2px',
          backgroundColor: isRejected ? `${color}30` : `${color}CC`,
          opacity: isHighlighted ? 1 : isRejected ? 0.5 : 0.85,
          border: isReviewMode ? getBorderStyle() : 'none',
          zIndex: isHighlighted ? 10 : 1,
        }}
        onClick={() => {
          onClick();
          if (isReviewMode && onSelect) onSelect(detection);
        }}
        onMouseEnter={() => {
          setShowTooltip(true);
          setShowActions(true);
          onHover(detection);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
          setShowActions(false);
          onHover(null);
        }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.1 }}
      >
        {/* Rejected strikethrough */}
        {isRejected && (
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-red-400" />
          </div>
        )}

        {/* Status indicator in review mode */}
        {isReviewMode && StatusIcon && (
          <div className="absolute -top-2.5 -right-1 z-20">
            <StatusIcon
              className="w-3.5 h-3.5"
              style={{ color: statusIcons[detection.verificationStatus].color }}
            />
          </div>
        )}

        {/* Quick action buttons in review mode on hover */}
        {isReviewMode && showActions && onVerify && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white rounded-md shadow-lg border border-gray-200 p-0.5 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onVerify(detection.id, 'verified')}
              className="p-1 hover:bg-emerald-50 rounded transition-colors"
              title="Confirm detection"
            >
              <Check className="w-3 h-3 text-emerald-500" />
            </button>
            <button
              onClick={() => onVerify(detection.id, 'rejected')}
              className="p-1 hover:bg-red-50 rounded transition-colors"
              title="Mark as incorrect"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
            <button
              onClick={() => onSelect?.(detection)}
              className="p-1 hover:bg-blue-50 rounded transition-colors"
              title="Edit timeframe"
            >
              <Pencil className="w-3 h-3 text-indigo-500" />
            </button>
            <button
              onClick={() => onVerify(detection.id, 'needs-review')}
              className="p-1 hover:bg-amber-50 rounded transition-colors"
              title="Reassign / needs review"
            >
              <RefreshCw className="w-3 h-3 text-amber-500" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${(left + width / 2)}%`,
            top: '-90px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-white text-gray-800 px-3 py-2.5 rounded-lg text-xs shadow-lg border border-gray-200">
            {/* Thumbnail placeholder */}
            <div
              className="w-28 h-16 rounded mb-1.5 flex items-center justify-center text-xs border border-gray-100"
              style={{ backgroundColor: `${color}10` }}
            >
              <span style={{ color }}>Frame Preview</span>
            </div>

            <div className="mb-1 text-gray-900">
              {detection.type.toUpperCase()} #{detection.trackId}
            </div>
            <div className="text-gray-500 space-y-0.5">
              <div>
                {formatTime(detection.startTime)} - {formatTime(detection.endTime)}
              </div>
              <div>Duration: {(detection.endTime - detection.startTime).toFixed(1)}s</div>
              <div>Confidence: {(detection.confidence * 100).toFixed(1)}%</div>
              {isReviewMode && (
                <div className="flex items-center gap-1 mt-1 pt-1 border-t border-gray-100">
                  <span>Status:</span>
                  <span
                    className="capitalize"
                    style={{ color: statusIcons[detection.verificationStatus].color }}
                  >
                    {detection.verificationStatus.replace('-', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
