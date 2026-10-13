import { Event, EventSlot } from './events';

export type Reservation = {
  id: string;
  event_id: string;
  event_slot_id: string;
  user_id: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
};

export type ReservationWithEvent = Reservation & {
  event: Event;
  event_slot: EventSlot;
};