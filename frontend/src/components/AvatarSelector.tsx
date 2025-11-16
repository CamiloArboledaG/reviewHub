'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDefaultAvatars } from '@/lib/queries';
import { Avatar } from '@/lib/definitions';

interface AvatarSelectorProps {
  onAvatarChange: (avatarId: string) => void;
  value: string | undefined;
}

export function AvatarSelector({ onAvatarChange, value }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: avatars = [], isLoading } = useQuery({
    queryKey: ['avatars', 'default'],
    queryFn: fetchDefaultAvatars,
  });

  const selectedAvatar = avatars.find((a: Avatar) => a._id === value);

  const handleSelectAvatar = (avatarId: string) => {
    onAvatarChange(avatarId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full w-24 h-24 p-0 relative overflow-hidden">
          {selectedAvatar ? (
            <Image
              src={selectedAvatar.imageUrl}
              alt={selectedAvatar.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Camera className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Elige un avatar</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-4">
            {avatars.map((avatar: Avatar) => (
              <div key={avatar._id} className="flex justify-center items-center">
                <div
                  className={`cursor-pointer p-2 border-2 rounded-full transition-colors ${
                    value === avatar._id ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectAvatar(avatar._id)}
                >
                  <div className="relative w-20 h-20">
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      fill
                      sizes="80px"
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
