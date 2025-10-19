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
import { MessageCircle, Send, Loader2, ChevronRight } from 'lucide-react';

const ModernGrid = observer(() => {
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
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

  // Get the active menu
  const activeMenu = store.menus[0];
  
  // Get template customization
  const customization = {
    primaryColor: store.templateCustomization.primaryColor || '#FF6B6B',
    secondaryColor: store.templateCustomization.secondaryColor || '#4ECDC4',
    logo: store.templateCustomization.logo,
  };

  // Food placeholder images from Unsplash
  const foodImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (activeMenu?.categories.length > 0) {
        setActiveCategory(activeMenu.categories[0].id);
      }
    }, 1500);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">No Menu Available</h1>
          <p className="text-gray-600">Please configure your menu in the dashboard.</p>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Restaurant Logo"
              className="h-28 w-28 mx-auto mb-6 rounded-2xl object-cover shadow-2xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <motion.div
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </motion.div>
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: customization.primaryColor }} />
            <span className="text-gray-600 font-medium">
              {store.language === 'ar' ? 'جاري التحميل...' : 'Loading menu...'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm sticky top-0 z-50 border-b"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {customization.logo && (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                src={customization.logo}
                alt="Restaurant Logo"
                className="h-14 w-14 rounded-xl object-cover shadow-lg"
              />
            )}
            <div className="flex-1 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
              </h1>
            </div>
            <div className="w-14" /> {/* Spacer for balance */}
          </div>

          {/* Category Navigation - Horizontal Scroll */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 min-w-max pb-2">
              {activeMenu.categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap shadow-sm"
                  style={{
                    backgroundColor:
                      activeCategory === category.id
                        ? customization.primaryColor
                        : 'white',
                    color:
                      activeCategory === category.id
                        ? 'white'
                        : '#374151',
                    border: activeCategory === category.id ? 'none' : '2px solid #E5E7EB',
                  }}
                >
                  {store.language === 'ar' ? category.nameAr : category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Grid Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeMenu.categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCategory === category.id ? 1 : 0 }}
            className={activeCategory === category.id ? 'block' : 'hidden'}
          >
            {/* Category Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {store.language === 'ar' ? category.nameAr : category.name}
              </h2>
              <div
                className="h-1.5 w-24 rounded-full"
                style={{ backgroundColor: customization.secondaryColor }}
              />
            </motion.div>

            {/* Grid of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {category.items.map((item, itemIndex) => {
                const imageUrl = foodImages[itemIndex % foodImages.length];
                const isImageLoaded = imageLoadStates[item.id];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIndex * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gray-200">
                      {!isImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                      )}
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                          isImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => {
                          setImageLoadStates(prev => ({ ...prev, [item.id]: true }));
                        }}
                        loading="lazy"
                      />
                      
                      {/* Price Badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: itemIndex * 0.1 + 0.2 }}
                        className="absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-white shadow-lg text-lg"
                        style={{ backgroundColor: customization.secondaryColor }}
                      >
                        ${item.price.toFixed(2)}
                      </motion.div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {store.language === 'ar' ? item.nameAr : item.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {store.language === 'ar'
                          ? item.descriptionAr
                          : item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-8 text-center">
        <p className="text-lg text-gray-600 font-medium">
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
            <DialogTitle className="text-2xl font-bold">
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

export default ModernGrid;

