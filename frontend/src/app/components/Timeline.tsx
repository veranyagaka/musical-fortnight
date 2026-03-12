import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, LayoutList, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { TrackGroup } from './TrackGroup';
// import { Detection, VerificationStatus } from '../data/mockDetections';
import * as Slider from '@radix-ui/react-slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getHeatmapData, type Detection, type VerificationStatus } from '../data/mockDetections';

interface TimelineProps {
  currentTime: number;
  duration: number;
  detections: Detection[];
  onSeek: (time: number) => void;
  activeFilters: Set<string>;
  onDetectionHover: (detection: Detection | null) => void;
  hoveredDetection: Detection | null;
  isReviewMode?: boolean;
  onVerify?: (id: string, status: VerificationStatus) => void;
  onSelectDetection?: (detection: Detection) => void;
}

type ViewMode = 'segmented' | 'heatmap';

export function Timeline({
  currentTime,
  duration,
  detections,
  onSeek,
  activeFilters,
  onDetectionHover,
  hoveredDetection,
  isReviewMode = false,
  onVerify,
  onSelectDetection,
}: TimelineProps) {
  const [zoom, setZoom] = useState(1);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('segmented');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.5, 10));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.5, 1));

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollLeft;
    const percentage = x / (rect.width * zoom);
    const time = percentage * duration;
    onSeek(Math.max(0, Math.min(time, duration)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp as any);
      return () => document.removeEventListener('mouseup', handleMouseUp as any);
    }
  }, [isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Group detections by type and track
  const groupedDetections = {
    person: detections.filter((d) => d.type === 'person' && activeFilters.has('person')),
    car: detections.filter((d) => d.type === 'car' && activeFilters.has('car')),
    truck: detections.filter((d) => d.type === 'truck' && activeFilters.has('truck')),
  };

  // Generate time markers
  const timeMarkers = [];
  const markerInterval = zoom > 3 ? 10 : zoom > 1.5 ? 30 : 60;
  for (let i = 0; i <= duration; i += markerInterval) {
    timeMarkers.push(i);
  }

  const trackColors = {
    person: '#6366f1',
    car: '#22c55e',
    truck: '#f59e0b',
  };

  const trackLabels = {
    person: 'Person',
    car: 'Car',
    truck: 'Truck',
  };

  const heatmapData = getHeatmapData(10);

  return (
    <div className="flex flex-col h-full bg-white border-t border-gray-200">
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm text-gray-900">Object Detection Timeline</h2>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('segmented')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'segmented'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Segmented
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Heatmap
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
            >
              <ZoomOut className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="text-xs text-gray-500 w-10 text-center">{zoom.toFixed(1)}x</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 10}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30"
            >
              <ZoomIn className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'segmented' ? (
          <div
            ref={scrollContainerRef}
            className="h-full overflow-x-auto overflow-y-auto"
            onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
          >
            <div className="min-w-full p-4" style={{ width: `${100 * zoom}%` }}>
              {/* Time Ruler */}
              <div className="relative h-6 mb-3 border-b border-gray-200">
                {timeMarkers.map((time) => (
                  <div
                    key={time}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${(time / duration) * 100}%` }}
                  >
                    <div className="w-px h-2 bg-gray-300" />
                    <span className="text-[10px] text-gray-400 mt-0.5">{formatTime(time)}</span>
                  </div>
                ))}
              </div>

              {/* Tracks */}
              <div className="space-y-4">
                {(Object.keys(groupedDetections) as Array<keyof typeof groupedDetections>).map(
                  (type) => {
                    const typeDetections = groupedDetections[type];

                    return (
                      <TrackGroup
                        key={type}
                        type={type}
                        detections={typeDetections}
                        duration={duration}
                        zoom={zoom}
                        onSeek={onSeek}
                        onHover={onDetectionHover}
                        hoveredDetection={hoveredDetection}
                        color={trackColors[type]}
                        label={trackLabels[type]}
                        isReviewMode={isReviewMode}
                        onVerify={onVerify}
                        onSelectDetection={onSelectDetection}
                      />
                    );
                  }
                )}
              </div>


            </div>
          </div>
        ) : (
          /* Heatmap View */
          <div className="h-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData}>
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => formatTime(value)}
                  stroke="#d1d5db"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  stroke="#d1d5db"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                  labelFormatter={(value) => `Time: ${formatTime(value as number)}`}
                />
                {activeFilters.has('person') && (
                  <Bar dataKey="person" stackId="a" fill="#6366f1" name="Person" radius={[2, 2, 0, 0]} />
                )}
                {activeFilters.has('car') && (
                  <Bar dataKey="car" stackId="a" fill="#22c55e" name="Car" radius={[2, 2, 0, 0]} />
                )}
                {activeFilters.has('truck') && (
                  <Bar dataKey="truck" stackId="a" fill="#f59e0b" name="Truck" radius={[2, 2, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>

            {/* Playhead for heatmap */}
            <div className="relative mt-3">
              <Slider.Root
                className="relative flex items-center w-full h-5 cursor-pointer"
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={(value) => onSeek(value[0])}
              >
                <Slider.Track className="relative h-1 w-full bg-gray-200 rounded-full">
                  <Slider.Range className="absolute h-full bg-red-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-3.5 h-3.5 bg-red-500 rounded-full shadow hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-red-300" />
              </Slider.Root>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
