import React, { useRef, useEffect, useState } from 'react';
import { Camera, Scan, Eye, AlertCircle } from 'lucide-react';

interface DetectedObject {
  id: string;
  name: string;
  distance: string;
  direction: string;
  confidence: number;
}

interface CameraViewProps {
  onObjectsDetected: (objects: DetectedObject[]) => void;
  speak: (text: string, priority?: 'normal' | 'high') => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onObjectsDetected, speak }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Simulated object detection data
  const mockObjects = [
    { name: 'chair', distance: '2 feet', direction: 'center', confidence: 0.95 },
    { name: 'table', distance: '4 feet', direction: 'left', confidence: 0.88 },
    { name: 'doorway', distance: '8 feet', direction: 'right', confidence: 0.92 },
    { name: 'wall', distance: '6 feet', direction: 'center', confidence: 0.98 },
    { name: 'plant', distance: '3 feet', direction: 'right', confidence: 0.75 },
  ];

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        speak('Camera activated. Point your device to scan the environment.');
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
      speak('Camera access failed. Please check your device permissions.', 'high');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startEnvironmentScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    speak('Starting environment scan. Please slowly move your camera around the room.');

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          simulateObjectDetection();
          speak('Environment scan complete. I have mapped your surroundings.');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const simulateObjectDetection = () => {
    // Simulate real-time object detection
    const detectedCount = Math.floor(Math.random() * 3) + 2;
    const objects = mockObjects
      .sort(() => Math.random() - 0.5)
      .slice(0, detectedCount)
      .map((obj, index) => ({
        ...obj,
        id: `obj-${index}-${Date.now()}`,
      }));

    setDetectedObjects(objects);
    onObjectsDetected(objects);

    // Announce detected objects
    if (objects.length > 0) {
      const announcement = objects
        .map(obj => `${obj.name} ${obj.distance} to your ${obj.direction}`)
        .join(', ');
      speak(`I can see: ${announcement}`);
    }
  };

  const describeScene = () => {
    if (detectedObjects.length === 0) {
      speak('No objects currently detected. Try scanning the environment first.');
      return;
    }

    const closest = detectedObjects.reduce((prev, current) => 
      parseFloat(prev.distance) < parseFloat(current.distance) ? prev : current
    );

    speak(`The closest object is a ${closest.name} approximately ${closest.distance} to your ${closest.direction}. There are ${detectedObjects.length} objects in view.`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Eye className="w-8 h-8 text-blue-400" />
          <span>Environment Vision</span>
        </h2>
        <p className="text-white/80 mb-6">
          Use your camera to scan and understand your surroundings
        </p>
      </div>

      {/* Camera Feed */}
      <div className="relative bg-black rounded-xl overflow-hidden">
        {cameraError ? (
          <div className="aspect-video flex items-center justify-center text-center p-8">
            <div>
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-medium">{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
            />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                <div className="text-center">
                  <Scan className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <div className="w-64 bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-white font-medium">Scanning... {scanProgress}%</p>
                </div>
              </div>
            )}

            {/* Object Detection Overlays */}
            {detectedObjects.map((obj, index) => (
              <div
                key={obj.id}
                className="absolute bg-emerald-500/80 text-white px-3 py-1 rounded-lg text-sm font-medium"
                style={{
                  top: `${20 + index * 15}%`,
                  left: obj.direction === 'left' ? '10%' : obj.direction === 'right' ? '70%' : '40%',
                }}
              >
                {obj.name} ({obj.distance})
              </div>
            ))}
          </>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={startEnvironmentScan}
          disabled={isScanning || !!cameraError}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          <Scan className="w-5 h-5" />
          <span>{isScanning ? 'Scanning...' : 'Scan Environment'}</span>
        </button>

        <button
          onClick={describeScene}
          disabled={!!cameraError}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span>Describe Scene</span>
        </button>

        <button
          onClick={simulateObjectDetection}
          disabled={!!cameraError}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          <Camera className="w-5 h-5" />
          <span>Detect Objects</span>
        </button>
      </div>

      {/* Detected Objects List */}
      {detectedObjects.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Eye className="w-6 h-6 text-emerald-400" />
            <span>Detected Objects</span>
          </h3>
          <div className="grid gap-3">
            {detectedObjects.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
              >
                <div>
                  <h4 className="font-medium capitalize">{obj.name}</h4>
                  <p className="text-sm text-white/60">
                    {obj.distance} to your {obj.direction}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-emerald-400">
                    {Math.round(obj.confidence * 100)}% confident
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
        <h3 className="font-semibold mb-2">How to Use:</h3>
        <ul className="text-sm space-y-1 text-white/80">
          <li>• Click "Scan Environment" to map your surroundings</li>
          <li>• Move your device slowly for best results</li>
          <li>• Use "Describe Scene" to hear about what's in front of you</li>
          <li>• Objects will be announced with distance and direction</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraView;