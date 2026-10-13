'use client';
import { notFound } from 'next/navigation';
import SlotSelector from '@/components/slot-selector';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Event, EventSlot } from '@/types/events';


export default function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [slots, setSlots] = useState<EventSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
    fetchEventSlots();
  }, [params.id]);

  async function fetchEvent() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      if (!data) {
        notFound();
        return;
      }
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function fetchEventSlots() {
    try {
      const { data, error } = await supabase
        .from('event_slots')
        .select('*')
        .eq('event_id', params.id)
        .eq('is_active', true)
        .gte('start_time', new Date().toISOString()) // Future slots only
        .order('start_time');

      if (error) throw error;
      setSlots(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement de l'événement...</p>
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

  if (!event) {
    notFound();
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
        </nav>

        <div className="mb-8">
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="rounded-lg mb-4 w-full h-48 object-cover"
            />
          )}
          <p className="text-lg text-muted-foreground">{event.location}</p>
          <p className="mt-2 text-base text-foreground">
            {event.description || 'Aucune description disponible.'}
          </p>
        </div>

        {slots.length > 0 ? (
          <>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Créneaux disponibles
            </h2>
            <SlotSelector
              slots={slots}
              onSelectSlot={(slot) => {
                // Navigate to booking page
                window.location.href = `/events/${event.id}/slots/${slot.id}`;
              }}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucun créneau disponible pour cet événement.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}