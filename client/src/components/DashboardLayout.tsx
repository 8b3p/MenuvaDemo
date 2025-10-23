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
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Navigation items configuration
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/menus', label: 'Menus', labelAr: 'القوائم', icon: Menu },
  { path: '/templates', label: 'Templates', labelAr: 'القوالب', icon: FileText },
  { path: '/complaints', label: 'Complaints', labelAr: 'الشكاوى', icon: MessageSquare },
];

// Shared Navigation Component
interface NavigationProps {
  isRTL: boolean;
  location: string;
  setLocation: (path: string) => void;
  isMobile?: boolean;
}

const Navigation = ({ isRTL, location, setLocation, isMobile = false }: NavigationProps) => {
  const isActive = (path: string) => location === path;

  return (
    <nav className={`${isMobile ? 'space-y-1' : 'flex-1 p-4 space-y-1'}`}>
      {NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => setLocation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{isRTL ? item.labelAr : item.label}</span>
            </button>
          </motion.div>
        );
      })}
    </nav>
  );
};

// Shared Settings Component
interface SettingsMenuProps {
  isRTL: boolean;
  settingsExpanded: boolean;
  setSettingsExpanded: (expanded: boolean) => void;
  languageExpanded: boolean;
  setLanguageExpanded: (expanded: boolean) => void;
  handleLogout: () => void;
  store: any;
}

const SettingsMenu = ({
  isRTL,
  settingsExpanded,
  setSettingsExpanded,
  languageExpanded,
  setLanguageExpanded,
  handleLogout,
  store,
}: SettingsMenuProps) => (
  <div className="space-y-2">
    {/* Language Selector */}
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between transition-all duration-200 hover:shadow-md"
        onClick={() => setLanguageExpanded(!languageExpanded)}
      >
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {isRTL ? 'اللغة' : 'Language'}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${languageExpanded ? 'rotate-180' : ''}`} />
      </Button>
      <AnimatePresence>
        {languageExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 space-y-1 overflow-hidden"
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => store.setLanguage('en')}
            >
              English
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => store.setLanguage('ar')}
            >
              العربية
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Settings Menu */}
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between transition-all duration-200 hover:shadow-md"
        onClick={() => setSettingsExpanded(!settingsExpanded)}
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {isRTL ? 'الإعدادات' : 'Settings'}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${settingsExpanded ? 'rotate-180' : ''}`} />
      </Button>
      <AnimatePresence>
        {settingsExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 space-y-1 overflow-hidden"
          >
            <Button variant="ghost" className="w-full justify-start text-sm" disabled>
              {isRTL ? 'الملف الشخصي' : 'Profile'}
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" disabled>
              {isRTL ? 'التفضيلات' : 'Preferences'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

// Shared Logo Component
const Logo = ({ isRTL, size = 'normal' }: { isRTL: boolean; size?: 'normal' | 'small' }) => (
  <div className="flex items-center gap-3">
    <div className={`${size === 'small' ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md`}>
      <Menu className={`${size === 'small' ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
    </div>
    <span className={`font-bold ${size === 'small' ? 'text-base sm:text-lg' : 'text-xl'}`}>
      {isRTL ? 'القائمة الإلكترونية' : 'E-Menu'}
    </span>
  </div>
);

const DashboardLayout = observer(({ children }: DashboardLayoutProps) => {
  const store = useStore();
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [languageExpanded, setLanguageExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = store.language === 'ar';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!store.isAuthenticated) {
      setLocation('/login');
    }
  }, [store.isAuthenticated, setLocation]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    store.logout();
    setLocation('/login');
  };

  const getCurrentPageTitle = () => {
    const currentNav = NAV_ITEMS.find((item) => item.path === location);
    return currentNav?.[isRTL ? 'labelAr' : 'label'] || (isRTL ? 'لوحة التحكم' : 'Dashboard');
  };

  const settingsProps = {
    isRTL,
    settingsExpanded,
    setSettingsExpanded,
    languageExpanded,
    setLanguageExpanded,
    handleLogout,
    store,
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Logo isRTL={isRTL} size="small" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-transform hover:scale-110 duration-200"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: isRTL ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 300 : -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0 w-72 bg-white dark:bg-gray-800 border-${isRTL ? 'l' : 'r'} border-gray-200 dark:border-gray-700 z-50 overflow-y-auto shadow-2xl`}
            >
              <div className="p-4">
                <div className="mb-6 pt-2">
                  <Logo isRTL={isRTL} />
                </div>

                <Navigation 
                  isRTL={isRTL} 
                  location={location} 
                  setLocation={setLocation} 
                  isMobile={true} 
                />

                <div className="mt-6">
                  <SettingsMenu {...settingsProps} />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: isRTL ? 300 : -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Logo isRTL={isRTL} />
        </div>

        <Navigation 
          isRTL={isRTL} 
          location={location} 
          setLocation={setLocation} 
        />

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <SettingsMenu {...settingsProps} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="hidden lg:flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-30">
          <h1 className="text-xl lg:text-2xl font-bold">
            {getCurrentPageTitle()}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-transform hover:scale-110 duration-200"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <div className="p-4 lg:p-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
});

export default DashboardLayout;

