'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState, useEffect } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: 3,
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
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