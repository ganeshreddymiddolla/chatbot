
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { ChatInput } from './components/ChatInput.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import { LiveConversation } from './components/LiveConversation.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { VoiceTraining } from './components/VoiceTraining.tsx';
import { useChat } from './hooks/useChat.ts';
import { useSpeech } from './hooks/useSpeech.ts';
import type { Message } from './types.ts';
import { BotIcon } from './components/Icons.tsx';
import { AnimatePresence, motion } from 'framer-motion';

type AppState = 'training' | 'chat';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('training');
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  
  const { messages, sendMessage, isLoading, error: chatError } = useChat();
  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    testSpeak,
    cancelSpeaking,
    voices,
    analyser,
    error: speechError,
  } = useSpeech({ onSpeechEnd: (transcript) => handleSendMessage(transcript) });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    if (appState === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, appState]);

  const handleSpeak = (text: string) => {
    if (isListening) stopListening();
    speak(text, selectedVoiceURI);
  };

  useEffect(() => {
    if (appState !== 'chat' || isLiveMode) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'model' && lastMessage.text && lastMessage.id !== lastSpokenMessageId && !isLoading) {
      handleSpeak(lastMessage.text);
      setLastSpokenMessageId(lastMessage.id);
    }
  }, [messages, isLoading, appState, selectedVoiceURI, isLiveMode, handleSpeak]);

  const handleSendMessage = (text: string) => {
    if (isSpeaking) cancelSpeaking();
    sendMessage(text);
  };

  const toggleLiveMode = () => {
    setIsLiveMode(prev => !prev);
    if (isSpeaking) cancelSpeaking();
    if (isListening) stopListening();
  };

  const handleTrainingComplete = () => {
    if (voices.length > 0) {
      const usVoices = voices.filter(v => v.lang.startsWith('en'));
      let bestVoice = usVoices.find(v => v.name.includes('Google') && v.lang === 'en-US');
      if (!bestVoice) bestVoice = usVoices.find(v => v.default);
      if (!bestVoice) bestVoice = usVoices[0];
      if (!bestVoice) bestVoice = voices[0];
      if (bestVoice) setSelectedVoiceURI(bestVoice.voiceURI);
    }
    setAppState('chat');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {appState === 'training' ? (
          <motion.div key="training" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <VoiceTraining 
              onTrainingComplete={handleTrainingComplete}
              startListening={startListening}
              stopListening={stopListening}
              isListening={isListening}
              analyser={analyser}
              error={speechError}
            />
          </motion.div>
        ) : (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col h-screen">
            <Header onSettingsClick={() => setIsSettingsOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onSpeak={() => handleSpeak(msg.text)}
                  isStreaming={isLoading && index === messages.length - 1 && msg.role === 'model'}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex items-start space-x-4 animate-pulse">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <BotIcon className="text-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </main>
            <footer className="bg-white/50 backdrop-blur-lg border-t border-slate-200/80 p-4">
              {chatError && (
                <div className="text-center text-red-500 text-sm mb-2">
                  <p>Error: {chatError}</p>
                </div>
              )}
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading}
                onMicClick={toggleLiveMode}
              />
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isLiveMode && (
          <LiveConversation
            onExit={toggleLiveMode}
            isListening={isListening}
            isSpeaking={isSpeaking}
            startListening={startListening}
            stopListening={stopListening}
            analyser={analyser}
            lastMessage={messages[messages.length - 1]}
            error={speechError}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            voices={voices}
            selectedVoiceURI={selectedVoiceURI}
            onVoiceChange={setSelectedVoiceURI}
            testSpeak={testSpeak}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
