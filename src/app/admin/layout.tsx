import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin - GachPala',
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isLoginPage = pathname === '/admin/login';

  // Login page renders without the admin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // All other admin pages are already protected by middleware
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
