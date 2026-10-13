'use client';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { ReservationWithEvent } from '@/types/reservations';


export default function ReservationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [reservation, setReservation] = useState<ReservationWithEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservation();
  }, [params.id]);

  async function fetchReservation() {
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
        .eq('id', params.id)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (!data) {
        notFound();
        return;
      }
      setReservation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement de la réservation...</p>
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

  if (!reservation) {
    notFound();
    return null;
  }

  const startTime = new Date(reservation.event_slot.start_time);
  const endTime = new Date(reservation.event_slot.end_time);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center justify-between mb-6">
          <Link href="/reservations" className="text-sm text-muted-foreground hover:text-primary">
            ← Retour aux réservations
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Détails de la réservation
          </h1>
        </nav>

        <div className="space-y-6">
          <div className="bg-background rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {reservation.event.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {reservation.event.location || 'Localisation non spécifiée'}
            </p>
            <p className="text-base text-foreground">
              {reservation.event.description || 'Aucune description disponible.'}
            </p>
          </div>

          <div className="bg-background rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Date et heure
            </h2>
            <p className="text-lg text-muted-foreground">
              {startTime.toLocaleDateString()} à {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="bg-background rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Statut
            </h2>
            <span className={`px-3 py-1 rounded text-xs font-medium ${
              reservation.status === 'confirmed'
                ? 'text-success bg-success/20'
                : reservation.status === 'cancelled'
                ? 'text-destructive bg-destructive/20'
                : 'text-muted-foreground bg-muted/20'
            }`}>
              {reservation.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
            </span>
          </div>

          {reservation.status === 'confirmed' && (
            <div className="bg-background rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Actions
              </h2>
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      'Êtes-vous sûr de vouloir annuler cette réservation ?'
                    )
                  ) {
                    const { error } = await supabase
                      .from('reservations')
                      .update({ status: 'cancelled' })
                      .eq('id', reservation.id);

                    if (error) {
                      alert('Erreur lors de l\'annulation: ' + error.message);
                    } else {
                      window.location.href = '/reservations';
                    }
                  }
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Annuler la réservation
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}