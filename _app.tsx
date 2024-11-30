
import { ClerkProvider } from '@clerk/nextjs';
import type { ComponentType } from 'react';

interface PageProps {
  id: number;
  name: string;
}

function MyApp({ Component, pageProps }: { Component: ComponentType<PageProps>, pageProps: PageProps }) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
export default MyApp;