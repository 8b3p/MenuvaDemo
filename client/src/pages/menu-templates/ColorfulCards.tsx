import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
import { MessageCircle, Send, Loader2, X } from 'lucide-react';

const ColorfulCards = observer(() => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const activeMenu = store.activeMenu;
  const customization = {
    primaryColor: store.templateCustomization.primaryColor || '#00CED1',
    logo: store.templateCustomization.logo,
  };

  // Pastel background colors for cards (subtle, not overly colorful)
  const cardColors = [
    '#E6D5E8', // soft purple
    '#F5E6D3', // soft beige/yellow
    '#D5E5F5', // soft blue
    '#D5F5E3', // soft green
    '#F5D5E8', // soft pink
    '#E8E5D5', // soft tan
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeMenu?.categories && activeMenu.categories.length > 0) {
      setActiveCategory(activeMenu.categories[0].id);
    }
  }, [activeMenu]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    store.addComplaint({
      id: Date.now().toString(),
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      customerName: complaintForm.name,
      email: complaintForm.email,
      phone: complaintForm.phone,
      message: complaintForm.message,
      category: 'General',
    });
    setSubmitting(false);
    setComplaintDialog(false);
    setComplaintForm({ name: '', email: '', phone: '', message: '' });
    alert('Thank you for your feedback.');
  };

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">No menu available</p>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Logo"
              className="h-24 w-24 mx-auto mb-6 rounded-full object-cover"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
          <motion.div
            className="text-lg font-medium"
            style={{ color: customization.primaryColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {store.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-4xl md:text-5xl font-bold text-white text-center px-4"
          style={{ color: customization.primaryColor }}
        >
          {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
        </motion.h1>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {activeMenu.categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  activeCategory === category.id
                    ? { backgroundColor: customization.primaryColor }
                    : {}
                }
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeMenu.categories.map((category: any, catIndex: number) => (
          <motion.div
            key={category.id}
            id={`category-${category.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-16 scroll-mt-32"
          >
            {/* Category Title */}
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-8"
              style={{ color: customization.primaryColor }}
            >
              {store.language === 'ar' ? category.nameAr : category.name}
            </h2>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item: any, itemIndex: number) => {
                const bgColor = cardColors[itemIndex % cardColors.length];

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: itemIndex * 0.05 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => setSelectedItem(item)}
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 aspect-square flex flex-col items-center justify-center p-6"
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* Product Image */}
                    <div className="w-full h-2/3 flex items-center justify-center mb-4">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'}
                        alt={item.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        loading="lazy"
                      />
                    </div>

                    {/* Item Name - Centered */}
                    <h3 className="text-xl font-bold text-gray-800 text-center">
                      {store.language === 'ar' ? item.nameAr : item.name}
                    </h3>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simplified Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center p-8">
                <img
                  src={selectedItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop'}
                  alt={selectedItem.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Item Details - Simplified */}
              <div className="p-8">
                {/* Name and Price */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {store.language === 'ar' ? selectedItem.nameAr : selectedItem.name}
                  </h2>
                  <div 
                    className="text-2xl font-bold ml-4"
                    style={{ color: customization.primaryColor }}
                  >
                    ${selectedItem.price.toFixed(2)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {store.language === 'ar' ? selectedItem.descriptionAr : selectedItem.description}
                </p>

                {/* Sizes - Only if available */}
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      {store.language === 'ar' ? 'الأحجام' : 'Sizes'}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedItem.sizes.map((size: any, i: number) => (
                        <div
                          key={i}
                          className="border-2 rounded-lg p-3 text-center hover:border-current transition-colors cursor-pointer"
                          style={{ borderColor: customization.primaryColor + '40' }}
                        >
                          <div className="font-semibold text-gray-900 text-sm">
                            {store.language === 'ar' ? size.nameAr : size.name}
                          </div>
                          <div 
                            className="text-lg font-bold mt-1"
                            style={{ color: customization.primaryColor }}
                          >
                            ${size.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Complaint Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setComplaintDialog(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-40 text-white"
        style={{ backgroundColor: customization.primaryColor }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle style={{ color: customization.primaryColor }}>
              {store.language === 'ar' ? 'إرسال ملاحظة' : 'Send Feedback'}
            </DialogTitle>
            <DialogDescription>
              {store.language === 'ar' ? 'نحن نقدر ملاحظاتكم' : 'We value your feedback'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{store.language === 'ar' ? 'الاسم' : 'Name'}</Label>
              <Input
                id="name"
                value={complaintForm.name}
                onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{store.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={complaintForm.email}
                onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{store.language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input
                id="phone"
                type="tel"
                value={complaintForm.phone}
                onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="message">{store.language === 'ar' ? 'الرسالة' : 'Message'}</Label>
              <Textarea
                id="message"
                value={complaintForm.message}
                onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                required
                rows={4}
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
                className="text-white"
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

export default ColorfulCards;

