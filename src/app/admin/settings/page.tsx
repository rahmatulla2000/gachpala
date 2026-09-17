import type { Metadata } from 'next';
import { Settings, Shield, Database, Server } from 'lucide-react';

export const metadata: Metadata = { title: 'Settings' };

export default function AdminSettingsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Application configuration and system status
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Database Information</h2>
              <p className="text-xs text-gray-500">PostgreSQL connection and status</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-gray-500 dark:text-gray-400 text-xs block">Database Provider</span>
              <span className="font-medium text-gray-900 dark:text-white">PostgreSQL</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-gray-500 dark:text-gray-400 text-xs block">Connection Status</span>
              <span className="font-medium text-green-600 dark:text-green-400">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Admin Account</h2>
              <p className="text-xs text-gray-500">Authentication & Security</p>
            </div>
          </div>
          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
            <p>Admin Email: <span className="font-mono text-gray-900 dark:text-white font-medium">admin@knowsabouttree.com</span></p>
            <p>Role: <span className="font-medium text-forest-600 dark:text-forest-400">SUPER_ADMIN</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
