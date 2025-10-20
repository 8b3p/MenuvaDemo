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
import { MessageCircle, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { MenuItem } from '@/stores/RootStore';

const Minimalist = observer(() => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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
    accentColor: store.templateCustomization.primaryColor || '#000000',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">No menu available</p>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Logo"
              className="h-20 w-20 mx-auto mb-8 rounded-full object-cover opacity-60"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <motion.div
            className="text-sm tracking-[0.3em] uppercase text-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {store.language === 'ar' ? 'جاري التحميل' : 'Loading'}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Minimal Logo Watermark */}
      {customization.logo && (
        <div className="fixed top-8 left-8 z-10 opacity-20">
          <img
            src={customization.logo}
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-8 py-24">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <h1 className="text-6xl md:text-7xl font-light tracking-tight mb-4" style={{ color: customization.accentColor }}>
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </h1>
          <div className="h-px w-24 mx-auto" style={{ backgroundColor: customization.accentColor, opacity: 0.3 }} />
        </motion.div>

        {/* Categories & Items */}
        <div className="space-y-24">
          {activeMenu.categories.map((category: any, catIndex: number) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              {/* Category Title */}
              <h2 className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-12 text-center">
                {store.language === 'ar' ? category.nameAr : category.name}
              </h2>

              {/* Items */}
              <div className="space-y-0">
                {category.items.map((item: any, itemIndex: number) => {
                  const isExpanded = expandedItem === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.03 }}
                      className="border-b border-gray-100"
                    >
                      {/* Item Row */}
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                        className="w-full py-8 flex items-start justify-between gap-8 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex-1 text-left">
                          <h3 className="text-2xl font-light mb-2 group-hover:translate-x-1 transition-transform" style={{ color: customization.accentColor }}>
                            {store.language === 'ar' ? item.nameAr : item.name}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {store.language === 'ar' ? item.descriptionAr : item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-2xl font-light" style={{ color: customization.accentColor }}>
                            ${item.price.toFixed(2)}
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-8 space-y-6 bg-gray-50">
                              {/* Ingredients */}
                              {item.ingredients && item.ingredients.length > 0 && (
                                <div>
                                  <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">
                                    {store.language === 'ar' ? 'المكونات' : 'Ingredients'}
                                  </div>
                                  <div className="text-sm text-gray-600 leading-relaxed">
                                    {(store.language === 'ar' ? item.ingredientsAr : item.ingredients)?.join(', ')}
                                  </div>
                                </div>
                              )}

                              {/* Sizes */}
                              {item.sizes && item.sizes.length > 0 && (
                                <div>
                                  <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">
                                    {store.language === 'ar' ? 'الأحجام' : 'Sizes'}
                                  </div>
                                  <div className="flex gap-4">
                                    {item.sizes.map((size: any, i: number) => (
                                      <div key={i} className="flex items-baseline gap-2">
                                        <span className="text-sm text-gray-600">{store.language === 'ar' ? size.nameAr : size.name}</span>
                                        <span className="text-lg font-light" style={{ color: customization.accentColor }}>
                                          ${size.price.toFixed(2)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Options */}
                              {item.options && item.options.length > 0 && (
                                <div>
                                  <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">
                                    {store.language === 'ar' ? 'الإضافات' : 'Add-ons'}
                                  </div>
                                  <div className="space-y-2">
                                    {item.options.map((option: any) => (
                                      <div key={option.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{store.language === 'ar' ? option.nameAr : option.name}</span>
                                        <span style={{ color: customization.accentColor }}>
                                          {option.price > 0 ? `+$${option.price.toFixed(2)}` : '—'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Allergens */}
                              {item.allergens && item.allergens.length > 0 && (
                                <div>
                                  <div className="text-xs tracking-[0.2em] uppercase text-red-400 mb-3">
                                    {store.language === 'ar' ? 'مسببات الحساسية' : 'Allergens'}
                                  </div>
                                  <div className="text-sm text-red-600">
                                    {(store.language === 'ar' ? item.allergensAr : item.allergens)?.join(', ')}
                                  </div>
                                </div>
                              )}

                              {/* Additional Info */}
                              <div className="flex gap-6 text-xs text-gray-500">
                                {item.prepTime && (
                                  <div>
                                    <span className="text-gray-400 tracking-[0.2em] uppercase mr-2">
                                      {store.language === 'ar' ? 'الوقت' : 'Time'}
                                    </span>
                                    {item.prepTime}m
                                  </div>
                                )}
                                {item.calories && (
                                  <div>
                                    <span className="text-gray-400 tracking-[0.2em] uppercase mr-2">
                                      {store.language === 'ar' ? 'سعرات' : 'Cal'}
                                    </span>
                                    {item.calories}
                                  </div>
                                )}
                                {item.dietaryTags && item.dietaryTags.length > 0 && (
                                  <div>
                                    <span className="text-gray-400 tracking-[0.2em] uppercase mr-2">
                                      {store.language === 'ar' ? 'نوع' : 'Type'}
                                    </span>
                                    {item.dietaryTags.join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-32 mb-16">
          <div className="h-px w-24 mx-auto mb-8" style={{ backgroundColor: customization.accentColor, opacity: 0.3 }} />
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
            {store.language === 'ar' ? 'شكراً' : 'Thank You'}
          </p>
        </div>
      </div>

      {/* Floating Complaint Button - Minimal */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setComplaintDialog(true)}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full border-2 flex items-center justify-center z-50 bg-white hover:bg-gray-50 transition-colors"
        style={{ borderColor: customization.accentColor }}
      >
        <MessageCircle className="w-5 h-5" style={{ color: customization.accentColor }} />
      </motion.button>

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light" style={{ color: customization.accentColor }}>
              {store.language === 'ar' ? 'إرسال ملاحظة' : 'Send Feedback'}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {store.language === 'ar' ? 'نحن نقدر ملاحظاتكم' : 'We value your feedback'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs tracking-[0.2em] uppercase text-gray-500">
                {store.language === 'ar' ? 'الاسم' : 'Name'}
              </Label>
              <Input
                id="name"
                value={complaintForm.name}
                onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                required
                className="border-gray-200 focus:border-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs tracking-[0.2em] uppercase text-gray-500">
                {store.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={complaintForm.email}
                onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
                required
                className="border-gray-200 focus:border-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs tracking-[0.2em] uppercase text-gray-500">
                {store.language === 'ar' ? 'رقم الهاتف' : 'Phone'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={complaintForm.phone}
                onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })}
                className="border-gray-200 focus:border-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-xs tracking-[0.2em] uppercase text-gray-500">
                {store.language === 'ar' ? 'الرسالة' : 'Message'}
              </Label>
              <Textarea
                id="message"
                value={complaintForm.message}
                onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                required
                rows={4}
                className="border-gray-200 focus:border-gray-900"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setComplaintDialog(false)}
                disabled={submitting}
                className="border-gray-200"
              >
                {store.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="text-white"
                style={{ backgroundColor: customization.accentColor }}
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

