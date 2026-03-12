// Mock detection data for drone video analytics
// src/app/data/mockDetections.ts
export const VIDEO_SRC = '/output_video.mp4';

// ...your existing exported detections, getStatistics, etc.

export type VerificationStatus = 'unreviewed' | 'verified' | 'rejected' | 'needs-review';

export interface VerificationLog {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Detection {
  id: string;
  type: 'person' | 'car' | 'truck';
  startTime: number;
  endTime: number;
  confidence: number;
  trackId: number;
  verificationStatus: VerificationStatus;
  comment?: string;
  verificationLogs: VerificationLog[];
  frames: {
    time: number;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
}

// Video duration in seconds
export const VIDEO_DURATION = 180; // 3 minutes

export const detections: Detection[] = [
  // Person detections
  {
    id: 'p1',
    type: 'person',
    startTime: 5,
    endTime: 25,
    confidence: 0.92,
    trackId: 23,
    verificationStatus: 'verified',
    comment: '',
    verificationLogs: [
      { id: 'log1', action: 'Verified', timestamp: '2026-02-27 09:15', details: 'Confirmed pedestrian' },
    ],
    frames: [
      { time: 5, bbox: { x: 20, y: 30, width: 60, height: 120 } },
      { time: 10, bbox: { x: 25, y: 30, width: 60, height: 120 } },
      { time: 15, bbox: { x: 30, y: 35, width: 60, height: 120 } },
      { time: 20, bbox: { x: 35, y: 35, width: 60, height: 120 } },
      { time: 25, bbox: { x: 40, y: 40, width: 60, height: 120 } },
    ],
  },
  {
    id: 'p2',
    type: 'person',
    startTime: 18,
    endTime: 45,
    confidence: 0.88,
    trackId: 41,
    verificationStatus: 'needs-review',
    comment: 'Partially occluded — check if valid',
    verificationLogs: [],
    frames: [
      { time: 18, bbox: { x: 300, y: 150, width: 50, height: 110 } },
      { time: 25, bbox: { x: 320, y: 155, width: 50, height: 110 } },
      { time: 35, bbox: { x: 340, y: 160, width: 50, height: 110 } },
      { time: 45, bbox: { x: 360, y: 165, width: 50, height: 110 } },
    ],
  },
  {
    id: 'p3',
    type: 'person',
    startTime: 60,
    endTime: 90,
    confidence: 0.95,
    trackId: 67,
    verificationStatus: 'unreviewed',
    comment: '',
    verificationLogs: [],
    frames: [
      { time: 60, bbox: { x: 450, y: 200, width: 55, height: 115 } },
      { time: 70, bbox: { x: 470, y: 200, width: 55, height: 115 } },
      { time: 80, bbox: { x: 490, y: 200, width: 55, height: 115 } },
      { time: 90, bbox: { x: 510, y: 200, width: 55, height: 115 } },
    ],
  },
  {
    id: 'p4',
    type: 'person',
    startTime: 95,
    endTime: 115,
    confidence: 0.85,
    trackId: 82,
    verificationStatus: 'rejected',
    comment: 'False positive — shadow artifact',
    verificationLogs: [
      { id: 'log2', action: 'Rejected', timestamp: '2026-02-27 09:20', details: 'Shadow artifact' },
    ],
    frames: [
      { time: 95, bbox: { x: 150, y: 100, width: 52, height: 112 } },
      { time: 105, bbox: { x: 170, y: 100, width: 52, height: 112 } },
      { time: 115, bbox: { x: 190, y: 100, width: 52, height: 112 } },
    ],
  },
  {
    id: 'p5',
    type: 'person',
    startTime: 130,
    endTime: 165,
    confidence: 0.91,
    trackId: 103,
    verificationStatus: 'unreviewed',
    comment: '',
    verificationLogs: [],
    frames: [
      { time: 130, bbox: { x: 600, y: 250, width: 58, height: 118 } },
      { time: 145, bbox: { x: 620, y: 250, width: 58, height: 118 } },
      { time: 160, bbox: { x: 640, y: 250, width: 58, height: 118 } },
      { time: 165, bbox: { x: 650, y: 250, width: 58, height: 118 } },
    ],
  },

  // Car detections
  {
    id: 'c1',
    type: 'car',
    startTime: 10,
    endTime: 35,
    confidence: 0.94,
    trackId: 12,
    verificationStatus: 'verified',
    comment: '',
    verificationLogs: [
      { id: 'log3', action: 'Verified', timestamp: '2026-02-27 09:18', details: 'Sedan confirmed' },
    ],
    frames: [
      { time: 10, bbox: { x: 100, y: 250, width: 120, height: 80 } },
      { time: 20, bbox: { x: 200, y: 250, width: 120, height: 80 } },
      { time: 30, bbox: { x: 300, y: 250, width: 120, height: 80 } },
      { time: 35, bbox: { x: 350, y: 250, width: 120, height: 80 } },
    ],
  },
  {
    id: 'c2',
    type: 'car',
    startTime: 50,
    endTime: 85,
    confidence: 0.89,
    trackId: 34,
    verificationStatus: 'unreviewed',
    comment: '',
    verificationLogs: [],
    frames: [
      { time: 50, bbox: { x: 500, y: 300, width: 115, height: 75 } },
      { time: 65, bbox: { x: 520, y: 300, width: 115, height: 75 } },
      { time: 80, bbox: { x: 540, y: 300, width: 115, height: 75 } },
      { time: 85, bbox: { x: 550, y: 300, width: 115, height: 75 } },
    ],
  },
  {
    id: 'c3',
    type: 'car',
    startTime: 100,
    endTime: 125,
    confidence: 0.96,
    trackId: 56,
    verificationStatus: 'unreviewed',
    comment: '',
    verificationLogs: [],
    frames: [
      { time: 100, bbox: { x: 250, y: 280, width: 125, height: 82 } },
      { time: 110, bbox: { x: 280, y: 280, width: 125, height: 82 } },
      { time: 120, bbox: { x: 310, y: 280, width: 125, height: 82 } },
      { time: 125, bbox: { x: 325, y: 280, width: 125, height: 82 } },
    ],
  },
  {
    id: 'c4',
    type: 'car',
    startTime: 140,
    endTime: 175,
    confidence: 0.87,
    trackId: 78,
    verificationStatus: 'needs-review',
    comment: '',
    verificationLogs: [],
    frames: [
      { time: 140, bbox: { x: 400, y: 320, width: 118, height: 78 } },
      { time: 155, bbox: { x: 430, y: 320, width: 118, height: 78 } },
      { time: 170, bbox: { x: 460, y: 320, width: 118, height: 78 } },
      { time: 175, bbox: { x: 475, y: 320, width: 118, height: 78 } },
    ],
  },

  // Truck detections
  {
    id: 't1',
    type: 'truck',
    startTime: 30,
    endTime: 65,
    confidence: 0.93,
    trackId: 8,
    verificationStatus: 'verified',
    comment: 'Delivery truck',
    verificationLogs: [
      { id: 'log4', action: 'Verified', timestamp: '2026-02-27 09:22', details: 'Delivery truck confirmed' },
    ],
    frames: [
      { time: 30, bbox: { x: 50, y: 200, width: 160, height: 120 } },
      { time: 45, bbox: { x: 100, y: 200, width: 160, height: 120 } },
      { time: 60, bbox: { x: 150, y: 200, width: 160, height: 120 } },
      { time: 65, bbox: { x: 175, y: 200, width: 160, height: 120 } },
    ],
  },
  {
    id: 't2',
    type: 'truck',
    startTime: 110,
    endTime: 145,
    confidence: 0.91,
    trackId: 45,
    verificationStatus: 'unreviewed',
    comment: '',
    verificationLogs: [],
    frames: [
      { time: 110, bbox: { x: 350, y: 180, width: 170, height: 125 } },
      { time: 125, bbox: { x: 380, y: 180, width: 170, height: 125 } },
      { time: 140, bbox: { x: 410, y: 180, width: 170, height: 125 } },
      { time: 145, bbox: { x: 425, y: 180, width: 170, height: 125 } },
    ],
  },
];

// Calculate statistics
export const getStatistics = () => {
  const stats = {
    person: { count: 0, totalTime: 0, avgConfidence: 0, detections: [] as Detection[] },
    car: { count: 0, totalTime: 0, avgConfidence: 0, detections: [] as Detection[] },
    truck: { count: 0, totalTime: 0, avgConfidence: 0, detections: [] as Detection[] },
  };

  detections.forEach((detection) => {
    const type = detection.type;
    stats[type].count++;
    stats[type].totalTime += detection.endTime - detection.startTime;
    stats[type].avgConfidence += detection.confidence;
    stats[type].detections.push(detection);
  });

  // Calculate averages
  Object.keys(stats).forEach((key) => {
    const type = key as keyof typeof stats;
    if (stats[type].count > 0) {
      stats[type].avgConfidence /= stats[type].count;
    }
  });

  return stats;
};

// Generate heatmap data (activity per time bucket)
export const getHeatmapData = (bucketSize = 10) => {
  const buckets = Math.ceil(VIDEO_DURATION / bucketSize);
  const heatmap = Array.from({ length: buckets }, (_, i) => ({
    time: i * bucketSize,
    person: 0,
    car: 0,
    truck: 0,
    total: 0,
  }));

  detections.forEach((detection) => {
    const startBucket = Math.floor(detection.startTime / bucketSize);
    const endBucket = Math.floor(detection.endTime / bucketSize);
    
    for (let i = startBucket; i <= endBucket && i < buckets; i++) {
      heatmap[i][detection.type]++;
      heatmap[i].total++;
    }
  });

  return heatmap;
};
