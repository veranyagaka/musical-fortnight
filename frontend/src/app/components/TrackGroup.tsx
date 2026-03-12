import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { TimelineSegment } from './TimelineSegment';
import type { Detection, VerificationStatus } from '../data/mockDetections';
// import { Detection, VerificationStatus } from '../data/mockDetections';

interface TrackGroupProps {
  type: 'person' | 'car' | 'truck';
  detections: Detection[];
  duration: number;
  zoom: number;
  onSeek: (time: number) => void;
  onHover: (detection: Detection | null) => void;
  hoveredDetection: Detection | null;
  color: string;
  label: string;
  isReviewMode?: boolean;
  onVerify?: (id: string, status: VerificationStatus) => void;
  onSelectDetection?: (detection: Detection) => void;
}

export function TrackGroup({
  type,
  detections,
  duration,
  zoom,
  onSeek,
  onHover,
  hoveredDetection,
  color,
  label,
  isReviewMode = false,
  onVerify,
  onSelectDetection,
}: TrackGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showIndividualTracks, setShowIndividualTracks] = useState(false);

  // Group by track ID
  const trackGroups = detections.reduce((acc, detection) => {
    if (!acc[detection.trackId]) {
      acc[detection.trackId] = [];
    }
    acc[detection.trackId].push(detection);
    return acc;
  }, {} as Record<number, Detection[]>);

  const trackIds = Object.keys(trackGroups).sort((a, b) => Number(a) - Number(b));

  if (detections.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm text-gray-500">{label}</span>
          <span className="text-xs text-gray-400 ml-auto">No detections</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Main Track Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 hover:bg-gray-100 -mx-2 px-2 py-1 rounded-md transition-colors"
        >
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </motion.div>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm text-gray-700">{label}</span>
          <span className="text-xs text-gray-400">({detections.length} detections)</span>
        </button>

        {isExpanded && trackIds.length > 1 && (
          <button
            onClick={() => setShowIndividualTracks(!showIndividualTracks)}
            className="text-xs text-indigo-500 hover:text-indigo-600 px-2 py-1 hover:bg-indigo-50 rounded-md transition-colors"
          >
            {showIndividualTracks ? 'Group All' : `Expand (${trackIds.length} tracks)`}
          </button>
        )}
      </div>

      {/* Collapsed/Combined View */}
      {isExpanded && !showIndividualTracks && (
        <div className="relative h-10 bg-gray-100 rounded-md cursor-pointer">
          {detections.map((detection) => (
            <TimelineSegment
              key={detection.id}
              detection={detection}
              duration={duration}
              zoom={zoom}
              onClick={() => onSeek(detection.startTime)}
              onHover={onHover}
              isHighlighted={hoveredDetection?.id === detection.id}
              isReviewMode={isReviewMode}
              onVerify={onVerify}
              onSelect={onSelectDetection}
            />
          ))}
        </div>
      )}

      {/* Individual Tracks View */}
      {isExpanded && showIndividualTracks && (
        <div className="ml-6 space-y-2">
          {trackIds.map((trackId) => {
            const trackDetections = trackGroups[Number(trackId)];
            return (
              <div key={trackId} className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color, opacity: 0.6 }}
                  />
                  <span>
                    {label} #{trackId}
                  </span>
                  <span className="text-gray-300">
                    ({trackDetections.length} segment{trackDetections.length > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="relative h-7 bg-gray-100 rounded-md cursor-pointer">
                  {trackDetections.map((detection) => (
                    <TimelineSegment
                      key={detection.id}
                      detection={detection}
                      duration={duration}
                      zoom={zoom}
                      onClick={() => onSeek(detection.startTime)}
                      onHover={onHover}
                      isHighlighted={hoveredDetection?.id === detection.id}
                      isReviewMode={isReviewMode}
                      onVerify={onVerify}
                      onSelect={onSelectDetection}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
