// src/components/VideoPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import type { Detection } from '../data/mockDetections';
import { BoundingBox } from './BoundingBox';
import { AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  videoSrc: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  duration?: number;
  detections: Detection[];
  activeFilters: Set<string>;
  onDetectionHover: (detection: Detection | null) => void;
  hoveredDetection: Detection | null;
}

export function VideoPlayer({
  videoSrc,
  currentTime,
  onTimeUpdate,
  duration: fallbackDuration,
  detections,
  activeFilters,
  onDetectionHover,
  hoveredDetection,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(fallbackDuration);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs((v.currentTime || 0) - currentTime) > 0.3) v.currentTime = currentTime;
  }, [currentTime]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.play().catch(() => setIsPlaying(false));
    else v.pause();
  }, [isPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    v.playbackRate = playbackSpeed;
  }, [isMuted, playbackSpeed]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => onTimeUpdate(v.currentTime);
    const onLoadedMeta = () => setVideoDuration(v.duration || fallbackDuration);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onLoadedMeta);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onLoadedMeta);
    };
  }, [onTimeUpdate, fallbackDuration]);

  const togglePlayPause = () => setIsPlaying((s) => !s);

  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeDetections = detections.filter((d) => {
    if (!activeFilters.has(d.type)) return false;
    return currentTime >= d.startTime && currentTime <= d.endTime;
  });

  const getClosestFrame = (detection: Detection) =>
    detection.frames.reduce((prev, curr) =>
      Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev
    );

  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-5xl  aspect-video rounded-lg overflow-hidden">
          {/* Video element */}
          <video
            ref={videoRef}
            src="/output_web_ffmpeg.mp4"
            controls
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            preload="metadata"
            playsInline
          />

          {/* Only dynamic bounding boxes
          {activeDetections.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {activeDetections.map((d) => (
                  <BoundingBox
                    key={d.id}
                    detection={d}
                    frame={getClosestFrame(d)}
                    videoWidth={800}
                    videoHeight={450}
                    onHover={onDetectionHover}
                  />
                ))}
              </AnimatePresence>
            </div>
          )} */}

          {hoveredDetection && (
            <div className="absolute inset-0 pointer-events-none">
              <BoundingBox
                detection={hoveredDetection}
                frame={getClosestFrame(hoveredDetection)}
                videoWidth={800}
                videoHeight={450}
                onHover={() => { }}
              />
            </div>
          )}

          {/* Time overlay */}
          <div className="absolute bottom-3 left-3 text-xs text-white/60">
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="mb-3">
            <Slider.Root
              className="relative flex items-center w-full h-5 cursor-pointer"
              value={[currentTime]}
              max={videoDuration ?? 0}
              step={0.1}
              onValueChange={(value) => {
                const v = videoRef.current;
                const t = value[0];
                if (v) v.currentTime = t;
                onTimeUpdate(t);
              }}
            >
              <Slider.Track className="relative h-1 w-full bg-gray-200 rounded-full">
                <Slider.Range className="absolute h-full bg-indigo-500 rounded-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-3.5 h-3.5 bg-indigo-500 rounded-full shadow hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </Slider.Root>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={togglePlayPause} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                {isPlaying ? <Pause className="w-4 h-4 text-gray-700" /> : <Play className="w-4 h-4 text-gray-700" />}
              </button>

              <div className="text-sm text-gray-500">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </div>

              <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4 text-gray-700" /> : <Volume2 className="w-4 h-4 text-gray-700" />}
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-400">Speed:</span>
                <div className="flex gap-1">
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 text-xs rounded-md transition-colors ${playbackSpeed === speed
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                <Maximize className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}