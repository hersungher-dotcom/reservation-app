import type { EventSlot } from '@/types/events';

export default function SlotSelector({
  slots,
  onSelectSlot,
}: {
  slots: EventSlot[];
  onSelectSlot: (slot: EventSlot) => void;
}) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun créneau disponible pour cet événement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Créneaux disponibles
      </h2>
      <div className="grid gap-4">
        {slots.map((slot) => {
          const startTime = new Date(slot.start_time);
          const endTime = new Date(slot.end_time);
          const isPast = new Date(slot.start_time) < new Date();
          const isFull = false; // In a real app, you'd check current bookings vs max_capacity

          return (
            <button
              key={slot.id}
              onClick={() => !isPast && !isFull && onSelectSlot(slot)}
              className={`group w-full rounded-lg border p-4 text-left ${isPast
                ? 'border-muted-foreground/20 text-muted-foreground'
                : isFull
                ? 'border-destructive/20 text-destructive'
                : 'border-background hover:bg-accent/5'}`
              }
              disabled={isPast || isFull}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-foreground">
                  {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                  {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h3>
                <span className="text-sm">
                  {slot.max_capacity} places disponibles
                </span>
              </div>
              {isPast && (
                <span className="text-xs text-muted-foreground mt-1">
                  Ce créneau est passé
                </span>
              )}
              {isFull && (
                <span className="text-xs text-destructive mt-1">
                  Complet
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}