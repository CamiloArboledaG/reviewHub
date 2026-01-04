import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const days = Math.floor(seconds / 86400);

  if (days > 2) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (days === 2) {
    return "hace 2 días";
  }

  if (days === 1) {
    return "hace 1 día";
  }

  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) {
    return hours + "h";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes >= 1) {
    return minutes + "min";
  }

  return Math.floor(seconds) + "s";
}
