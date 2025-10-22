"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../helper/useQuery";

export default function ClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}