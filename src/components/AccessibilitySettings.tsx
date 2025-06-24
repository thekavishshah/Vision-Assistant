import React from 'react';
import { Settings, Volume2, Eye, Palette, Clock, Type } from 'lucide-react';

interface AccessibilitySettingsProps {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (value: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  speak: (text: string, priority?: 'normal' | 'high') => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  highContrast,
  setHighContrast,
  voiceSpeed,
  setVoiceSpeed,
  soundEnabled,
  setSoundEnabled,
  speak
}) => {
  const handleSettingChange = (setting: string, value: any) => {
    switch (setting) {
      case 'highContrast':
        setHighContrast(value);
        speak(value ? 'High contrast mode enabled' : 'High contrast mode disabled');
        break;
      case 'voiceSpeed':
        setVoiceSpeed(value);
        speak(`Voice speed set to ${value === 0.5 ? 'slow' : value === 1 ? 'normal' : 'fast'}`, 'high');
        break;
      case 'soundEnabled':
        setSoundEnabled(value);
        if (value) speak('Sound enabled');
        break;
    }
  };

  const testVoice = () => {
    speak('This is a test of the voice synthesis system. The voice speed is currently set to ' + 
          (voiceSpeed === 0.5 ? 'slow' : voiceSpeed === 1 ? 'normal' : 'fast') + '.');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
          <Settings className="w-8 h-8 text-blue-400" />
          <span>Accessibility Settings</span>
        </h2>
        <p className="text-white/80 mb-6">
          Customize your experience for optimal accessibility and comfort
        </p>
      </div>

      {/* Visual Settings */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Eye className="w-6 h-6 text-blue-400" />
          <span>Visual Settings</span>
        </h3>
        
        <div className="space-y-4">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-medium">High Contrast Mode</h4>
                <p className="text-sm text-white/60">Improve visibility with enhanced color contrast</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('highContrast', !highContrast)}
              className={`w-12 h-6 rounded-full transition-colors ${
                highContrast ? 'bg-yellow-500' : 'bg-gray-600'
              } relative`}
              aria-label={`High contrast ${highContrast ? 'enabled' : 'disabled'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Font Size (Future Implementation) */}
          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center space-x-3">
              <Type className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-medium">Font Size</h4>
                <p className="text-sm text-white/60">Increase text size for better readability</p>
              </div>
            </div>
            <select 
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
              disabled
            >
              <option>Normal</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Volume2 className="w-6 h-6 text-emerald-400" />
          <span>Audio Settings</span>
        </h3>
        
        <div className="space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-medium">Voice Feedback</h4>
                <p className="text-sm text-white/60">Enable or disable all voice announcements</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('soundEnabled', !soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-emerald-500' : 'bg-gray-600'
              } relative`}
              aria-label={`Sound ${soundEnabled ? 'enabled' : 'disabled'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Voice Speed */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-medium">Voice Speed</h4>
                <p className="text-sm text-white/60">Adjust how fast the voice speaks</p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.5"
                value={voiceSpeed}
                onChange={(e) => handleSettingChange('voiceSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                disabled={!soundEnabled}
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>Slow (0.5x)</span>
                <span>Normal (1x)</span>
                <span>Fast (2x)</span>
              </div>
              <div className="text-center">
                <button
                  onClick={testVoice}
                  disabled={!soundEnabled}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  Test Voice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Settings */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-purple-400" />
          <span>Navigation Preferences</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between opacity-50">
            <div>
              <h4 className="font-medium">Detailed Directions</h4>
              <p className="text-sm text-white/60">Include additional landmarks and details</p>
            </div>
            <button
              className="w-12 h-6 rounded-full bg-gray-600 relative"
              disabled
            >
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div>
              <h4 className="font-medium">Safety Warnings</h4>
              <p className="text-sm text-white/60">Alert about potential obstacles and hazards</p>
            </div>
            <button
              className="w-12 h-6 rounded-full bg-emerald-500 relative"
              disabled
            >
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Settings */}
      <div className="bg-red-600/20 border border-red-400/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-red-400" />
          <span>Emergency Settings</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between opacity-50">
            <div>
              <h4 className="font-medium">Emergency Contact</h4>
              <p className="text-sm text-white/60">Set up emergency contact information</p>
            </div>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              disabled
            >
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between opacity-50">
            <div>
              <h4 className="font-medium">Location Sharing</h4>
              <p className="text-sm text-white/60">Share location during emergency calls</p>
            </div>
            <button
              className="w-12 h-6 rounded-full bg-red-500 relative"
              disabled
            >
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
        <h3 className="font-semibold mb-2">Keyboard Shortcuts:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <ul className="space-y-1">
              <li><kbd className="bg-white/20 px-2 py-1 rounded text-xs">Ctrl + Space</kbd> - Voice command</li>
              <li><kbd className="bg-white/20 px-2 py-1 rounded text-xs">Ctrl + H</kbd> - Home screen</li>
              <li><kbd className="bg-white/20 px-2 py-1 rounded text-xs">Ctrl + C</kbd> - Camera view</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-1">
              <li><kbd className="bg-white/20 px-2 py-1 rounded text-xs">Ctrl + N</kbd> - Navigation</li>
              <li><kbd className="bg-white/20 px-2 py-1 rounded text-xs">Ctrl + S</kbd> - Settings</li>
              <li><kbd className="bg-white/20 px-2 py-1 rounded text-xs">Esc</kbd> - Stop current action</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;