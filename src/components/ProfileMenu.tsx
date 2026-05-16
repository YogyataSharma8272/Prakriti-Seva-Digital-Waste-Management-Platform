import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, UserCircle2 } from 'lucide-react';

interface ProfileMenuProps {
  user: any;
  onLogout: () => void;
  onSettings: () => void;
  onProfile: () => void;
}

export function ProfileMenu({ user, onLogout, onSettings, onProfile }: ProfileMenuProps) {
  const initials = user?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            {user?.profileImage ? <AvatarImage src={user.profileImage} alt={user?.name || 'User'} /> : null}
            <AvatarFallback style={{ backgroundColor: user?.avatarColor || 'var(--nature-green)', color: 'white' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div className="flex flex-col space-y-1 p-2">
            <div className="text-xs font-medium text-gray-600">Waste Collected</div>
            <div className="text-sm font-bold" style={{ color: 'var(--nature-green)' }}>
              {user?.wasteCollected || 0} kg
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <div className="flex flex-col space-y-1 p-2">
            <div className="text-xs font-medium text-gray-600">Points</div>
            <div className="text-sm font-bold" style={{ color: 'var(--saffron)' }}>
              {user?.points || 0} pts
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onProfile} className="cursor-pointer">
          <UserCircle2 className="h-4 w-4 mr-2" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onSettings} className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          <span>Profile Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
