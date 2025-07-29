"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "../../../components/Navbar";
import MobileBottomNav from "../../../components/MobileBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 dakika boyunca cache'ten al
        gcTime: 10 * 60 * 1000, // 10 dakika cache'te tut
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider 
        refetchInterval={10 * 60} // 10 dakikada bir session'ı kontrol et
        refetchOnWindowFocus={false} // Pencere focus olduğunda yenileme
        refetchWhenOffline={false} // Offline durumda yenileme
      >
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container-mobile pb-16 md:pb-0">
            {children}
          </main>
          <MobileBottomNav />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
}
