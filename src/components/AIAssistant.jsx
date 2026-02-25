'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, MessageSquare, X } from 'lucide-react';
import { useMDFStore } from '@/store/store';

function MarkdownText({ text }) {
  // Simple markdown-like rendering for bold and newlines
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('• ') || part.startsWith('- ')) {
          return <span key={i} className="block ml-2">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function AIAssistant({ isFloating = false }) {
  const chatMessages = useMDFStore((s) => s.chatMessages);
  const addUserMessage = useMDFStore((s) => s.addUserMessage);
  const processingStage = useMDFStore((s) => s.processingStage);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(!isFloating);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addUserMessage(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'What is an MDF?',
    'Explain Identity Resolution',
    'How does Data Hygiene work?',
    'What is a Golden Record?',
  ];

  // If it's the floating version but currently closed, only render the FAB.
  if (isFloating && !isOpen) {
    return (
      <AnimatePresence>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 text-white"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <MessageSquare size={24} />
          {/* Notification dot if processing */}
          {processingStage !== 'idle' && processingStage !== 'complete' && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-pulse-dot" />
          )}
        </motion.button>
      </AnimatePresence>
    );
  }

  // The chat widget content
  const chatContent = (
    <div className={`glass-card flex flex-col ${isFloating ? 'h-[600px] w-[350px] shadow-2xl relative overflow-hidden' : 'h-full min-h-[600px] lg:min-h-0 min-[1440px]:h-[calc(100vh-105px)]'}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex-shrink-0 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50">
              <Bot size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">MDF Consultant</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${processingStage !== 'idle' && processingStage !== 'complete' ? 'bg-amber-500 animate-pulse-dot' : 'bg-emerald-500'}`} />
                <p className="text-sm font-medium text-slate-500">
                  {processingStage !== 'idle' && processingStage !== 'complete' ? 'Narrating simulation...' : 'Ready to assist'}
                </p>
              </div>
            </div>
          </div>
          {isFloating && (
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-violet-100'
                  : 'bg-indigo-100'
              }`}>
                {msg.role === 'assistant' ? (
                  <Sparkles size={14} className="text-violet-600" />
                ) : (
                  <User size={14} className="text-indigo-600" />
                )}
              </div>

              {/* Message bubble */}
              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block text-left px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.role === 'assistant'
                    ? 'bg-white border border-slate-200 text-slate-700'
                    : 'bg-indigo-600 text-white'
                }`}>
                  <MarkdownText text={msg.content} />
                </div>
                <p className="text-sm font-medium text-slate-400 mt-1.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator during simulation */}
        <AnimatePresence>
          {processingStage !== 'idle' && processingStage !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-100">
                <Sparkles size={14} className="text-violet-600 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-1.5 h-10 my-auto">
                <motion.div className="w-1.5 h-1.5 bg-violet-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 bg-violet-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-violet-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {chatMessages.length <= 2 && (
        <div className="px-5 pb-3 flex-shrink-0">
          <p className="text-base font-medium text-slate-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => addUserMessage(s)}
                className="px-3 py-1.5 text-base font-medium rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-200 flex-shrink-0 bg-slate-50 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about MDF concepts..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 transition-all duration-300 shadow-sm"
          />
          <motion.button
            onClick={handleSend}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={input.trim() ? { background: 'var(--gradient-primary)' } : { background: '#f1f5f9' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} className={input.trim() ? 'text-white' : 'text-slate-400'} />
          </motion.button>
        </div>
      </div>
    </div>
  );

  if (isFloating) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for floating widget */}
            <motion.div 
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-6 right-6 z-50 origin-bottom-right"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              {chatContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Not floating: return inline content directly
  return chatContent;
}
