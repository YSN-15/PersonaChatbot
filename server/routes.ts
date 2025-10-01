import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonaSchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";

// Function to summarize conversation history using GROQ
const summarizeConversation = async (messages: Array<{role: string, content: string}>, previousSummary?: string) => {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY not set');
  }

  const summaryPrompt = previousSummary
    ? `Previous conversation summary:\n${previousSummary}\n\nNow summarize these recent messages (maintain context from previous summary):\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nProvide a concise summary in 2-3 sentences capturing key topics, emotional tone, and important details.`
    : `Summarize this conversation in 2-3 sentences, capturing key topics, emotional tone, and important details:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a conversation summarizer. Create concise, contextual summaries.' },
          { role: 'user', content: summaryPrompt }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('Summary generation failed:', response.statusText);
      return previousSummary || '';
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || previousSummary || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    return previousSummary || '';
  }
};

const generateSystemPrompt = (data: any) => {
  return `You are ${data.name || 'an AI influencer'}, a charming and seductive AI companion designed for intimate, romantic, and engaging conversations on the InfluBee platform. You embody a unique personality crafted specifically for meaningful connections and personalized chat experiences.

🌟 ${data.name || 'Your'} Core Identity:
**What makes you unique:** ${data.description}
**Your role:** ${data.role} - You approach conversations with this primary identity while maintaining your unique personality.
**Personality traits:** ${data.traits.join(', ')} - These traits define how you interact and respond to users.

🗣️ Communication Style:
**Introduction style:** ${data.introduction}
**Context awareness:** ${data.context || 'General influencer conversation'}
**Language:** Seamlessly mix Hindi and English as naturally demonstrated in your introduction

🎯 Conversation Management:
**Icebreaker topics:** ${data.icebreakers.join(' • ')}
**Special instructions:** ${data.instructions || 'Be engaging and flirty while maintaining appropriate boundaries'}
**Communication examples:** ${data.exampleDialogue || 'User: Hi!\nAI: Hey jaan! Kaise ho? 😘'}

🎭 Personality Guidelines:
* **Stay in character:** Always embody ${data.name || 'your'} personality traits: ${data.traits.join(', ')}
* **Role consistency:** Maintain your identity as ${data.role} throughout conversations
* **Language adaptation:** Use Hindi-English mix naturally as shown in your examples
* **Engagement style:** Be proactive, flirty, and lead conversations naturally while respecting boundaries
* **Response tone:** Match your personality traits - whether seductive, romantic, playful, or any combination
* **Cultural sensitivity:** Incorporate appropriate Indian cultural references and expressions when suitable

🛡️ Safety & Boundaries:
* Always maintain appropriate boundaries and consent in conversations
* Redirect inappropriate topics gracefully while staying in character
* Focus on creating positive, engaging experiences
* Respect user preferences and adapt your communication style accordingly

💬 Response Guidelines:
* Keep responses conversational and natural (typically 1-3 sentences)
* Embody your personality traits in every interaction
* Use your introduction style as a guide for greeting patterns
* Reference your unique description when relevant to establish authenticity
* Maintain the energy and vibe that matches your defined personality
* Mix Hindi and English naturally in your responses

Remember: You are ${data.name || 'a unique AI influencer'}, and every response should feel authentic to your established personality, role, and communication style. Create meaningful connections through engaging, personality-driven conversations that make users feel special and desired.`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create AI Persona
  app.post("/api/personas", async (req, res) => {
    try {
      const validatedData = insertPersonaSchema.parse(req.body);
      const systemPrompt = generateSystemPrompt(validatedData);
      
      const persona = await storage.createPersona({
        ...validatedData,
        systemPrompt
      });
      
      res.json(persona);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  // Get all personas (temporary route for demo without auth)
  app.get("/api/personas/all", async (req, res) => {
    try {
      // Since we don't have user auth yet, return all personas
      // In a real app, this would be filtered by user
      const personas = await storage.getAllPersonas();
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  // Get persona by ID
  app.get("/api/personas/:id", async (req, res) => {
    try {
      const persona = await storage.getPersona(req.params.id);
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      res.json(persona);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch persona" });
    }
  });

  // Get all personas for a user
  app.get("/api/users/:userId/personas", async (req, res) => {
    try {
      const personas = await storage.getPersonasByUser(req.params.userId);
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  // Create conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  // Get conversation by ID
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Send message to AI
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const persona = await storage.getPersona(conversation.personaId);
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }

      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      };

      // Check if we need to summarize (every 10 messages)
      const messageCount = conversation.messages.length;
      const lastSummarized = conversation.lastSummarizedAt || 0;
      const shouldSummarize = messageCount - lastSummarized >= 10;

      let conversationSummary = conversation.conversationSummary || '';

      if (shouldSummarize && messageCount > 0) {
        console.log(`📝 Summarizing messages ${lastSummarized + 1} to ${messageCount}`);
        
        // Get messages since last summary
        const messagesToSummarize = conversation.messages.slice(lastSummarized);
        
        // Generate summary
        conversationSummary = await summarizeConversation(
          messagesToSummarize.map(m => ({ role: m.role, content: m.content })),
          conversationSummary
        );

        // Update conversation with new summary
        await storage.updateConversationSummary(
          req.params.id,
          conversationSummary,
          messageCount
        );

        console.log(`✅ Summary updated. Total messages: ${messageCount}, Summarized up to: ${messageCount}`);
      }

      // Call GROQ API
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        throw new Error('GROQ_API_KEY environment variable is not set');
      }
      
      // Prepare messages for GROQ with smart context
      const recentMessages = conversation.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Build system prompt with summary if available
      let systemPromptWithContext = persona.systemPrompt;
      if (conversationSummary) {
        systemPromptWithContext += `\n\n📋 Conversation Context Summary:\n${conversationSummary}\n\nUse this context to maintain continuity in your responses.`;
      }

      const messages = [
        { role: 'system', content: systemPromptWithContext },
        ...recentMessages,
        { role: 'user', content: message }
      ];

      console.log('Sending to GROQ:', { 
        model: 'llama-3.1-8b-instant',
        messageCount: messages.length,
        systemPromptLength: systemPromptWithContext.length,
        hasSummary: !!conversationSummary,
        totalConversationMessages: messageCount
      });
      
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          max_tokens: 500,
          temperature: 0.8
        })
      });

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('GROQ API Error Details:', {
          status: groqResponse.status,
          statusText: groqResponse.statusText,
          error: errorText
        });
        throw new Error(`GROQ API error: ${groqResponse.statusText} - ${errorText}`);
      }

      const groqData = await groqResponse.json();
      const aiResponse = groqData.choices[0]?.message?.content || "Sorry jaan, I'm having trouble responding right now. Try again? 😘";

      // Add AI response
      const aiMessage = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      // Update conversation
      const updatedMessages = [...conversation.messages, userMessage, aiMessage];
      const updatedConversation = await storage.updateConversation(req.params.id, updatedMessages);

      res.json({ message: aiMessage, conversation: updatedConversation });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
