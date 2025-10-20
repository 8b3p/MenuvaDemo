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
import { MessageCircle, Send, Loader2, X, Clock, Flame, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MenuItem } from '@/stores/RootStore';

const ModernGrid = observer(() => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const activeMenu = store.menus[0];
  const customization = {
    primaryColor: store.templateCustomization.primaryColor || '#FF6B6B',
    secondaryColor: store.templateCustomization.secondaryColor || '#4ECDC4',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (activeMenu?.categories?.[0]) {
        setSelectedCategory(activeMenu.categories[0].id);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeMenu]);

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
    alert('Feedback submitted! 🎉');
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <p className="text-white text-xl">No menu available</p>
      </div>
    );
  }

  const currentCategory = activeMenu.categories.find((c: any) => c.id === selectedCategory);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Logo"
              className="h-32 w-32 mx-auto mb-6 rounded-3xl object-cover shadow-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <motion.div
            className="text-5xl font-black mb-4 text-white drop-shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </motion.div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {customization.logo && (
              <img
                src={customization.logo}
                alt="Logo"
                className="h-12 w-12 rounded-2xl object-cover shadow-lg"
              />
            )}
            <h1 className="text-2xl font-black text-white drop-shadow-md">
              {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
            </h1>
            <div className="w-12" />
          </div>

          {/* Horizontal Scrolling Categories */}
          <div className="relative">
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            <div
              ref={categoryScrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {activeMenu.categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === category.id
                      ? 'bg-white text-purple-600 shadow-lg scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {store.language === 'ar' ? category.nameAr : category.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Items */}
      <div className="p-4 pb-24">
        <AnimatePresence mode="wait">
          {currentCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {currentCategory.items.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    {/* Image Area with Gradient Overlay */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-7xl">
                        🍽️
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {item.spiceLevel && (
                          <div className="bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                            {Array.from({ length: item.spiceLevel }).map((_: any, i: number) => (
                              <Flame key={i} className="w-3 h-3" fill="currentColor" />
                            ))}
                          </div>
                        )}
                        {item.dietaryTags?.slice(0, 1).map((tag: string) => (
                          <div key={tag} className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {tag === 'vegetarian' ? '🥬' : tag === 'vegan' ? '🌱' : '✓'}
                          </div>
                        ))}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                        <div className="text-2xl font-black" style={{ color: customization.primaryColor }}>
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {store.language === 'ar' ? item.nameAr : item.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {store.language === 'ar' ? item.descriptionAr : item.description}
                      </p>

                      {/* Quick Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {item.prepTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {item.prepTime}m
                          </div>
                        )}
                        {item.calories && (
                          <div className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            {item.calories}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet for Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="sticky top-0 bg-white pt-4 pb-2 px-6 border-b flex items-center justify-between rounded-t-3xl">
                <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Title */}
                <div className="mb-6">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">
                    {store.language === 'ar' ? selectedItem.nameAr : selectedItem.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {store.language === 'ar' ? selectedItem.descriptionAr : selectedItem.description}
                  </p>
                </div>

                {/* Price & Info Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-2xl text-center">
                    <div className="text-sm mb-1">{store.language === 'ar' ? 'السعر' : 'Price'}</div>
                    <div className="text-2xl font-black">${selectedItem.price.toFixed(2)}</div>
                  </div>
                  {selectedItem.prepTime && (
                    <div className="bg-gray-100 p-4 rounded-2xl text-center">
                      <div className="text-sm text-gray-600 mb-1">{store.language === 'ar' ? 'الوقت' : 'Time'}</div>
                      <div className="text-2xl font-black text-gray-900">{selectedItem.prepTime}m</div>
                    </div>
                  )}
                  {selectedItem.calories && (
                    <div className="bg-gray-100 p-4 rounded-2xl text-center">
                      <div className="text-sm text-gray-600 mb-1">{store.language === 'ar' ? 'سعرات' : 'Cal'}</div>
                      <div className="text-2xl font-black text-gray-900">{selectedItem.calories}</div>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">{store.language === 'ar' ? 'المكونات' : 'Ingredients'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(store.language === 'ar' ? selectedItem.ingredientsAr : selectedItem.ingredients)?.map((ing: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">{store.language === 'ar' ? 'الأحجام' : 'Sizes'}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedItem.sizes.map((size: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 border-2 border-purple-200 rounded-xl text-center hover:border-purple-500 transition-colors"
                        >
                          <div className="text-sm text-gray-600">{store.language === 'ar' ? size.nameAr : size.name}</div>
                          <div className="text-lg font-bold text-purple-600">${size.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3">{store.language === 'ar' ? 'الإضافات' : 'Add-ons'}</h3>
                    <div className="space-y-2">
                      {selectedItem.options.map((option: any) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="font-medium">{store.language === 'ar' ? option.nameAr : option.name}</span>
                          <span className="font-bold text-purple-600">
                            {option.price > 0 ? `+$${option.price.toFixed(2)}` : store.language === 'ar' ? 'مجاناً' : 'Free'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-red-600 mb-3">{store.language === 'ar' ? 'مسببات الحساسية' : 'Allergens'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(store.language === 'ar' ? selectedItem.allergensAr : selectedItem.allergens)?.map((allergen: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Tags */}
                {selectedItem.dietaryTags && selectedItem.dietaryTags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-green-600 mb-3 flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      {store.language === 'ar' ? 'معلومات غذائية' : 'Dietary Info'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.dietaryTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize"
                        >
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Complaint Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setComplaintDialog(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white z-40 bg-gradient-to-br from-purple-600 to-pink-600"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
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
              <Button type="button" variant="outline" onClick={() => setComplaintDialog(false)} disabled={submitting}>
                {store.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
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

