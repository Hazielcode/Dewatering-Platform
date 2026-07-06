import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';
dotenv.config();

// Polyfill para Node 20 (Render)
globalThis.WebSocket = WebSocket;

const supabaseUrl = process.env.SUPABASE_URL || 'https://tu-url-de-supabase.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
