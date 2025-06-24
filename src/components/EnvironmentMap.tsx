import React, { useState } from 'react';
import { Map, MapPin, Home, Utensils, Bath, DoorOpen, Navigation } from 'lucide-react';

interface EnvironmentMapProps {
  speak: (text: string, priority?: 'normal' | 'high') => void;
}

interface MapRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
  color: string;
}

const EnvironmentMap: React.FC<EnvironmentMapProps> = ({ speak }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [userPosition, setUserPosition] = useState({ x: 150, y: 200 });

  const rooms: MapRoom[] = [
    {
      id: 'living_room',
      name: 'Living Room',
      x: 50,
      y: 150,
      width: 200,
      height: 150,
      icon: Home,
      color: 'bg-blue-500/30 border-blue-400'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      x: 300,
      y: 150,
      width: 150,
      height: 100,
      icon: Utensils,
      color: 'bg-emerald-500/30 border-emerald-400'
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      x: 300,
      y: 280,
      width: 100,
      height: 80,
      icon: Bath,
      color: 'bg-purple-500/30 border-purple-400'
    },
    {
      id: 'hallway',
      name: 'Hallway',
      x: 250,
      y: 150,
      width: 50,
      height: 210,
      icon: Navigation,
      color: 'bg-gray-500/30 border-gray-400'
    },
    {
      id: 'entrance',
      name: 'Entrance',
      x: 50,
      y: 320,
      width: 100,
      height: 40,
      icon: DoorOpen,
      color: 'bg-amber-500/30 border-amber-400'
    }
  ];

  const handleRoomClick = (room: MapRoom) => {
    setSelectedRoom(room.id);
    speak(`${room.name} selected. This room is located at coordinates ${room.x}, ${room.y} on the map.`);
  };

  const getCurrentRoom = () => {
    return rooms.find(room => 
      userPosition.x >= room.x && 
      userPosition.x <= room.x + room.width &&
      userPosition.y >= room.y && 
      userPosition.y <= room.y + room.height
    );
  };

  const describeLocation = () => {
    const currentRoom = getCurrentRoom();
    if (currentRoom) {
      speak(`You are currently in the ${currentRoom.name}.`);
    } else {
      speak("You are currently between rooms.");
    }
  };

  const getPathToRoom = (targetRoomId: string) => {
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    const currentRoom = getCurrentRoom();
    
    if (!targetRoom) return;
    
    if (currentRoom && currentRoom.id === targetRoomId) {
      speak(`You are already in the ${targetRoom.name}.`);
      return;
    }

    // Simple pathfinding - direct route
    const deltaX = (targetRoom.x + targetRoom.width/2) - userPosition.x;
    const deltaY = (targetRoom.y + targetRoom.height/2) - userPosition.y;
    
    let directions = [];
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) directions.push("head east");
      else directions.push("head west");
      if (deltaY > 0) directions.push("then go south");
      else if (deltaY < 0) directions.push("then go north");
    } else {
      if (deltaY > 0) directions.push("head south");
      else directions.push("head north");
      if (deltaX > 0) directions.push("then go east");
      else if (deltaX < 0) directions.push("then go west");
    }
    
    speak(`To reach the ${targetRoom.name}, ${directions.join(' ')}.`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Map className="w-8 h-8 text-blue-400" />
          <span>Interactive Environment Map</span>
        </h2>
        <p className="text-white/80 mb-6">
          Visual representation of your mapped indoor space
        </p>
      </div>

      {/* Map Container */}
      <div className="bg-gray-900 rounded-xl border border-white/20 p-6 overflow-hidden">
        <div className="relative w-full h-96 bg-gray-800 rounded-lg border border-gray-600">
          {/* Grid Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Rooms */}
          {rooms.map((room) => {
            const IconComponent = room.icon;
            const isSelected = selectedRoom === room.id;
            
            return (
              <div
                key={room.id}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all hover:opacity-80 ${
                  room.color
                } ${isSelected ? 'ring-2 ring-white' : ''}`}
                style={{
                  left: `${(room.x / 500) * 100}%`,
                  top: `${(room.y / 400) * 100}%`,
                  width: `${(room.width / 500) * 100}%`,
                  height: `${(room.height / 400) * 100}%`,
                }}
                onClick={() => handleRoomClick(room)}
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <IconComponent className="w-6 h-6 mx-auto mb-1 text-white" />
                    <span className="text-xs font-medium text-white">{room.name}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* User Position */}
          <div
            className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"
            style={{
              left: `${(userPosition.x / 500) * 100}%`,
              top: `${(userPosition.y / 400) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title="Your current position"
          />

          {/* Path Indicators */}
          {selectedRoom && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={`${(userPosition.x / 500) * 100}%`}
                y1={`${(userPosition.y / 400) * 100}%`}
                x2={`${((rooms.find(r => r.id === selectedRoom)?.x || 0) + (rooms.find(r => r.id === selectedRoom)?.width || 0)/2) / 500 * 100}%`}
                y2={`${((rooms.find(r => r.id === selectedRoom)?.y || 0) + (rooms.find(r => r.id === selectedRoom)?.height || 0)/2) / 400 * 100}%`}
                stroke="yellow"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Room List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const IconComponent = room.icon;
          const isSelected = selectedRoom === room.id;
          
          return (
            <button
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className={`p-4 rounded-lg border transition-all ${
                isSelected 
                  ? 'bg-blue-600/30 border-blue-400' 
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-8 h-8 text-blue-400" />
                <div className="text-left">
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-white/60">
                    {room.width}×{room.height} area
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={describeLocation}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          <MapPin className="w-5 h-5" />
          <span>Where Am I?</span>
        </button>

        {selectedRoom && (
          <button
            onClick={() => getPathToRoom(selectedRoom)}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
          >
            <Navigation className="w-5 h-5" />
            <span>Get Directions</span>
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Map Legend</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Your current position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-400 bg-blue-500/30 rounded"></div>
            <span>Rooms and spaces</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-0.5 bg-yellow-400" style={{ background: 'linear-gradient(to right, yellow 50%, transparent 50%)', backgroundSize: '10px 2px' }}></div>
            <span>Suggested path</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white bg-transparent rounded"></div>
            <span>Selected destination</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
        <h3 className="font-semibold mb-2">How to Use the Map:</h3>
        <ul className="text-sm space-y-1 text-white/80">
          <li>• Click on any room to select it as a destination</li>
          <li>• Your position is shown as a red dot</li>
          <li>• Selected rooms will show a suggested path</li>
          <li>• Use "Where Am I?" to hear your current location</li>
          <li>• Use "Get Directions" for turn-by-turn navigation</li>
        </ul>
      </div>
    </div>
  );
};

export default EnvironmentMap;