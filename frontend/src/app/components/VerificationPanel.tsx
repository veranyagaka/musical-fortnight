import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Save,
  MessageSquare,
  History,
} from 'lucide-react';
import type { Detection, VerificationStatus } from '../data/mockDetections';
// import { Detection, VerificationStatus, VerificationLog } from '../data/mockDetections';

interface VerificationPanelProps {
  selectedDetection: Detection | null;
  onVerify: (id: string, status: VerificationStatus) => void;
  onUpdateComment: (id: string, comment: string) => void;
  onUpdateTimeframe: (id: string, startTime: number, endTime: number) => void;
  onReassignClass: (id: string, newType: 'person' | 'car' | 'truck') => void;
  onClose: () => void;
}

const colorMap = {
  person: '#6366f1',
  car: '#22c55e',
  truck: '#f59e0b',
};

const statusConfig = {
  verified: { icon: CheckCircle2, color: '#22c55e', label: 'Verified', bg: 'bg-emerald-50' },
  rejected: { icon: XCircle, color: '#ef4444', label: 'Rejected', bg: 'bg-red-50' },
  'needs-review': { icon: AlertTriangle, color: '#f59e0b', label: 'Needs Review', bg: 'bg-amber-50' },
  unreviewed: { icon: Clock, color: '#94a3b8', label: 'Unreviewed', bg: 'bg-gray-50' },
};

export function VerificationPanel({
  selectedDetection,
  onVerify,
  onUpdateComment,
  onUpdateTimeframe,
  onReassignClass,
  onClose,
}: VerificationPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingTimeframe, setEditingTimeframe] = useState(false);
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');
  const [comment, setComment] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const handleStartEdit = () => {
    if (!selectedDetection) return;
    setEditingTimeframe(true);
    setTempStartTime(formatTime(selectedDetection.startTime));
    setTempEndTime(formatTime(selectedDetection.endTime));
    setComment(selectedDetection.comment || '');
  };

  const handleSaveTimeframe = () => {
    if (!selectedDetection) return;
    const start = parseTime(tempStartTime);
    const end = parseTime(tempEndTime);
    if (start < end) {
      onUpdateTimeframe(selectedDetection.id, start, end);
    }
    setEditingTimeframe(false);
  };

  const handleSaveComment = () => {
    if (!selectedDetection) return;
    onUpdateComment(selectedDetection.id, comment);
  };

  if (collapsed) {
    return (
      <motion.div
        className="h-full bg-[#F8FAFC] border-l border-gray-200 flex flex-col items-center py-4 w-14"
        initial={{ width: 320 }}
        animate={{ width: 56 }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full bg-[#F8FAFC] border-l border-gray-200 flex flex-col w-80"
      initial={{ width: 56 }}
      animate={{ width: 320 }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm text-gray-900">Verification & Review</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {selectedDetection ? (
            <motion.div
              key={selectedDetection.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Detection Header */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colorMap[selectedDetection.type] }}
                    />
                    <span className="text-sm text-gray-900">
                      {selectedDetection.type.charAt(0).toUpperCase() + selectedDetection.type.slice(1)} #{selectedDetection.trackId}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">ID: {selectedDetection.id}</span>
                </div>

                {/* Status Badge */}
                {(() => {
                  const config = statusConfig[selectedDetection.verificationStatus];
                  const Icon = config.icon;
                  return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${config.bg}`}>
                      <Icon className="w-3 h-3" style={{ color: config.color }} />
                      <span style={{ color: config.color }}>{config.label}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Detection Details */}
              <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                <h3 className="text-xs text-gray-500 mb-2">Detection Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Class</span>
                    <span className="text-xs text-gray-700 capitalize">{selectedDetection.type}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Confidence</span>
                    <span className="text-xs text-gray-700">{(selectedDetection.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Start Time</span>
                    <span className="text-xs text-gray-700">{formatTime(selectedDetection.startTime)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">End Time</span>
                    <span className="text-xs text-gray-700">{formatTime(selectedDetection.endTime)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-gray-400 block">Duration</span>
                    <span className="text-xs text-gray-700">
                      {(selectedDetection.endTime - selectedDetection.startTime).toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Actions */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h3 className="text-xs text-gray-500 mb-2">Verification Actions</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onVerify(selectedDetection.id, 'verified')}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs transition-colors ${
                      selectedDetection.verificationStatus === 'verified'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirm
                  </button>
                  <button
                    onClick={() => onVerify(selectedDetection.id, 'rejected')}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs transition-colors ${
                      selectedDetection.verificationStatus === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => onVerify(selectedDetection.id, 'needs-review')}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs transition-colors ${
                      selectedDetection.verificationStatus === 'needs-review'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Flag
                  </button>
                  <button
                    onClick={handleStartEdit}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Edit Time
                  </button>
                </div>
              </div>

              {/* Timeframe Editor */}
              <AnimatePresence>
                {editingTimeframe && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-lg p-3 border border-indigo-200 space-y-2"
                  >
                    <h3 className="text-xs text-gray-500">Edit Timeframe</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Start</label>
                        <input
                          type="text"
                          value={tempStartTime}
                          onChange={(e) => setTempStartTime(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 bg-white text-gray-700"
                          placeholder="0:00"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">End</label>
                        <input
                          type="text"
                          value={tempEndTime}
                          onChange={(e) => setTempEndTime(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 bg-white text-gray-700"
                          placeholder="0:00"
                        />
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleSaveTimeframe}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-500 text-white rounded-md text-xs hover:bg-indigo-600 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTimeframe(false)}
                        className="px-2 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reassign Class */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h3 className="text-xs text-gray-500 mb-2">Reassign Object Class</h3>
                <div className="flex gap-1.5">
                  {(['person', 'car', 'truck'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => onReassignClass(selectedDetection.id, type)}
                      className={`flex-1 px-2 py-1.5 rounded-md text-xs transition-colors capitalize ${
                        selectedDetection.type === type
                          ? 'text-white'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                      style={selectedDetection.type === type ? { backgroundColor: colorMap[type] } : {}}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Field */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  <h3 className="text-xs text-gray-500">Analyst Notes</h3>
                </div>
                <textarea
                  value={comment || selectedDetection.comment || ''}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add notes about this detection..."
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 bg-white text-gray-700 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSaveComment}
                  className="mt-1.5 w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200 transition-colors"
                >
                  <Save className="w-3 h-3" />
                  Save Notes
                </button>
              </div>

              {/* Change History */}
              {selectedDetection.verificationLogs.length > 0 && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-1.5 mb-2">
                    <History className="w-3.5 h-3.5 text-gray-400" />
                    <h3 className="text-xs text-gray-500">Change History</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedDetection.verificationLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2 text-[11px]">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="text-gray-700">{log.action}</div>
                          <div className="text-gray-400">{log.timestamp}</div>
                          {log.details && <div className="text-gray-500 mt-0.5">{log.details}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">No segment selected</p>
              <p className="text-xs text-gray-400">Click a timeline segment to review</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
