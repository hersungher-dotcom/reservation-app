export type Event = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};

export type EventSlot = {
  id: string;
  event_id: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  is_active: boolean;
  created_at: string;
};

export type EventWithSlots = Event & {
  slots?: EventSlot[];
};