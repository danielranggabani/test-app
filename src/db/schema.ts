import { pgTable, serial, text, timestamp, boolean, integer, vector } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ----------------------------------------------------------------------
// 1. USERS
// Stores admin credentials for dashboard access.
// ----------------------------------------------------------------------
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: text('role').default('admin'),
});

// ----------------------------------------------------------------------
// 2. LEADS
// Represents potential clients interacting via WhatsApp.
// Status Enum: 'cold', 'warm', 'hot', 'waiting_invoice', 'deal', 'lost'
// ----------------------------------------------------------------------
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number').unique().notNull(),
  name: text('name'),
  status: text('status').default('cold'),
  needsSummary: text('needs_summary'),
  aiActive: boolean('ai_active').default(true), // Controls if AI should auto-reply
  lastInteraction: timestamp('last_interaction').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ----------------------------------------------------------------------
// 3. AVAILABILITY_SLOTS
// Manages calendar slots for meeting bookings.
// ----------------------------------------------------------------------
export const availabilitySlots = pgTable('availability_slots', {
  id: serial('id').primaryKey(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  isBooked: boolean('is_booked').default(false),
  bookedByLeadId: integer('booked_by_lead_id').references(() => leads.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ----------------------------------------------------------------------
// 4. KNOWLEDGE_BASE
// Stores business context for RAG (Retrieval Augmented Generation).
// Requires 'vector' extension in Postgres.
// ----------------------------------------------------------------------
export const knowledgeBase = pgTable('knowledge_base', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 768 }), // Matches Gemini Embedding-001 dimension
  createdAt: timestamp('created_at').defaultNow(),
});

// ----------------------------------------------------------------------
// 5. CHATS
// History of all messages between User, AI, and Admin.
// Sender Enum: 'user', 'ai', 'admin'
// ----------------------------------------------------------------------
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  sender: text('sender').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ----------------------------------------------------------------------
// RELATIONS
// Drizzle relations for easier query building.
// ----------------------------------------------------------------------
export const leadsRelations = relations(leads, ({ many }) => ({
  chats: many(chats),
  bookings: many(availabilitySlots),
}));

export const chatsRelations = relations(chats, ({ one }) => ({
  lead: one(leads, {
    fields: [chats.leadId],
    references: [leads.id],
  }),
}));

export const availabilitySlotsRelations = relations(availabilitySlots, ({ one }) => ({
  lead: one(leads, {
    fields: [availabilitySlots.bookedByLeadId],
    references: [leads.id],
  }),
}));
