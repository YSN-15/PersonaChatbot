import { type User, type InsertUser, type Persona, type InsertPersona, type Conversation, type InsertConversation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPersona(persona: InsertPersona): Promise<Persona>;
  getPersona(id: string): Promise<Persona | undefined>;
  getPersonasByUser(userId: string): Promise<Persona[]>;
  updatePersona(id: string, persona: Partial<InsertPersona>): Promise<Persona | undefined>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByPersona(personaId: string): Promise<Conversation[]>;
  updateConversation(id: string, messages: Array<{role: 'user' | 'assistant', content: string, timestamp: string}>): Promise<Conversation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private personas: Map<string, Persona>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.users = new Map();
    this.personas = new Map();
    this.conversations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPersona(insertPersona: InsertPersona): Promise<Persona> {
    const id = randomUUID();
    const persona: Persona = { 
      ...insertPersona, 
      id,
      createdAt: new Date()
    };
    this.personas.set(id, persona);
    return persona;
  }

  async getPersona(id: string): Promise<Persona | undefined> {
    return this.personas.get(id);
  }

  async getPersonasByUser(userId: string): Promise<Persona[]> {
    return Array.from(this.personas.values()).filter(
      (persona) => persona.userId === userId
    );
  }

  async updatePersona(id: string, updates: Partial<InsertPersona>): Promise<Persona | undefined> {
    const persona = this.personas.get(id);
    if (!persona) return undefined;
    
    const updatedPersona = { ...persona, ...updates };
    this.personas.set(id, updatedPersona);
    return updatedPersona;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsByPersona(personaId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.personaId === personaId
    );
  }

  async updateConversation(id: string, messages: Array<{role: 'user' | 'assistant', content: string, timestamp: string}>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation = { 
      ...conversation, 
      messages,
      updatedAt: new Date()
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
