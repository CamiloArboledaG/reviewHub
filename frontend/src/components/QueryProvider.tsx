'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState, useEffect } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  }));
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStoragePersister = createSyncStoragePersister({ storage: window.localStorage })

      const restore = async () => {
        try {
            await persistQueryClient({
                queryClient,
                persister: localStoragePersister,
            });
        } catch (error) {
            console.error(error)
        } finally {
            await queryClient.resetQueries({ queryKey: ['reviews'] });
            setIsRestored(true);
        }
      }

      restore();
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {isRestored ? children : null}
    </QueryClientProvider>
  );
} 