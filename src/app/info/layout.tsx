"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 dakika
      },
    },
  }));

  return (
    <html lang="tr">
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <main className="px-4 py-6">
              {children}
            </main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
