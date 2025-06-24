import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInterfaceProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onSpeak: (text: string, priority?: 'normal' | 'high') => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isListening,
  isSpeaking,
  onStartListening,
  onSpeak
}) => {
  const commonCommands = [
    { command: "What's in front of me?", description: "Identify objects ahead" },
    { command: "Take me to the kitchen", description: "Navigate to kitchen" },
    { command: "Scan my environment", description: "Map surroundings" },
    { command: "Help me cook", description: "Kitchen assistance" },
    { command: "What can I make?", description: "Recipe suggestions" },
    { command: "Where am I?", description: "Current location" },
    { command: "Emergency help", description: "Emergency assistance" },
    { command: "Settings", description: "Open accessibility settings" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Voice Status */}
        <div className="text-center mb-4">
          <div className={`flex items-center justify-center space-x-2 text-sm ${
            isSpeaking ? 'text-blue-400' : isListening ? 'text-red-400' : 'text-white/60'
          }`}>
            {isSpeaking ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Speaking...</span>
              </>
            ) : isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-pulse" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Ready for voice commands</span>
              </>
            )}
          </div>
        </div>

        {/* Common Commands */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {commonCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => onSpeak(cmd.command)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors"
              title={cmd.description}
            >
              "{cmd.command}"
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onSpeak("What's in front of me?")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Identify Objects
          </button>
          <button
            onClick={() => onSpeak("Help me navigate")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
          >
            Navigation Help
          </button>
          <button
            onClick={() => onSpeak("Emergency")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            Emergency
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;