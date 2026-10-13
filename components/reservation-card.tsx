import type { ReservationWithEvent } from '@/types/reservations';

export default function ReservationCard({
  reservation,
  onCancel,
}: {
  reservation: ReservationWithEvent;
  onCancel: (reservationId: string) => Promise<void>;
}) {
  const startTime = new Date(reservation.event_slot.start_time);
  const endTime = new Date(reservation.event_slot.end_time);
  const isCancelled = reservation.status === 'cancelled';

  return (
    <div className={`rounded-lg border p-4 ${isCancelled ? 'border-destructive/20 bg-destructive/5' : 'border-background'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">
            {reservation.event.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {startTime.toLocaleDateString()} à {
              startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            } -
            {endTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {reservation.event.location && (
            <p className="text-xs text-muted-foreground mt-1">
              {reservation.event.location}
            </p>
          )}
        </div>

        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          isCancelled
            ? 'text-destructive bg-destructive/20'
            : reservation.status === 'confirmed'
            ? 'text-success bg-success/20'
            : 'text-muted-foreground bg-muted/20'
        }`}>
          {isCancelled ? 'Annulée' : 'Confirmée'}
        </span>
      </div>

      {isCancelled && (
        <div className="mt-3 text-sm text-destructive">
          Cette réservation a été annulée.
        </div>
      )}
    </div>
  );
}