import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, Utensils, Bath, DoorOpen } from 'lucide-react';

interface NavigationPanelProps {
  environmentMapped: boolean;
  speak: (text: string, priority?: 'normal' | 'high') => void;
}

interface Room {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  steps: number;
  direction: string;
  landmarks: string[];
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ environmentMapped, speak }) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [navigationInstructions, setNavigationInstructions] = useState<string[]>([]);

  const rooms: Room[] = [
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: Utensils,
      steps: 12,
      direction: 'Turn left, then straight',
      landmarks: ['dining table', 'counter', 'refrigerator']
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: Bath,
      steps: 8,
      direction: 'Turn right, then straight',
      landmarks: ['hallway', 'linen closet', 'bathroom door']
    },
    {
      id: 'front_door',
      name: 'Front Door',
      icon: DoorOpen,
      steps: 15,
      direction: 'Straight ahead',
      landmarks: ['living room', 'coat closet', 'entrance mat']
    },
    {
      id: 'living_room',
      name: 'Living Room',
      icon: Home,
      steps: 6,
      direction: 'Turn around and straight',
      landmarks: ['coffee table', 'sofa', 'TV stand']
    }
  ];

  const startNavigation = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    setSelectedDestination(roomId);
    setIsNavigating(true);
    setCurrentStep(0);

    // Generate navigation instructions
    const instructions = [
      `Starting navigation to ${room.name}`,
      `${room.direction}`,
      `Walk ${room.steps} steps total`,
      `You should pass: ${room.landmarks.join(', ')}`,
      `Arrival at ${room.name}`
    ];

    setNavigationInstructions(instructions);
    speak(`Starting navigation to ${room.name}. ${room.direction}. Walk ${room.steps} steps.`, 'high');

    // Simulate step-by-step navigation
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      
      if (stepCount <= room.steps) {
        // Provide periodic updates
        if (stepCount === Math.floor(room.steps / 3)) {
          speak(`You've walked ${stepCount} steps. Continue straight. You should be near the ${room.landmarks[0]}.`);
        } else if (stepCount === Math.floor(room.steps * 2 / 3)) {
          speak(`${stepCount} steps completed. Almost there. Look for the ${room.landmarks[1]}.`);
        } else if (stepCount === room.steps) {
          speak(`Destination reached! You have arrived at the ${room.name}.`, 'high');
          setIsNavigating(false);
          clearInterval(interval);
        }
        
        setCurrentStep(stepCount);
      }
    }, 1000);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentStep(0);
    setSelectedDestination('');
    speak('Navigation stopped.');
  };

  const getDirectionIcon = (direction: string) => {
    if (direction.includes('left')) return ArrowLeft;
    if (direction.includes('right')) return ArrowRight;
    if (direction.includes('straight') || direction.includes('ahead')) return ArrowUp;
    return ArrowUp;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Navigation className="w-8 h-8 text-emerald-400" />
          <span>Indoor Navigation</span>
        </h2>
        <p className="text-white/80 mb-6">
          Voice-guided navigation to help you move safely through your space
        </p>
      </div>

      {/* Navigation Status */}
      {isNavigating && (
        <div className="bg-emerald-600/20 border border-emerald-400/30 rounded-xl p-6">
          <div className="text-center mb-4">
            <Navigation className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-pulse" />
            <h3 className="text-xl font-semibold">
              Navigating to {rooms.find(r => r.id === selectedDestination)?.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/80">Progress</span>
            <span className="font-medium">
              {currentStep} / {rooms.find(r => r.id === selectedDestination)?.steps} steps
            </span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentStep / (rooms.find(r => r.id === selectedDestination)?.steps || 1)) * 100}%` 
              }}
            />
          </div>

          <button
            onClick={stopNavigation}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Stop Navigation
          </button>
        </div>
      )}

      {/* Room Selection */}
      {!isNavigating && (
        <div className="grid md:grid-cols-2 gap-4">
          {rooms.map((room) => {
            const IconComponent = room.icon;
            const DirectionIcon = getDirectionIcon(room.direction);
            
            return (
              <button
                key={room.id}
                onClick={() => startNavigation(room.id)}
                className="p-6 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all hover:scale-105 text-left"
              >
                <div className="flex items-start space-x-4">
                  <IconComponent className="w-8 h-8 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-white/80 mb-2">
                      <DirectionIcon className="w-4 h-4" />
                      <span>{room.direction}</span>
                    </div>
                    <p className="text-sm text-white/60">
                      {room.steps} steps • Landmarks: {room.landmarks.join(', ')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick Commands */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-amber-400" />
          <span>Voice Commands</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-blue-400">Navigation</h4>
            <ul className="space-y-1 text-white/80">
              <li>"Take me to the kitchen"</li>
              <li>"Go to bathroom"</li>
              <li>"Navigate to front door"</li>
              <li>"Stop navigation"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-emerald-400">Information</h4>
            <ul className="space-y-1 text-white/80">
              <li>"Where am I?"</li>
              <li>"How many steps left?"</li>
              <li>"What's around me?"</li>
              <li>"Repeat directions"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="bg-amber-600/20 border border-amber-400/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <ArrowUp className="w-6 h-6 text-amber-400" />
          <span>Safety Features</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Obstacle Detection</h4>
            <p className="text-white/80">
              Real-time camera analysis warns of obstacles in your path
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Emergency Stop</h4>
            <p className="text-white/80">
              Say "stop" or "emergency" to immediately halt navigation
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
        <h3 className="font-semibold mb-2">How Navigation Works:</h3>
        <ul className="text-sm space-y-1 text-white/80">
          <li>• Select your destination from the room list</li>
          <li>• Follow step-by-step voice instructions</li>
          <li>• Listen for landmark confirmations along the way</li>
          <li>• Say "repeat" to hear directions again</li>
          <li>• Say "stop" to cancel navigation at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default NavigationPanel;