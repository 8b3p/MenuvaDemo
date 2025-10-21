import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Package, FolderOpen, Menu as MenuIcon, ChevronRight } from 'lucide-react';

const Menus = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';
  const [selectedView, setSelectedView] = useState<'overview' | 'items' | 'categories'>('overview');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {isArabic ? 'إدارة القوائم' : 'Menu Management'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isArabic ? 'عرض العناصر والفئات والقوائم' : 'View items, categories, and menus'}
          </p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedView('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            selectedView === 'overview'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {isArabic ? 'نظرة عامة' : 'Overview'}
        </button>
        <button
          onClick={() => setSelectedView('items')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            selectedView === 'items'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {isArabic ? 'العناصر' : 'Items'}
        </button>
        <button
          onClick={() => setSelectedView('categories')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            selectedView === 'categories'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {isArabic ? 'الفئات' : 'Categories'}
        </button>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'إجمالي العناصر' : 'Total Items'}</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{store.items.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'الفئات' : 'Categories'}</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{store.categories.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{isArabic ? 'القوائم' : 'Menus'}</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{store.menus.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <MenuIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Menus List */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isArabic ? 'القوائم المتاحة' : 'Available Menus'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {store.menus.map((menu, index) => {
                const populatedMenu = store.getMenuWithData(menu.id);
                if (!populatedMenu) return null;
                
                return (
                  <motion.div
                    key={menu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MenuIcon className="w-5 h-5" />
                          {isArabic ? menu.nameAr : menu.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {populatedMenu.categories.length} {isArabic ? 'فئة' : 'categories'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {populatedMenu.categories.reduce((sum, cat) => sum + cat.items.length, 0)} {isArabic ? 'عنصر' : 'items'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Items View */}
      {selectedView === 'items' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'جميع العناصر' : 'All Items'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {isArabic ? item.nameAr : item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {isArabic ? item.descriptionAr : item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="flex gap-1">
                          {item.dietaryTags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {item.prepTime && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {item.prepTime} {isArabic ? 'دقيقة' : 'min'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Categories View */}
      {selectedView === 'categories' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'جميع الفئات' : 'All Categories'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {store.categories.map((category, index) => {
              // Count items in this category across all menus
              const itemCount = store.menus.reduce((count, menu) => {
                const categoryOrder = menu.categoryOrder.find(co => co.categoryId === category.id);
                return count + (categoryOrder?.itemIds.length || 0);
              }, 0);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FolderOpen className="w-5 h-5" />
                        {isArabic ? category.nameAr : category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {isArabic ? category.descriptionAr : category.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {itemCount} {isArabic ? 'عنصر' : 'items'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default Menus;

