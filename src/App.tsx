import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Mic, MicOff, Camera, Navigation, Home, Settings, Volume2, VolumeX, AlertTriangle, MapPin } from 'lucide-react';
import CameraView from './components/CameraView';
import NavigationPanel from './components/NavigationPanel';
import ObjectDetection from './components/ObjectDetection';
import VoiceInterface from './components/VoiceInterface';
import EnvironmentMap from './components/EnvironmentMap';
import TaskAssistant from './components/TaskAssistant';
import AccessibilitySettings from './components/AccessibilitySettings';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'camera' | 'navigation' | 'map' | 'tasks' | 'settings'>('home');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [environmentMapped, setEnvironmentMapped] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [detectedObjects, setDetectedObjects] = useState<Array<{id: string, name: string, distance: string, direction: string, confidence: number}>>([]);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Text-to-speech function
  const speak = useCallback((text: string, priority: 'normal' | 'high' = 'normal') => {
    if (!soundEnabled) return;
    
    if (priority === 'high') {
      speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.volume = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, [soundEnabled, voiceSpeed]);

  // Voice recognition setup
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      speak('Speech recognition not supported on this device', 'high');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      speak('Listening...');
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setLastCommand(command);
      handleVoiceCommand(command);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak('Sorry, I didn\'t catch that. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [speak]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command:', command);

    if (command.includes('scan') || command.includes('map') || command.includes('environment')) {
      setCurrentView('camera');
      speak('Starting environment scan. Please slowly move your camera around the room.');
    } else if (command.includes('navigate') || command.includes('go to') || command.includes('take me')) {
      setCurrentView('navigation');
      if (command.includes('kitchen')) {
        speak('Navigating to kitchen. Turn left and walk straight for 10 steps.');
      } else if (command.includes('bathroom')) {
        speak('Navigating to bathroom. Turn right and walk 5 steps forward.');
      } else if (command.includes('door')) {
        speak('Navigating to front door. Walk straight ahead for 8 steps.');
      } else {
        speak('Navigation mode activated. Where would you like to go?');
      }
    } else if (command.includes('what') && (command.includes('see') || command.includes('front'))) {
      setCurrentView('camera');
      // Simulate object detection
      const objects = ['chair', 'table', 'doorway', 'wall'];
      const randomObject = objects[Math.floor(Math.random() * objects.length)];
      speak(`I can see a ${randomObject} approximately 3 feet in front of you.`);
    } else if (command.includes('cook') || command.includes('kitchen') || command.includes('recipe')) {
      setCurrentView('tasks');
      speak('Kitchen assistant activated. I can see tomatoes, onions, and eggs on your counter. Would you like a recipe suggestion?');
    } else if (command.includes('help') || command.includes('emergency')) {
      speak('Emergency mode activated. Say "call help" to contact emergency services, or "I\'m okay" to continue.', 'high');
    } else if (command.includes('settings')) {
      setCurrentView('settings');
      speak('Opening accessibility settings.');
    } else if (command.includes('home')) {
      setCurrentView('home');
      speak('Returned to home screen.');
    } else {
      // Simulate Claude API response
      speak('I understand you said: ' + command + '. How can I help you with that?');
    }
  }, [speak]);

  // Welcome message on app load
  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Welcome to your Vision Assistant. I\'m here to help you navigate and understand your environment. Say "help" to get started, or tap the microphone to give me a command.');
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        startListening();
      } else if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        setCurrentView('home');
        speak('Home screen');
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        setCurrentView('camera');
        speak('Camera view');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [startListening, speak]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    speak(soundEnabled ? 'Sound disabled' : 'Sound enabled');
  };

  const containerClass = `min-h-screen transition-all duration-300 ${
    highContrast 
      ? 'bg-black text-yellow-300' 
      : 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white'
  }`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <header className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Vision Assistant</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSound}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => setCurrentView('settings')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'camera', label: 'Environment', icon: Camera },
              { id: 'navigation', label: 'Navigate', icon: Navigation },
              { id: 'map', label: 'Map', icon: MapPin },
              { id: 'tasks', label: 'Tasks', icon: AlertTriangle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentView(id as any);
                  speak(`${label} selected`);
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                }`}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Main Voice Control */}
          <div className="text-center mb-8">
            <button
              onClick={startListening}
              disabled={isListening || isSpeaking}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isListening
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } ${isSpeaking ? 'opacity-50' : ''}`}
              aria-label={isListening ? 'Listening...' : 'Start voice command'}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            <p className="mt-4 text-lg">
              {isListening ? 'Listening...' : 'Tap to speak or press Ctrl+Space'}
            </p>
            {lastCommand && (
              <p className="mt-2 text-sm text-white/60">
                Last command: "{lastCommand}"
              </p>
            )}
          </div>

          {/* Content Views */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {currentView === 'home' && (
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold mb-6">Your Personal Vision Assistant</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white/10 p-6 rounded-xl">
                    <Camera className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Environment Scanning</h3>
                    <p className="text-white/80">Map your surroundings and identify objects in real-time</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl">
                    <Navigation className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Voice Navigation</h3>
                    <p className="text-white/80">Get spoken directions to navigate indoor spaces safely</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl">
                    <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Task Assistance</h3>
                    <p className="text-white/80">Get help with cooking, finding items, and daily activities</p>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-blue-600/20 rounded-lg border border-blue-400/30">
                  <h3 className="text-lg font-semibold mb-2">Quick Voice Commands:</h3>
                  <div className="text-sm space-y-1 text-white/80">
                    <p>"Scan my environment" - Start mapping your space</p>
                    <p>"What's in front of me?" - Identify objects ahead</p>
                    <p>"Take me to the kitchen" - Navigate to a room</p>
                    <p>"Help me cook" - Kitchen assistance mode</p>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'camera' && <CameraView onObjectsDetected={setDetectedObjects} speak={speak} />}
            {currentView === 'navigation' && <NavigationPanel environmentMapped={environmentMapped} speak={speak} />}
            {currentView === 'map' && <EnvironmentMap speak={speak} />}
            {currentView === 'tasks' && <TaskAssistant speak={speak} />}
            {currentView === 'settings' && (
              <AccessibilitySettings
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                voiceSpeed={voiceSpeed}
                setVoiceSpeed={setVoiceSpeed}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                speak={speak}
              />
            )}
          </div>

          {/* Status Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between text-sm text-white/60">
            <div className="flex items-center space-x-4">
              <span className={`flex items-center space-x-2 ${isSpeaking ? 'text-blue-400' : ''}`}>
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Speaking...' : 'Ready'}</span>
              </span>
              {detectedObjects.length > 0 && (
                <span className="flex items-center space-x-2 text-emerald-400">
                  <Eye className="w-4 h-4" />
                  <span>{detectedObjects.length} objects detected</span>
                </span>
              )}
            </div>
            <div className="text-right">
              <p>Press Ctrl+H for home, Ctrl+C for camera, Ctrl+Space to speak</p>
            </div>
          </div>
        </div>
      </main>

      {/* Voice Interface Component */}
      <VoiceInterface
        isListening={isListening}
        isSpeaking={isSpeaking}
        onStartListening={startListening}
        onSpeak={speak}
      />
    </div>
  );
}

export default App;