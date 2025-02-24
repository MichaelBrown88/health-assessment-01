'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/core/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { PaywallModal } from '@/components/premium/PaywallModal';
import { Button } from '@/components/core/button';
import { Lock, Send, Loader2, X } from 'lucide-react';
import { generateAIResponse } from '@/utils/ai-utils'

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIHealthCoachProps {
  assessmentData: {
    answers: Record<string, unknown>;
    healthCalculations: {
      bmi: number | null;
      bmr: number | null;
      tdee: number | null;
      bodyFat: number | null;
      isBodyFatEstimated: boolean;
    };
    score: number;
  };
  onClose?: () => void;
}

const EXAMPLE_QUESTIONS = [
  "Based on my results, how can I improve my exercise routine?",
  "What nutrition changes would help me reach my goals?",
  "How can I better manage my stress levels?"
];

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 p-2">
    <motion.div
      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <motion.div
      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

export function AIHealthCoach({ assessmentData, onClose }: AIHealthCoachProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'assistant',
    content: "👋 Hi! I'm your AI Health Coach. I've analyzed your assessment results and I'm here to help you optimize your health and performance. What would you like to know?",
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Always allow access in development mode
  const isPremium = process.env.NODE_ENV === 'development' ? true : user?.isPremium;

  if (!isPremium) {
    return <PaywallModal isOpen={true} onClose={onClose} />;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const handleSuggestedQuestion = async (q: string) => {
    setQuestion(q);
    handleAskQuestion(q);
  };

  const handleAskQuestion = async (questionText: string = question) => {
    // In development mode, don't require authentication
    if (process.env.NODE_ENV !== 'development' && !user) {
      setShowPaywall(true);
      return;
    }

    if (!questionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: questionText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    // Add a delay between requests to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await fetch('/api/health-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Skip token in development mode
          ...(process.env.NODE_ENV !== 'development' && user 
            ? { 'Authorization': `Bearer ${await user.getIdToken()}` }
            : {})
        },
        body: JSON.stringify({
          question: questionText,
          context: assessmentData
        }),
      });

      if (response.status === 429) {
        const errorData = await response.json();
        toast({
          title: "Rate Limit",
          description: errorData.error || "Please wait a moment before asking another question.",
          variant: "destructive",
          duration: 5000,
        });
        
        // Add a system message about the rate limit
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I'm currently handling many requests. Please wait a few seconds before asking another question.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Add a more helpful error message to the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to get response. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl mx-4 bg-black/80 deep-space-border rounded-xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="p-4 deep-space-gradient flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {!user && <Lock className="w-4 h-4" />}
              AI Health Coach
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-[400px] overflow-y-auto space-y-2 p-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  message.type === 'user' 
                    ? 'deep-space-gradient shadow-glow' 
                    : 'bg-black/40 deep-space-border'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <textarea
                value={question}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask your health coach a question..."
                className="flex-1 min-h-[45px] max-h-[45px] bg-black/40 border-0 focus:ring-1 focus:ring-blue-500 rounded-lg p-2 resize-none"
              />
              <Button
                onClick={() => handleAskQuestion()}
                disabled={isLoading}
                className="deep-space-gradient shadow-glow"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {messages.length === 1 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      className="text-sm px-3 py-1.5 deep-space-gradient opacity-80 hover:opacity-100 rounded-full transition-all duration-300"
                      onClick={() => handleSuggestedQuestion(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
      />
    </>
  );
}
