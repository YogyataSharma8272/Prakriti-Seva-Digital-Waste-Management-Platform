import React from 'react';
import { Button } from './ui/button';
import { Trash2, Phone } from 'lucide-react';

interface FloatingPickupButtonProps {
  onRequestPickup: () => void;
  className?: string;
}

export function FloatingPickupButton({ onRequestPickup, className = '' }: FloatingPickupButtonProps) {
  return (
    <Button
      onClick={onRequestPickup}
      className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-saffron to-saffron-light hover:from-saffron-dark hover:to-saffron text-white shadow-2xl rounded-full p-4 h-16 w-16 md:h-auto md:w-auto md:px-6 md:py-4 md:rounded-full transform hover:scale-110 transition-all duration-300 border-2 border-white ${className}`}
      size="lg"
    >
      <Trash2 className="h-6 w-6 md:mr-2" />
      <span className="hidden md:inline font-medium">Request Pickup</span>
    </Button>
  );
}