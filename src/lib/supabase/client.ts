import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';
import { secureStorage } from '../secure-storage';

// Polyfill WebSocket in Node.js environments (Metro SSR / bundler on Node < 22)
let wsTransport: any;
if (typeof WebSocket !== 'undefined') {
  wsTransport = WebSocket;
} else if (typeof globalThis !== 'undefined' && globalThis.WebSocket) {
  wsTransport = globalThis.WebSocket;
} else {
  try {
    const ws = require('ws');
    if (typeof globalThis !== 'undefined') {
      globalThis.WebSocket = ws;
    }
    wsTransport = ws;
  } catch {
    wsTransport = class MockWebSocket {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;
      readyState = 3;
      addEventListener() {}
      removeEventListener() {}
      send() {}
      close() {}
    };
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'demo-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    transport: wsTransport,
  },
});
