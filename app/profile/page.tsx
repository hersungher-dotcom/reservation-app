'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/auth';

export default function ProfilePage() {
  const [session, setSession] = useState<any | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch session on component mount
  useEffect(() => {
    async function loadSession() {
      try {
        const {
          data: { session: sessionData },
        } = await supabase.auth.getSession();
        setSession(sessionData);
      } catch (err) {
        setSessionError(err instanceof Error ? err.message : 'Erreur lors de la récupération de la session');
      } finally {
        setSessionLoading(false);
      }
    }

    loadSession();
  }, []);

  // Fetch user profile when session changes
  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  async function fetchUserProfile() {
    try {
      setIsLoading(true);
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-4">
            Erreur d'authentification
          </h2>
          <p className="text-muted-foreground">Veuillez vous reconnecter.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (!session && !sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Vous devez être connecté
          </h2>
          <p className="text-muted-foreground mb-6">
            Veuillez vous connecter pour accéder à votre profil
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center justify-between mb-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Retour à l'accueil
          </a>
          <h1 className="text-2xl font-bold text-center text-foreground flex-1">
            Mon profil
          </h1>
        </nav>

        <div className="space-y-6">
          <div className="bg-background rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Informations du compte
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                  {(user as any)?.full_name?.charAt(0) ?? session.user.email.charAt(0) ?? 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {(user as any)?.full_name ?? session?.user?.email?.split('@')[0] ?? 'Utilisateur'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email ?? ''}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  ID utilisateur : {session?.user?.id ?? ''}
                </p>
                <p className="text-sm text-muted-foreground">
                  Membre depuis : {new Date(
                    session?.user?.created_at ?? Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Sécurité
            </h2>
            <button
              onClick={async () => {
                if (
                  window.confirm(
                    'Êtes-vous sûr de vouloir vous déconnecter de tous les appareils ?'
                  )
                ) {
                  await supabase.auth.signOut();
                }
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Se déconnecter de tous les appareils
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/20"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}