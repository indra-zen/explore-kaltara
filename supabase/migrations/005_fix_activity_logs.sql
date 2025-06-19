-- Fix activity_logs entity_id column to accept TEXT instead of UUID
-- This allows logging for entities with non-UUID IDs

-- Change entity_id from UUID to TEXT to handle both UUID and string identifiers
ALTER TABLE public.activity_logs 
ALTER COLUMN entity_id TYPE TEXT;
