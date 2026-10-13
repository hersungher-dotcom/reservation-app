import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onOpenChange,
  children,
  className = '',
}: ModalProps) {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)}></div>
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative bg-background p-6 rounded-lg shadow-xl border border-border">
          <div className="flex justify-between items-start space-x-4">
            <h3 className="text-lg font-semibold text-foreground">{children}</h3>
            <button
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => onOpenChange(false)}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}