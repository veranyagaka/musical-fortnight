import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Slider from '@radix-ui/react-slider';

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterSettings) => void;
}

export interface FilterSettings {
  minConfidence: number;
  minDuration: number;
  objectTypes: Set<string>;
}

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minConfidence, setMinConfidence] = useState(0);
  const [minDuration, setMinDuration] = useState(0);

  const handleConfidenceChange = (value: number[]) => {
    setMinConfidence(value[0]);
    onFilterChange({
      minConfidence: value[0] / 100,
      minDuration,
      objectTypes: new Set(['person', 'car', 'truck']),
    });
  };

  const handleDurationChange = (value: number[]) => {
    setMinDuration(value[0]);
    onFilterChange({
      minConfidence: minConfidence / 100,
      minDuration: value[0],
      objectTypes: new Set(['person', 'car', 'truck']),
    });
  };

  const resetFilters = () => {
    setMinConfidence(0);
    setMinDuration(0);
    onFilterChange({
      minConfidence: 0,
      minDuration: 0,
      objectTypes: new Set(['person', 'car', 'truck']),
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors border border-gray-200 text-sm"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Advanced Filters
        {(minConfidence > 0 || minDuration > 0) && (
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Minimum Confidence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500">Minimum Confidence</label>
                  <span className="text-xs text-gray-700">{minConfidence}%</span>
                </div>
                <Slider.Root
                  className="relative flex items-center w-full h-5"
                  value={[minConfidence]}
                  max={100}
                  step={5}
                  onValueChange={handleConfidenceChange}
                >
                  <Slider.Track className="relative h-1 w-full bg-gray-200 rounded-full">
                    <Slider.Range className="absolute h-full bg-indigo-500 rounded-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-3.5 h-3.5 bg-indigo-500 rounded-full shadow hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </Slider.Root>
                <p className="text-[11px] text-gray-400 mt-1">
                  Show detections with confidence above threshold
                </p>
              </div>

              {/* Minimum Duration */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500">Minimum Duration</label>
                  <span className="text-xs text-gray-700">{minDuration}s</span>
                </div>
                <Slider.Root
                  className="relative flex items-center w-full h-5"
                  value={[minDuration]}
                  max={30}
                  step={1}
                  onValueChange={handleDurationChange}
                >
                  <Slider.Track className="relative h-1 w-full bg-gray-200 rounded-full">
                    <Slider.Range className="absolute h-full bg-emerald-500 rounded-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-3.5 h-3.5 bg-emerald-500 rounded-full shadow hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </Slider.Root>
                <p className="text-[11px] text-gray-400 mt-1">
                  Show detections longer than this duration
                </p>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors text-xs"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
