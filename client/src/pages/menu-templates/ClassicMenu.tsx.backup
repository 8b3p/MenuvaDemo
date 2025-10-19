import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import type { Menu, Category, MenuItem } from '@/stores/RootStore';

const ClassicMenu = observer(() => {
  const store = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Get the active menu
  const activeMenu = store.menus[0];
  
  // Get template customization
  const customization = {
    primaryColor: store.templateCustomization.primaryColor || '#8B4513',
    secondaryColor: store.templateCustomization.secondaryColor || '#D4AF37',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    // Simulate loading fonts and data
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (activeMenu?.categories.length > 0) {
        setActiveCategory(activeMenu.categories[0].id);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeMenu]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add complaint to store
    store.addComplaint({
      customerName: complaintForm.name,
      email: complaintForm.email,
      phone: complaintForm.phone,
      message: complaintForm.message,
      category: 'General',
    });

    setSubmitting(false);
    setComplaintDialog(false);
    setComplaintForm({ name: '', email: '', phone: '', message: '' });
    
    // Show success message (you can use toast here)
    alert('Thank you! Your feedback has been submitted.');
  };

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">No Menu Available</h1>
          <p className="text-gray-600">Please configure your menu in the dashboard.</p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Restaurant Logo"
              className="h-24 w-24 mx-auto mb-6 rounded-full object-cover shadow-lg"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <motion.div
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: customization.primaryColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </motion.div>
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: customization.secondaryColor }} />
            <span className="text-gray-600">
              {store.language === 'ar' ? 'جاري التحميل...' : 'Loading menu...'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header with Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md shadow-lg py-8 px-4 text-center sticky top-0 z-50 border-b-4"
        style={{ borderColor: customization.primaryColor }}
      >
        <div className="max-w-4xl mx-auto">
          {customization.logo && (
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              src={customization.logo}
              alt="Restaurant Logo"
              className="h-20 w-20 mx-auto mb-4 rounded-full object-cover shadow-xl ring-4 ring-white"
            />
          )}
          <h1
            className="text-4xl md:text-5xl font-serif font-bold mb-2"
            style={{ color: customization.primaryColor }}
          >
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1.5 mx-auto rounded-full"
            style={{ backgroundColor: customization.secondaryColor }}
          />
        </div>
      </motion.div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-[140px] md:top-[156px] z-40 bg-white/90 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3 min-w-max max-w-4xl mx-auto">
            {activeMenu.categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap shadow-sm"
                style={{
                  backgroundColor:
                    activeCategory === category.id
                      ? customization.primaryColor
                      : 'white',
                  color:
                    activeCategory === category.id
                      ? 'white'
                      : customization.primaryColor,
                  border: `2px solid ${customization.primaryColor}`,
                }}
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {activeMenu.categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            id={`category-${category.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.15 }}
            className="mb-16"
          >
            {/* Category Header */}
            <div className="mb-8 text-center">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: categoryIndex * 0.15 + 0.1 }}
                className="text-4xl md:text-5xl font-serif font-bold mb-3"
                style={{ color: customization.primaryColor }}
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: categoryIndex * 0.15 + 0.2, duration: 0.5 }}
                className="h-1 mx-auto rounded-full"
                style={{ backgroundColor: customization.secondaryColor }}
              />
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: itemIndex * 0.08 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                        {store.language === 'ar' ? item.nameAr : item.name}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {store.language === 'ar'
                          ? item.descriptionAr
                          : item.description}
                      </p>
                    </div>
                    <div
                      className="text-3xl font-serif font-bold whitespace-nowrap px-4 py-2 rounded-xl shadow-sm"
                      style={{
                        color: 'white',
                        backgroundColor: customization.secondaryColor,
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-md border-t-2 py-8 text-center" style={{ borderColor: customization.primaryColor }}>
        <p className="text-lg text-gray-600 font-serif">
          {store.language === 'ar'
            ? 'شكراً لزيارتكم'
            : 'Thank you for dining with us'}
        </p>
      </div>

      {/* Floating Complaint Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setComplaintDialog(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white z-50"
        style={{ backgroundColor: customization.primaryColor }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {store.language === 'ar' ? 'إرسال ملاحظة' : 'Send Feedback'}
            </DialogTitle>
            <DialogDescription>
              {store.language === 'ar'
                ? 'نحن نقدر ملاحظاتكم ونسعى لتحسين خدماتنا'
                : 'We value your feedback and strive to improve our service'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">
                {store.language === 'ar' ? 'الاسم' : 'Name'}
              </Label>
              <Input
                id="name"
                value={complaintForm.name}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, name: e.target.value })
                }
                required
                placeholder={store.language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
              />
            </div>

            <div>
              <Label htmlFor="email">
                {store.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={complaintForm.email}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, email: e.target.value })
                }
                required
                placeholder={store.language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              />
            </div>

            <div>
              <Label htmlFor="phone">
                {store.language === 'ar' ? 'رقم الهاتف' : 'Phone'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={complaintForm.phone}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, phone: e.target.value })
                }
                placeholder={store.language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone'}
              />
            </div>

            <div>
              <Label htmlFor="message">
                {store.language === 'ar' ? 'الرسالة' : 'Message'}
              </Label>
              <Textarea
                id="message"
                value={complaintForm.message}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, message: e.target.value })
                }
                required
                rows={4}
                placeholder={
                  store.language === 'ar'
                    ? 'أخبرنا عن تجربتك...'
                    : 'Tell us about your experience...'
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setComplaintDialog(false)}
                disabled={submitting}
              >
                {store.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: customization.primaryColor }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {store.language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {store.language === 'ar' ? 'إرسال' : 'Send'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default ClassicMenu;

