import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
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
import { MessageCircle, Send, Loader2, Clock, Flame, Leaf } from 'lucide-react';
import type { MenuItem } from '@/stores/RootStore';

const ClassicMenu = observer(() => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [itemDetailDialog, setItemDetailDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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
    primaryColor: store.templateCustomization.primaryColor || '#FF6B6B',
    secondaryColor: store.templateCustomization.secondaryColor || '#4ECDC4',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

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
    
    alert('Thank you! Your feedback has been submitted.');
  };

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getDietaryIcon = (tag: string) => {
    const icons: Record<string, string> = {
      vegetarian: '🥬',
      vegan: '🌱',
      'gluten-free': '🌾',
      'dairy-free': '🥛',
      halal: '☪️',
      kosher: '✡️',
    };
    return icons[tag] || '';
  };

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Restaurant Logo"
              className="h-32 w-32 mx-auto mb-8 rounded-full object-cover shadow-2xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <motion.div
            className="text-5xl font-serif font-bold mb-6 text-gray-800"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            {customization.logo && (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                src={customization.logo}
                alt="Restaurant Logo"
                className="h-20 w-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
              />
            )}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
              {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
            </h1>
          </div>

          {/* Category Navigation */}
          <div className="flex gap-3 justify-center flex-wrap">
            {activeMenu.categories.map((category: any) => (
              <motion.button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: customization.primaryColor,
                  color: 'white',
                }}
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu Content - Single Scroll */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeMenu.categories.map((category: any, categoryIndex: number) => (
          <motion.div
            key={category.id}
            id={`category-${category.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-16 scroll-mt-32"
          >
            {/* Category Header */}
            <div className="text-center mb-10">
              <h2 
                className="text-4xl md:text-5xl font-serif font-bold mb-3"
                style={{ color: customization.primaryColor }}
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </h2>
              <div 
                className="h-1 w-24 mx-auto rounded-full"
                style={{ backgroundColor: customization.secondaryColor }}
              />
            </div>

            {/* Items - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item: any, itemIndex: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: itemIndex * 0.05 }}
                  onClick={() => {
                    setSelectedItem(item);
                    setItemDetailDialog(true);
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
                >
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      🍽️
                    </div>
                    {item.dietaryTags && item.dietaryTags.length > 0 && (
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        {item.dietaryTags.map((tag: string) => (
                          <span key={tag} className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm" title={tag}>
                            {getDietaryIcon(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.spiceLevel && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
                        {Array.from({ length: item.spiceLevel }).map((_, i) => (
                          <Flame key={i} className="w-3 h-3" fill="currentColor" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {store.language === 'ar' ? item.nameAr : item.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                      {store.language === 'ar' ? item.descriptionAr : item.description}
                    </p>

                    {/* Quick Info */}
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-2">
                        {item.prepTime && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.prepTime}m</span>
                          </div>
                        )}
                        {item.calories && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Flame className="w-3.5 h-3.5" />
                            <span>{item.calories}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: customization.secondaryColor }}
                      >
                        ${item.price.toFixed(2)}
                      </div>
                      {item.sizes && item.sizes.length > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {store.language === 'ar' ? 'أحجام متعددة' : 'Multiple sizes'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white/90 backdrop-blur-md border-t py-8 text-center">
        <p className="text-lg text-gray-600 font-serif italic">
          {store.language === 'ar' ? 'شكراً لزيارتكم' : 'Thank you for dining with us'}
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

      {/* Item Detail Dialog */}
      <Dialog open={itemDetailDialog} onOpenChange={setItemDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-serif font-bold flex items-center gap-3">
                  {store.language === 'ar' ? selectedItem.nameAr : selectedItem.name}
                  {selectedItem.spiceLevel && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: selectedItem.spiceLevel }).map((_, i) => (
                        <Flame key={i} className="w-5 h-5 text-red-500" fill="currentColor" />
                      ))}
                    </div>
                  )}
                </DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {store.language === 'ar' ? selectedItem.descriptionAr : selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Price & Quick Info */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      {store.language === 'ar' ? 'السعر' : 'Price'}
                    </div>
                    <div className="text-3xl font-bold" style={{ color: customization.secondaryColor }}>
                      ${selectedItem.price.toFixed(2)}
                    </div>
                  </div>
                  {selectedItem.prepTime && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {store.language === 'ar' ? 'وقت التحضير' : 'Prep Time'}
                      </div>
                      <div className="flex items-center gap-1.5 text-lg font-semibold">
                        <Clock className="w-5 h-5" />
                        {selectedItem.prepTime} {store.language === 'ar' ? 'دقيقة' : 'min'}
                      </div>
                    </div>
                  )}
                  {selectedItem.calories && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {store.language === 'ar' ? 'السعرات' : 'Calories'}
                      </div>
                      <div className="flex items-center gap-1.5 text-lg font-semibold">
                        <Flame className="w-5 h-5" />
                        {selectedItem.calories} {store.language === 'ar' ? 'سعرة' : 'cal'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">
                      {store.language === 'ar' ? 'المكونات' : 'Ingredients'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(store.language === 'ar' ? selectedItem.ingredientsAr : selectedItem.ingredients)?.map((ingredient, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">
                      {store.language === 'ar' ? 'الأحجام المتاحة' : 'Available Sizes'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedItem.sizes.map((size, i) => (
                        <div
                          key={i}
                          className="p-4 border-2 rounded-lg text-center hover:border-gray-400 transition-colors"
                        >
                          <div className="font-semibold text-gray-900">
                            {store.language === 'ar' ? size.nameAr : size.name}
                          </div>
                          <div className="text-lg font-bold mt-1" style={{ color: customization.secondaryColor }}>
                            ${size.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">
                      {store.language === 'ar' ? 'الإضافات' : 'Add-ons'}
                    </h4>
                    <div className="space-y-2">
                      {selectedItem.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium">
                            {store.language === 'ar' ? option.nameAr : option.name}
                          </span>
                          <span className="font-bold text-gray-700">
                            {option.price > 0 ? `+$${option.price.toFixed(2)}` : store.language === 'ar' ? 'مجاناً' : 'Free'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-red-600">
                      {store.language === 'ar' ? 'مسببات الحساسية' : 'Allergens'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(store.language === 'ar' ? selectedItem.allergensAr : selectedItem.allergens)?.map((allergen, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm font-medium text-red-700"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Tags */}
                {selectedItem.dietaryTags && selectedItem.dietaryTags.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      {store.language === 'ar' ? 'معلومات غذائية' : 'Dietary Information'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 capitalize flex items-center gap-1.5"
                        >
                          <span>{getDietaryIcon(tag)}</span>
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setItemDetailDialog(false)}>
                  {store.language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

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

export default ClassicMenu;

