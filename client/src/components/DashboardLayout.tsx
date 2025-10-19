import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Menu,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = observer(({ children }: DashboardLayoutProps) => {
  const store = useStore();
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [languageExpanded, setLanguageExpanded] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!store.isAuthenticated) {
      setLocation('/login');
    }
  }, [store.isAuthenticated, setLocation]);

  const handleLogout = () => {
    store.logout();
    setLocation('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
    { path: '/menus', label: 'Menus', labelAr: 'القوائم', icon: Menu },
    { path: '/templates', label: 'Templates', labelAr: 'القوالب', icon: FileText },
    { path: '/complaints', label: 'Complaints', labelAr: 'الشكاوى', icon: MessageSquare },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900" dir={store.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {store.language === 'en' ? 'E-Menu' : 'القائمة الإلكترونية'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">
                  {store.language === 'en' ? item.label : item.labelAr}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Language Toggle */}
          <div>
            <button
              onClick={() => setLanguageExpanded(!languageExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5" />
                <span className="font-medium">
                  {store.language === 'en' ? 'Language' : 'اللغة'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${languageExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            {languageExpanded && (
              <div className="mt-2 ml-4 space-y-1">
                <button
                  onClick={() => store.setLanguage('en')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                    store.language === 'en'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => store.setLanguage('ar')}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                    store.language === 'ar'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <div>
            <button
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span className="font-medium">
                  {store.language === 'en' ? 'Settings' : 'الإعدادات'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${settingsExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            {settingsExpanded && (
              <div className="mt-2 ml-4 space-y-1">
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {store.language === 'en' ? 'Profile' : 'الملف الشخصي'}
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {store.language === 'en' ? 'Preferences' : 'التفضيلات'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {store.language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {navItems.find((item) => item.path === location)
                ? store.language === 'en'
                  ? navItems.find((item) => item.path === location)?.label
                  : navItems.find((item) => item.path === location)?.labelAr
                : store.language === 'en'
                ? 'Dashboard'
                : 'لوحة التحكم'}
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;

