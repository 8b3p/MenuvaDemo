import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Menu, Category, MenuItem } from '@/stores/RootStore';

const ClassicMenu = observer(() => {
  const store = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Get the active menu (first menu for now, can be made dynamic later)
  const activeMenu = store.menus[0];
  
  // Get template customization from store
  const customization = {
    primaryColor: store.templateCustomization.primaryColor || '#8B4513',
    secondaryColor: store.templateCustomization.secondaryColor || '#D4AF37',
    logo: store.templateCustomization.logo,
  };

  useEffect(() => {
    if (activeMenu?.categories.length > 0) {
      setActiveCategory(activeMenu.categories[0].id);
    }
  }, [activeMenu]);

  if (!activeMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-800 mb-2">No Menu Available</h1>
          <p className="text-gray-600">Please configure your menu in the dashboard.</p>
        </div>
      </div>
    );
  }

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header with Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm py-8 px-4 text-center border-b-2"
        style={{ borderColor: customization.primaryColor }}
      >
        {customization.logo && (
          <img
            src={customization.logo}
            alt="Restaurant Logo"
            className="h-20 w-20 mx-auto mb-4 rounded-full object-cover shadow-md"
          />
        )}
        <h1
          className="text-4xl font-serif font-bold mb-2"
          style={{ color: customization.primaryColor }}
        >
          {store.language === 'ar' ? activeMenu.nameAr : activeMenu.name}
        </h1>
        <div
          className="w-24 h-1 mx-auto rounded-full"
          style={{ backgroundColor: customization.secondaryColor }}
        />
      </motion.div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b">
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {activeMenu.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={{
                  backgroundColor:
                    activeCategory === category.id
                      ? customization.primaryColor
                      : 'transparent',
                  color:
                    activeCategory === category.id
                      ? 'white'
                      : customization.primaryColor,
                  border: `1px solid ${customization.primaryColor}`,
                }}
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {activeMenu.categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            id={`category-${category.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-12"
          >
            {/* Category Header */}
            <div className="mb-6">
              <h2
                className="text-3xl font-serif font-bold mb-2"
                style={{ color: customization.primaryColor }}
              >
                {store.language === 'ar' ? category.nameAr : category.name}
              </h2>
              <div
                className="w-16 h-0.5 rounded-full"
                style={{ backgroundColor: customization.secondaryColor }}
              />
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: itemIndex * 0.05 }}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-serif font-semibold text-gray-800 mb-1">
                        {store.language === 'ar' ? item.nameAr : item.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {store.language === 'ar'
                          ? item.descriptionAr
                          : item.description}
                      </p>
                    </div>
                    <div
                      className="text-xl font-serif font-bold whitespace-nowrap"
                      style={{ color: customization.secondaryColor }}
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
      <div className="bg-white border-t py-6 text-center">
        <p className="text-sm text-gray-500">
          {store.language === 'ar'
            ? 'شكراً لزيارتكم'
            : 'Thank you for dining with us'}
        </p>
      </div>
    </div>
  );
});

export default ClassicMenu;

