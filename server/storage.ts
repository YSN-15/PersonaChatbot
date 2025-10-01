import { users, aiPersonas, conversations, type User, type InsertUser, type Persona, type InsertPersona, type Conversation, type InsertConversation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPersona(persona: InsertPersona): Promise<Persona>;
  getPersona(id: string): Promise<Persona | undefined>;
  getPersonasByUser(userId: string): Promise<Persona[]>;
  getAllPersonas(): Promise<Persona[]>;
  updatePersona(id: string, persona: Partial<InsertPersona>): Promise<Persona | undefined>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByPersona(personaId: string): Promise<Conversation[]>;
  updateConversation(id: string, messages: Array<{role: 'user' | 'assistant', content: string, timestamp: string}>): Promise<Conversation | undefined>;
  updateConversationSummary(id: string, summary: string, lastSummarizedAt: number): Promise<Conversation | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPersona(insertPersona: InsertPersona): Promise<Persona> {
    const [persona] = await db
      .insert(aiPersonas)
      .values({
        ...insertPersona,
        traits: insertPersona.traits as string[],
        icebreakers: insertPersona.icebreakers as string[]
      })
      .returning();
    return persona;
  }

  async getPersona(id: string): Promise<Persona | undefined> {
    const [persona] = await db.select().from(aiPersonas).where(eq(aiPersonas.id, id));
    return persona || undefined;
  }

  async getPersonasByUser(userId: string): Promise<Persona[]> {
    return await db.select().from(aiPersonas).where(eq(aiPersonas.userId, userId));
  }

  async getAllPersonas(): Promise<Persona[]> {
    return await db.select().from(aiPersonas);
  }

  async updatePersona(id: string, updates: Partial<InsertPersona>): Promise<Persona | undefined> {
    const updateData: any = { ...updates };
    if (updates.traits) updateData.traits = updates.traits as string[];
    if (updates.icebreakers) updateData.icebreakers = updates.icebreakers as string[];
    
    const [persona] = await db
      .update(aiPersonas)
      .set(updateData)
      .where(eq(aiPersonas.id, id))
      .returning();
    return persona || undefined;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({
        ...insertConversation,
        messages: insertConversation.messages as Array<{role: 'user' | 'assistant', content: string, timestamp: string}>
      })
      .returning();
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getConversationsByPersona(personaId: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.personaId, personaId));
  }

  async updateConversation(id: string, messages: Array<{role: 'user' | 'assistant', content: string, timestamp: string}>): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ 
        messages,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  async updateConversationSummary(id: string, summary: string, lastSummarizedAt: number): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ 
        conversationSummary: summary,
        lastSummarizedAt,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }
}

export const storage = new DatabaseStorage();
