import { useState, useCallback } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { Sidebar } from './components/Sidebar';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { VerificationPanel } from './components/VerificationPanel';
import { ObjectChip } from './components/ObjectChip';
import { AdvancedFilters, type FilterSettings } from './components/AdvancedFilters';
import { detections as initialDetections, VIDEO_DURATION, getStatistics, type Detection, type VerificationStatus, VIDEO_SRC } from './data/mockDetections';
// import { Detection } from './data/mockDetections';
import { Filter } from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['person', 'car', 'truck'])
  );
  const [advancedFilters, setAdvancedFilters] = useState<FilterSettings>({
    minConfidence: 0,
    minDuration: 0,
    objectTypes: new Set(['person', 'car', 'truck']),
  });
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [hoveredDetection, setHoveredDetection] = useState<Detection | null>(null);
  const [mode, setMode] = useState<'detection' | 'review'>('detection');
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [detectionData, setDetectionData] = useState<Detection[]>(initialDetections);

  const stats = getStatistics();

  const toggleFilter = (type: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveFilters(newFilters);
  };

  // Apply advanced filters to detections
  const filteredDetections = detectionData.filter((detection) => {
    if (!activeFilters.has(detection.type)) return false;
    if (detection.confidence < advancedFilters.minConfidence) return false;
    if (detection.endTime - detection.startTime < advancedFilters.minDuration) return false;
    return true;
  });

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleDetectionHover = (detection: Detection | null) => {
    setHoveredDetection(detection);
  };

  const handleVerify = useCallback((id: string, status: VerificationStatus) => {
    setDetectionData((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newLog = {
            id: `log-${Date.now()}`,
            action: status === 'verified' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Flagged for Review',
            timestamp: new Date().toLocaleString(),
            details: `Status changed to ${status}`,
          };
          return {
            ...d,
            verificationStatus: status,
            verificationLogs: [...d.verificationLogs, newLog],
          };
        }
        return d;
      })
    );
    // Update selected detection if it's the one being modified
    setSelectedDetection((prev) => {
      if (prev?.id === id) {
        const updated = detectionData.find((d) => d.id === id);
        if (updated) {
          const newLog = {
            id: `log-${Date.now()}`,
            action: status === 'verified' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Flagged for Review',
            timestamp: new Date().toLocaleString(),
            details: `Status changed to ${status}`,
          };
          return { ...updated, verificationStatus: status, verificationLogs: [...updated.verificationLogs, newLog] };
        }
      }
      return prev;
    });
  }, [detectionData]);

  const handleUpdateComment = useCallback((id: string, comment: string) => {
    setDetectionData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, comment } : d))
    );
  }, []);

  const handleUpdateTimeframe = useCallback((id: string, startTime: number, endTime: number) => {
    setDetectionData((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newLog = {
            id: `log-${Date.now()}`,
            action: 'Timeframe Updated',
            timestamp: new Date().toLocaleString(),
            details: `Changed to ${Math.floor(startTime / 60)}:${String(Math.floor(startTime % 60)).padStart(2, '0')} - ${Math.floor(endTime / 60)}:${String(Math.floor(endTime % 60)).padStart(2, '0')}`,
          };
          return { ...d, startTime, endTime, verificationLogs: [...d.verificationLogs, newLog] };
        }
        return d;
      })
    );
  }, []);

  const handleReassignClass = useCallback((id: string, newType: 'person' | 'car' | 'truck') => {
    setDetectionData((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newLog = {
            id: `log-${Date.now()}`,
            action: 'Class Reassigned',
            timestamp: new Date().toLocaleString(),
            details: `Changed from ${d.type} to ${newType}`,
          };
          return { ...d, type: newType, verificationLogs: [...d.verificationLogs, newLog] };
        }
        return d;
      })
    );
  }, []);

  const handleSelectDetection = (detection: Detection) => {
    // Find the latest version from detectionData
    const latest = detectionData.find((d) => d.id === detection.id);
    setSelectedDetection(latest || detection);
  };

  // Review progress
  const reviewProgress = {
    total: detectionData.length,
    verified: detectionData.filter((d) => d.verificationStatus === 'verified').length,
    remaining: detectionData.filter((d) => d.verificationStatus === 'unreviewed' || d.verificationStatus === 'needs-review').length,
  };

  const isReviewMode = mode === 'review';

  return (
    <div className="h-screen flex flex-col bg-[#F1F5F9]">
      {/* Navigation Bar */}
      <NavigationBar mode={mode} onModeChange={setMode} reviewProgress={reviewProgress} />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Section - 60% */}
          <div className="flex-[6] flex flex-col min-h-0">
            {/* Object Filter Chips */}
            <div className="bg-white px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="text-xs">Filters:</span>
                </div>
                <ObjectChip
                  type="person"
                  count={stats.person.count}
                  active={activeFilters.has('person')}
                  onClick={() => toggleFilter('person')}
                />
                <ObjectChip
                  type="car"
                  count={stats.car.count}
                  active={activeFilters.has('car')}
                  onClick={() => toggleFilter('car')}
                />
                <ObjectChip
                  type="truck"
                  count={stats.truck.count}
                  active={activeFilters.has('truck')}
                  onClick={() => toggleFilter('truck')}
                />
                <div className="ml-auto">
                  <AdvancedFilters onFilterChange={setAdvancedFilters} />
                </div>
                {activeFilters.size === 0 && (
                  <span className="text-xs text-gray-400 ml-2">
                    Select at least one filter to view detections
                  </span>
                )}
              </div>
            </div>

            <VideoPlayer
              videoSrc={VIDEO_SRC}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
              duration={VIDEO_DURATION}
              detections={filteredDetections}
              activeFilters={activeFilters}
              onDetectionHover={handleDetectionHover}
              hoveredDetection={hoveredDetection}
            />
          </div>

          {/* Timeline Section - 40% */}
          <div className="flex-[4] min-h-0">
            <Timeline
              currentTime={currentTime}
              duration={VIDEO_DURATION}
              detections={filteredDetections}
              onSeek={handleSeek}
              activeFilters={activeFilters}
              onDetectionHover={handleDetectionHover}
              hoveredDetection={hoveredDetection}
              isReviewMode={isReviewMode}
              onVerify={handleVerify}
              onSelectDetection={handleSelectDetection}
            />
          </div>
        </div>

        {/* Right Panel - Analytics or Verification */}
        {isReviewMode ? (
          <VerificationPanel
            selectedDetection={selectedDetection}
            onVerify={handleVerify}
            onUpdateComment={handleUpdateComment}
            onUpdateTimeframe={handleUpdateTimeframe}
            onReassignClass={handleReassignClass}
            onClose={() => setSelectedDetection(null)}
          />
        ) : (
          showAnalytics && <AnalyticsPanel onClose={() => setShowAnalytics(false)} />
        )}
      </div>
    </div>
  );
}
