import { createClient } from '@supabase/supabase-js';

// Supabase Client for server-side operations
let supabaseClient: any = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

// Magic Link Authentication Helper
export async function sendMagicLink(email: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(`Failed to send magic link: ${error.message}`);
  }

  return data;
}

// Verify Magic Link Token
export async function verifyMagicLinkToken(token: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email',
  });

  if (error) {
    throw new Error(`Failed to verify token: ${error.message}`);
  }

  return data;
}

// Get User by Email
export async function getUserByEmail(email: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data || null;
  } catch (error: any) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
}

// Create User
export async function createUser(email: string, name?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        name: name || email.split('@')[0],
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
}

// Update User Last Signed In
export async function updateUserLastSignedIn(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('users')
    .update({ last_signed_in: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
}
