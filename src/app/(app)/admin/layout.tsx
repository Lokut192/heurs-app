import type { Metadata } from 'next';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: {
    template: '%s | Admin',
    default: 'Admin',
  },
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}
