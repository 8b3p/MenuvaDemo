import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
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
import { MessageCircle, Send, Loader2, ArrowLeft, ChevronRight } from 'lucide-react';
import type { MenuItem } from '@/stores/RootStore';

const ClassicMenu = observer(() => {
  const store = useStore();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/menu/classic/:itemId');
  const [isLoading, setIsLoading] = useState(true);
  const [complaintDialog, setComplaintDialog] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Get the first menu with populated data (categories and items)
  const activeMenu = store.menus.length > 0 ? store.getMenuWithData(store.menus[0].id) : null;
  const customization = {
    primaryColor: store.templateCustomization.primaryColor || '#D4AF37',
    secondaryColor: store.templateCustomization.secondaryColor || '#8B7355',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
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
    alert('Thank you! Your feedback has been submitted.');
  };

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">No menu available</p>
      </div>
    );
  }

  // Find selected item if viewing item detail page
  const selectedItem = match && params?.itemId
    ? activeMenu.categories.flatMap((c: any) => c.items).find((item: any) => item.id === params.itemId)
    : null;

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {customization.logo && (
            <motion.img
              src={customization.logo}
              alt="Logo"
              className="h-40 w-40 mx-auto mb-8 rounded-full object-cover shadow-2xl border-4"
              style={{ borderColor: customization.primaryColor }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <motion.div
            className="text-6xl font-serif font-bold mb-6 tracking-wider"
            style={{ color: customization.primaryColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
          </motion.div>
          <div className="h-1 w-32 mx-auto mb-4" style={{ backgroundColor: customization.primaryColor }} />
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            {store.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    );
  }

  // Item Detail Page
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-6 left-6 z-50"
        >
          <button
            onClick={() => setLocation('/menu/classic')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{store.language === 'ar' ? 'رجوع' : 'Back'}</span>
          </button>
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Decorative Top Border */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent" style={{ backgroundColor: customization.primaryColor }} />
              <div className="text-4xl" style={{ color: customization.primaryColor }}>✦</div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent" style={{ backgroundColor: customization.primaryColor }} />
            </div>

            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4" style={{ color: customization.primaryColor }}>
              {store.language === 'ar' ? selectedItem.nameAr : selectedItem.name}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed italic">
              {store.language === 'ar' ? selectedItem.descriptionAr : selectedItem.description}
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Price */}
              <div className="border-2 rounded-lg p-6 text-center" style={{ borderColor: customization.primaryColor }}>
                <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                  {store.language === 'ar' ? 'السعر' : 'Price'}
                </div>
                <div className="text-5xl font-bold" style={{ color: customization.primaryColor }}>
                  ${selectedItem.price.toFixed(2)}
                </div>
              </div>

              {/* Sizes */}
              {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif mb-4" style={{ color: customization.primaryColor }}>
                    {store.language === 'ar' ? 'الأحجام' : 'Sizes'}
                  </h3>
                  <div className="space-y-3">
                    {selectedItem.sizes.map((size: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-white/5 transition-colors"
                        style={{ borderColor: customization.secondaryColor }}
                      >
                        <span className="font-medium">{store.language === 'ar' ? size.nameAr : size.name}</span>
                        <span className="text-xl font-bold" style={{ color: customization.primaryColor }}>
                          ${size.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options */}
              {selectedItem.options && selectedItem.options.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif mb-4" style={{ color: customization.primaryColor }}>
                    {store.language === 'ar' ? 'الإضافات' : 'Add-ons'}
                  </h3>
                  <div className="space-y-2">
                    {selectedItem.options.map((option: any) => (
                      <div
                        key={option.id}
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                      >
                        <span>{store.language === 'ar' ? option.nameAr : option.name}</span>
                        <span className="font-semibold" style={{ color: customization.primaryColor }}>
                          {option.price > 0 ? `+$${option.price.toFixed(2)}` : store.language === 'ar' ? 'مجاناً' : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Ingredients */}
              {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif mb-4" style={{ color: customization.primaryColor }}>
                    {store.language === 'ar' ? 'المكونات' : 'Ingredients'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(store.language === 'ar' ? selectedItem.ingredientsAr : selectedItem.ingredients)?.map((ing: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full text-sm border"
                        style={{ borderColor: customization.secondaryColor, color: customization.primaryColor }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif mb-4 text-red-400">
                    {store.language === 'ar' ? 'مسببات الحساسية' : 'Allergens'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(store.language === 'ar' ? selectedItem.allergensAr : selectedItem.allergens)?.map((allergen: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full text-sm bg-red-900/30 border border-red-500 text-red-300"
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
                  <h3 className="text-2xl font-serif mb-4" style={{ color: customization.primaryColor }}>
                    {store.language === 'ar' ? 'معلومات غذائية' : 'Dietary Info'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.dietaryTags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full text-sm bg-green-900/30 border border-green-500 text-green-300 capitalize"
                      >
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                {selectedItem.prepTime && (
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">{store.language === 'ar' ? 'وقت التحضير' : 'Prep Time'}</div>
                    <div className="text-2xl font-bold" style={{ color: customization.primaryColor }}>
                      {selectedItem.prepTime}m
                    </div>
                  </div>
                )}
                {selectedItem.calories && (
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">{store.language === 'ar' ? 'السعرات' : 'Calories'}</div>
                    <div className="text-2xl font-bold" style={{ color: customization.primaryColor }}>
                      {selectedItem.calories}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Decorative Bottom Border */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 mt-16"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent" style={{ backgroundColor: customization.primaryColor }} />
            <div className="text-4xl" style={{ color: customization.primaryColor }}>✦</div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent" style={{ backgroundColor: customization.primaryColor }} />
          </motion.div>
        </div>

        {/* Floating Complaint Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
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
          <DialogContent className="bg-gray-900 text-gray-100 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif" style={{ color: customization.primaryColor }}>
                {store.language === 'ar' ? 'إرسال ملاحظة' : 'Send Feedback'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {store.language === 'ar' ? 'نحن نقدر ملاحظاتكم' : 'We value your feedback'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">{store.language === 'ar' ? 'الاسم' : 'Name'}</Label>
                <Input
                  id="name"
                  value={complaintForm.name}
                  onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">{store.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={complaintForm.email}
                  onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">{store.language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={complaintForm.phone}
                  onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-300">{store.language === 'ar' ? 'الرسالة' : 'Message'}</Label>
                <Textarea
                  id="message"
                  value={complaintForm.message}
                  onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setComplaintDialog(false)} disabled={submitting}>
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
  }

  // Main Menu List
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex flex-col items-center justify-center px-6"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        }}
      >
        {customization.logo && (
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={customization.logo}
            alt="Logo"
            className="h-32 w-32 mb-8 rounded-full object-cover shadow-2xl border-4"
            style={{ borderColor: customization.primaryColor }}
          />
        )}
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl font-serif font-bold text-center mb-6 tracking-wider"
          style={{ color: customization.primaryColor }}
        >
          {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6 }}
          className="h-1 w-48 mb-8"
          style={{ backgroundColor: customization.primaryColor }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 text-lg tracking-widest uppercase"
        >
          {store.language === 'ar' ? 'قائمة الطعام' : 'Menu'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 animate-bounce"
        >
          <ChevronRight className="w-8 h-8 rotate-90" style={{ color: customization.primaryColor }} />
        </motion.div>
      </motion.div>

      {/* Menu Categories */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        {activeMenu.categories.map((category: any, catIndex: number) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-24"
          >
            {/* Category Header with Ornate Design */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-24 bg-gradient-to-r from-transparent" style={{ backgroundColor: customization.primaryColor }} />
                <div className="text-3xl" style={{ color: customization.primaryColor }}>✦</div>
                <div className="h-px w-24 bg-gradient-to-l from-transparent" style={{ backgroundColor: customization.primaryColor }} />
              </div>
              
              <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-wide" style={{ color: customization.primaryColor }}>
                {store.language === 'ar' ? category.nameAr : category.name}
              </h2>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px w-24 bg-gradient-to-r from-transparent" style={{ backgroundColor: customization.primaryColor }} />
                <div className="text-3xl" style={{ color: customization.primaryColor }}>✦</div>
                <div className="h-px w-24 bg-gradient-to-l from-transparent" style={{ backgroundColor: customization.primaryColor }} />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-8">
              {category.items.map((item: any, itemIndex: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: itemIndex * 0.05 }}
                  onClick={() => setLocation(`/menu/classic/${item.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="border-b pb-6 hover:pb-8 transition-all" style={{ borderColor: customization.secondaryColor }}>
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-serif font-bold mb-3 group-hover:translate-x-2 transition-transform" style={{ color: customization.primaryColor }}>
                          {store.language === 'ar' ? item.nameAr : item.name}
                        </h3>
                        <p className="text-gray-400 leading-relaxed italic">
                          {store.language === 'ar' ? item.descriptionAr : item.description}
                        </p>
                        
                        {/* Quick badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.dietaryTags?.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: customization.secondaryColor, color: customization.primaryColor }}>
                              {tag}
                            </span>
                          ))}
                          {item.prepTime && (
                            <span className="text-xs px-2 py-1 rounded-full border text-gray-400" style={{ borderColor: customization.secondaryColor }}>
                              {item.prepTime}m
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-4xl font-bold mb-1" style={{ color: customization.primaryColor }}>
                          ${item.price.toFixed(2)}
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: customization.primaryColor }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-12 border-t" style={{ borderColor: customization.secondaryColor }}>
        <p className="text-gray-400 font-serif italic text-lg">
          {store.language === 'ar' ? 'شكراً لزيارتكم' : 'Thank you for dining with us'}
        </p>
      </div>

      {/* Floating Complaint Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
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
        <DialogContent className="bg-gray-900 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif" style={{ color: customization.primaryColor }}>
              {store.language === 'ar' ? 'إرسال ملاحظة' : 'Send Feedback'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {store.language === 'ar' ? 'نحن نقدر ملاحظاتكم' : 'We value your feedback'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">{store.language === 'ar' ? 'الاسم' : 'Name'}</Label>
              <Input
                id="name"
                value={complaintForm.name}
                onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">{store.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={complaintForm.email}
                onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">{store.language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input
                id="phone"
                type="tel"
                value={complaintForm.phone}
                onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-gray-300">{store.language === 'ar' ? 'الرسالة' : 'Message'}</Label>
              <Textarea
                id="message"
                value={complaintForm.message}
                onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                required
                rows={4}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setComplaintDialog(false)} disabled={submitting}>
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

