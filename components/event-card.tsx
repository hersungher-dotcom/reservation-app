import Link from 'next/link';
import type { Event } from '@/types/events';

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="group">
      <div className="rounded-lg border bg-background p-6 hover:bg-accent/5 transition-colors">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
          {event.location && (
            <p className="text-sm text-muted-foreground">{event.location}</p>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Voir les créneaux disponibles
          </span>
        </div>
      </div>
    </Link>
  );
}