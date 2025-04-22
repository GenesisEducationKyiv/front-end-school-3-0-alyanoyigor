import { Suspense, type ReactNode } from 'react';

interface LazyModalProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LazyModal({ children, fallback = '' }: LazyModalProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
