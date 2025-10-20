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
import { MessageCircle, Send, Loader2, X } from 'lucide-react';

const ColorfulCards = observer(() => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const activeMenu = store.menus[0];
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
        className="relative h-80 flex items-center justify-center overflow-hidden"
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
          className="relative text-5xl md:text-6xl font-bold text-white text-center px-4"
          style={{ color: customization.primaryColor }}
        >
          {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
        </motion.h1>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeMenu.categories.map((category: any, catIndex: number) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-16"
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
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 aspect-square"
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* Product Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'}
                        alt={item.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        loading="lazy"
                      />
                    </div>

                    {/* Item Name Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-xl font-bold text-white text-center">
                        {store.language === 'ar' ? item.nameAr : item.name}
                      </h3>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Item Detail Modal */}
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
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

              {/* Item Details */}
              <div className="p-8">
                {/* Name and Price */}
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {store.language === 'ar' ? selectedItem.nameAr : selectedItem.name}
                  </h2>
                  <div 
                    className="text-3xl font-bold ml-4"
                    style={{ color: customization.primaryColor }}
                  >
                    ${selectedItem.price.toFixed(2)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {store.language === 'ar' ? selectedItem.descriptionAr : selectedItem.description}
                </p>

                {/* Sizes */}
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {store.language === 'ar' ? 'الأحجام' : 'Sizes'}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedItem.sizes.map((size: any, i: number) => (
                        <div
                          key={i}
                          className="border-2 rounded-lg p-3 text-center hover:border-current transition-colors cursor-pointer"
                          style={{ borderColor: customization.primaryColor + '40' }}
                        >
                          <div className="font-semibold text-gray-900">
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

                {/* Options/Add-ons */}
                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {store.language === 'ar' ? 'الإضافات' : 'Add-ons'}
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.options.map((option: any) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <span className="font-medium text-gray-900">
                            {store.language === 'ar' ? option.nameAr : option.name}
                          </span>
                          <span 
                            className="font-bold"
                            style={{ color: customization.primaryColor }}
                          >
                            {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'Free'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                  {selectedItem.prepTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">
                        {store.language === 'ar' ? 'وقت التحضير:' : 'Prep Time:'}
                      </span>
                      <span>{selectedItem.prepTime}m</span>
                    </div>
                  )}
                  {selectedItem.calories && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold">
                        {store.language === 'ar' ? 'السعرات:' : 'Calories:'}
                      </span>
                      <span>{selectedItem.calories}</span>
                    </div>
                  )}
                  {selectedItem.dietaryTags && selectedItem.dietaryTags.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      {selectedItem.dietaryTags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: customization.primaryColor }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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

