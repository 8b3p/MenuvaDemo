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
import { MessageCircle, Send, Loader2 } from 'lucide-react';

const Minimalist = observer(() => {
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
    primaryColor: store.templateCustomization.primaryColor || '#2C3E50',
    secondaryColor: store.templateCustomization.secondaryColor || '#95A5A6',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (activeMenu?.categories.length > 0) {
        setActiveCategory(activeMenu.categories[0].id);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [activeMenu]);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    
    alert('Thank you! Your feedback has been submitted.');
  };

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">No Menu Available</h1>
          <p className="text-gray-500 text-sm tracking-wider">Please configure your menu in the dashboard.</p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Restaurant Logo"
              className="h-20 w-20 mx-auto mb-8 rounded-full object-cover opacity-80"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <motion.div
            className="text-4xl font-light mb-6 tracking-widest uppercase text-gray-800"
            style={{ letterSpacing: '0.3em' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </motion.div>
          <div className="flex items-center gap-3 justify-center">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: customization.primaryColor }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: customization.primaryColor }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: customization.primaryColor }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center">
            {customization.logo && (
              <motion.img
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                src={customization.logo}
                alt="Restaurant Logo"
                className="h-16 w-16 mx-auto mb-6 rounded-full object-cover opacity-90"
              />
            )}
            <h1 
              className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-6"
              style={{ letterSpacing: '0.25em', color: customization.primaryColor }}
            >
              {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
            </h1>

            {/* Category Navigation - Minimal Tabs */}
            <div className="flex justify-center gap-8 flex-wrap">
              {activeMenu.categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-4 py-2 text-sm font-light tracking-widest uppercase transition-all"
                  style={{
                    color: activeCategory === category.id ? customization.primaryColor : '#9CA3AF',
                    letterSpacing: '0.2em',
                  }}
                >
                  {store.language === 'ar' ? category.nameAr : category.name}
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ backgroundColor: customization.primaryColor }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {activeMenu.categories.map((category) => (
            activeCategory === category.id && (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Category Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-16 text-center"
                >
                  <h2 
                    className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-4"
                    style={{ letterSpacing: '0.3em', color: customization.primaryColor }}
                  >
                    {store.language === 'ar' ? category.nameAr : category.name}
                  </h2>
                  <div className="flex justify-center">
                    <div 
                      className="w-16 h-px"
                      style={{ backgroundColor: customization.secondaryColor }}
                    />
                  </div>
                </motion.div>

                {/* Menu Items */}
                <div className="space-y-12">
                  {category.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      {/* Item Header */}
                      <div className="flex items-baseline justify-between gap-4 mb-3">
                        <h3 
                          className="text-xl md:text-2xl font-light tracking-wider uppercase flex-shrink-0"
                          style={{ color: customization.primaryColor }}
                        >
                          {store.language === 'ar' ? item.nameAr : item.name}
                        </h3>
                        
                        {/* Dotted Leader */}
                        <div className="flex-1 border-b border-dotted border-gray-300 mb-1.5 opacity-40" />
                        
                        <span 
                          className="text-xl font-light tracking-wider flex-shrink-0"
                          style={{ color: customization.primaryColor }}
                        >
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Item Description */}
                      <p className="text-sm md:text-base text-gray-500 leading-relaxed tracking-wide font-light pl-1">
                        {store.language === 'ar' ? item.descriptionAr : item.description}
                      </p>

                      {/* Subtle Divider */}
                      {index < category.items.length - 1 && (
                        <div className="mt-12 flex justify-center">
                          <div className="w-8 h-px bg-gray-200" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-gray-100 py-12 text-center mt-24"
      >
        <p 
          className="text-sm tracking-widest uppercase font-light"
          style={{ color: customization.secondaryColor, letterSpacing: '0.3em' }}
        >
          {store.language === 'ar' ? 'شكراً لزيارتكم' : 'Thank you'}
        </p>
      </motion.div>

      {/* Floating Complaint Button - Minimalist Style */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setComplaintDialog(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white z-50 backdrop-blur-sm"
        style={{ backgroundColor: customization.primaryColor }}
      >
        <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
      </motion.button>

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light tracking-wider">
              {store.language === 'ar' ? 'إرسال ملاحظة' : 'Send Feedback'}
            </DialogTitle>
            <DialogDescription className="text-sm tracking-wide">
              {store.language === 'ar'
                ? 'نحن نقدر ملاحظاتكم ونسعى لتحسين خدماتنا'
                : 'We value your feedback and strive to improve our service'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm tracking-wide">
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
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm tracking-wide">
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
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm tracking-wide">
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
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm tracking-wide">
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
                className="mt-1.5"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setComplaintDialog(false)}
                disabled={submitting}
                className="tracking-wide"
              >
                {store.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: customization.primaryColor }}
                className="tracking-wide"
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

export default Minimalist;

