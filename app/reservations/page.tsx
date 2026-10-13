'use client';
import ReservationCard from '@/components/reservation-card';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { ReservationWithEvent } from '@/types/reservations';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to sign-in if not authenticated
        window.location.href = '/';
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          event:events(*),
          event_slot:event_slots(*),
          event:events!inner(*)
        `)
        .eq('user_id', session.user.id)
        .neq('status', 'cancelled') // Show only active/completed reservations
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelReservation(reservationId: string) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) throw error;

      // Refetch reservations
      await fetchReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'annulation');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-4">
            Erreur
          </h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-2xl font-bold text-foreground text-center flex-1">
            Mes réservations
          </h1>
        </nav>

        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Vous n'avez aucune réservation pour le moment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Voir les événements disponibles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}