import React from 'react';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface DetectedObject {
  id: string;
  name: string;
  distance: string;
  direction: string;
  confidence: number;
}

interface ObjectDetectionProps {
  objects: DetectedObject[];
  speak: (text: string, priority?: 'normal' | 'high') => void;
}

const ObjectDetection: React.FC<ObjectDetectionProps> = ({ objects, speak }) => {
  const announceObject = (obj: DetectedObject) => {
    speak(`${obj.name} detected ${obj.distance} to your ${obj.direction}. Confidence: ${Math.round(obj.confidence * 100)} percent.`);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-emerald-400';
    if (confidence >= 0.7) return 'text-amber-400';
    return 'text-red-400';
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'left': return '←';
      case 'right': return '→';
      case 'center': return '↑';
      default: return '•';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          <Eye className="w-6 h-6 text-blue-400" />
          <span>Detected Objects</span>
        </h3>
        <span className="text-sm text-white/60">
          {objects.length} objects in view
        </span>
      </div>

      {objects.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No objects currently detected</p>
          <p className="text-sm">Start scanning to identify objects in your environment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {objects.map((obj) => (
            <div
              key={obj.id}
              className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors cursor-pointer"
              onClick={() => announceObject(obj)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getDirectionIcon(obj.direction)}
                </div>
                <div>
                  <h4 className="font-medium capitalize text-lg">{obj.name}</h4>
                  <p className="text-sm text-white/70">
                    {obj.distance} • {obj.direction}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${getConfidenceColor(obj.confidence)}`}>
                  {Math.round(obj.confidence * 100)}%
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {obj.confidence >= 0.8 ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {objects.length > 0 && (
        <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
          <p className="text-sm text-white/80">
            <strong>Tip:</strong> Click on any object to hear its details announced aloud. 
            Objects with high confidence (green) are more reliably identified.
          </p>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;