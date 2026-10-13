'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/auth';

export default function AuthButton() {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session: sessionData },
        } = await supabase.auth.getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {session ? (
        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Déconnexion
        </button>
      ) : (
        <button
          onClick={() => {
            // Redirect to sign-in page or trigger OAuth flow
            // For now, redirecting to home page as a placeholder
            window.location.href = '/';
          }}
          className="text-sm font-medium text-primary hover:text-primary/90"
        >
          Connexion
        </button>
      )}
    </>
  );
}