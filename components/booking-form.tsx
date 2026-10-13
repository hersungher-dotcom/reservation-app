import * as React from 'react';
import type { ReactNode } from 'react';

interface BookingFormProps {
  eventTitle: string;
  slotStartTime: string;
  slotEndTime: string;
  onSubmit: (data: { name: string; email: string }) => void;
  isLoading: boolean;
}

export default function BookingForm({
  eventTitle,
  slotStartTime,
  slotEndTime,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Réserver votre place
        </h2>
        <p className="text-muted-foreground">
          {eventTitle} • {new Date(slotStartTime).toLocaleDateString()} à {
            new Date(slotStartTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          }
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
            Votre nom
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez votre nom"
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
            Votre email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="entrez@votreemail.com"
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 ${
          isLoading ? 'bg-muted' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'En cours...' : 'Confirmer la réservation'}
      </button>
    </form>
  );
}