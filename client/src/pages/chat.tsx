import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, Send, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createConversation, sendMessage } from "@/lib/groq";
import type { Persona, Conversation } from "@shared/schema";

export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const personaId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: string}>>([]);

  // Fetch persona
  const { data: persona, isLoading: personaLoading } = useQuery<Persona>({
    queryKey: ["/api/personas", personaId],
    enabled: !!personaId,
  });

  // Fetch conversation
  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: () => createConversation(personaId!),
    onSuccess: (data) => {
      setConversationId(data.id);
      setMessages(data.messages || []);
      
      // Send initial greeting
      if (persona?.introduction) {
        const greeting = {
          role: 'assistant' as const,
          content: persona.introduction,
          timestamp: new Date().toISOString()
        };
        setMessages([greeting]);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (msg: string) => sendMessage(conversationId!, msg),
    onSuccess: (data) => {
      setMessages(prev => [...prev, data.message]);
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Initialize conversation when persona loads
  useEffect(() => {
    if (persona && !conversationId) {
      createConversationMutation.mutate();
    }
  }, [persona, conversationId]);

  // Update messages when conversation loads
  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages || []);
    }
  }, [conversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !conversationId) return;
    
    const userMessage = {
      role: 'user' as const,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendIcebreaker = (icebreaker: string) => {
    if (!conversationId) return;
    
    const userMessage = {
      role: 'user' as const,
      content: icebreaker,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(icebreaker);
  };

  if (personaLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-foreground">Loading your AI companion...</p>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground">Persona not found</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="p-2"
            data-testid="button-back-to-creator"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{persona.name}</h1>
            <p className="text-sm text-muted-foreground">{persona.role}</p>
          </div>
          <Heart className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" data-testid="messages-container">
        {messages.length === 0 && persona.icebreakers.length > 0 && (
          <div className="space-y-3">
            <p className="text-center text-muted-foreground text-sm">
              Start the conversation with one of these:
            </p>
            <div className="grid gap-2">
              {persona.icebreakers.slice(0, 3).map((icebreaker, index) => (
                <button
                  key={index}
                  onClick={() => sendIcebreaker(icebreaker)}
                  className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary transition-colors"
                  data-testid={`icebreaker-button-${index}`}
                >
                  <p className="text-sm text-foreground">"{icebreaker}"</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            data-testid={`message-${index}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        {sendMessageMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border px-4 py-3">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message jaan... 💕"
            className="flex-1 bg-input border-border text-foreground"
            disabled={sendMessageMutation.isPending || !conversationId}
            data-testid="input-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending || !conversationId}
            className="bg-primary hover:bg-primary/90"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
