'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface AvatarSelectorProps {
  onAvatarChange: (avatarUrl: string) => void;
  value: string | undefined;
}

const avatars = [
  '/avatares/avatar1.svg',
  '/avatares/avatar2.svg',
  '/avatares/avatar3.svg',
  '/avatares/avatar4.svg',
];

export function AvatarSelector({ onAvatarChange, value }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectAvatar = (avatarUrl: string) => {
    onAvatarChange(avatarUrl);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full w-24 h-24 p-0 relative">
          {value ? (
            <Image src={value} alt="Selected Avatar" layout="fill" className="rounded-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
              <Camera className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elige un avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {avatars.map((avatar) => (
            <div key={avatar} className="flex justify-center items-center">
            <div
              className="cursor-pointer p-2 border-2 border-transparent hover:border-blue-500 rounded-full"
              onClick={() => handleSelectAvatar(avatar)}
            >
              <Image src={avatar} alt={avatar} width={80} height={80} className="rounded-full" />
            </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
