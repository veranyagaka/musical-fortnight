import { Video, Eye, Pencil } from 'lucide-react';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { StatusBadge } from './StatusBadge';

interface NavigationBarProps {
  mode: 'detection' | 'review';
  onModeChange: (mode: 'detection' | 'review') => void;
  reviewProgress?: { total: number; verified: number; remaining: number };
}

export function NavigationBar({ mode, onModeChange, reviewProgress }: NavigationBarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-500 rounded-lg p-1.5">
          <Video className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg text-gray-900">DroneVision Analytics</h1>
      </div>

      {/* Mode Toggle */}
      <div className="ml-8 flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => onModeChange('detection')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            mode === 'detection'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Detection Mode
        </button>
        <button
          onClick={() => onModeChange('review')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            mode === 'review'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          Review Mode
        </button>
      </div>

      {/* Review Progress */}
      {mode === 'review' && reviewProgress && (
        <div className="ml-4 flex items-center gap-3">
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Progress:</span>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{
                  width: `${reviewProgress.total > 0 ? (reviewProgress.verified / reviewProgress.total) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-gray-700">
              {reviewProgress.verified}/{reviewProgress.total}
            </span>
            <span className="text-gray-400">
              ({reviewProgress.remaining} remaining)
            </span>
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        <StatusBadge status="processed" />
        <div className="text-sm text-gray-500">
          <span className="text-gray-900">Parking_Lot_Surveillance_001.mp4</span>
        </div>
        <KeyboardShortcuts />
      </div>
    </div>
  );
}
