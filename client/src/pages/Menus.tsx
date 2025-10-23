import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Package, FolderOpen, Menu as MenuIcon, ChevronRight, Search, X, Filter, Plus, Edit, Trash2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Item } from '@/stores/RootStore';

const Menus = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';
  const [selectedView, setSelectedView] = useState<'overview' | 'items' | 'categories'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  
  // CRUD state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    prepTime: '',
    calories: '',
    spiceLevel: '' as '' | '1' | '2' | '3' | '4' | '5',
  });
  const [selectedFormDietaryTags, setSelectedFormDietaryTags] = useState<string[]>([]);

  const getDietaryTagName = (tag: string): string => {
    const tagMap: Record<string, string> = {
      'vegan': 'نباتي',
      'vegetarian': 'نباتي (يحتوي منتجات حيوانية)',
      'gluten-free': 'خالي من الجلوتين',
      'dairy-free': 'خالي من الألبان',
      'halal': 'حلال',
      'kosher': 'كوشر',
      'nut-free': 'خالي من المكسرات',
      'spicy': 'حار',
      'low-carb': 'قليل الكربوهيدرات',
      'keto': 'كيتو',
      'organic': 'عضوي',
    };
    
    const lowerTag = tag.toLowerCase();
    
    if (isArabic) {
      return tagMap[lowerTag] || tag;
    }
    
    // Format English: capitalize first letter of each word
    return tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  // Get all unique dietary tags
  const allDietaryTags = Array.from(
    new Set(store.items.flatMap(item => item.dietaryTags || []))
  );

  // Get item-to-category mapping
  const getItemCategory = (itemId: string): string | null => {
    for (const menu of store.menus) {
      for (const catOrder of menu.categoryOrder) {
        if (catOrder.itemIds.includes(itemId)) {
          return catOrder.categoryId;
        }
      }
    }
    return null;
  };

  // Filter items based on search, category, dietary tags, and price
  const filteredItems = store.items.filter(item => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAr.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descriptionAr.includes(searchQuery);

    // Category filter
    const itemCategory = getItemCategory(item.id);
    const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;

    // Dietary tags filter
    const matchesDietaryTags = selectedDietaryTags.length === 0 ||
      selectedDietaryTags.every(tag => item.dietaryTags?.includes(tag as any));

    // Price range filter
    let matchesPriceRange = true;
    if (priceRange === 'low') matchesPriceRange = item.price < 15;
    else if (priceRange === 'medium') matchesPriceRange = item.price >= 15 && item.price < 30;
    else if (priceRange === 'high') matchesPriceRange = item.price >= 30;

    return matchesSearch && matchesCategory && matchesDietaryTags && matchesPriceRange;
  });

  // Filter categories based on search
  const filteredCategories = store.categories.filter(category => {
    const matchesSearch = searchQuery === '' ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.nameAr.includes(searchQuery) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category.descriptionAr && category.descriptionAr.includes(searchQuery));
    return matchesSearch;
  });

  const toggleDietaryTag = (tag: string) => {
    setSelectedDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFormDietaryTag = (tag: string) => {
    setSelectedFormDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      price: '',
      prepTime: '',
      calories: '',
      spiceLevel: '',
    });
    setSelectedFormDietaryTags([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameAr: item.nameAr,
      description: item.description,
      descriptionAr: item.descriptionAr,
      price: item.price.toString(),
      prepTime: item.prepTime?.toString() || '',
      calories: item.calories?.toString() || '',
      spiceLevel: item.spiceLevel?.toString() as '' | '1' | '2' | '3' | '4' | '5' || '',
    });
    setSelectedFormDietaryTags(item.dietaryTags || []);
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.nameAr || !formData.price) {
      return; // Basic validation
    }

    const itemData: Partial<Item> = {
      name: formData.name,
      nameAr: formData.nameAr,
      description: formData.description,
      descriptionAr: formData.descriptionAr,
      price: parseFloat(formData.price),
      prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      spiceLevel: formData.spiceLevel ? parseInt(formData.spiceLevel) as 1 | 2 | 3 | 4 | 5 : undefined,
      dietaryTags: selectedFormDietaryTags as any,
    };

    if (editingItem) {
      // Update existing item
      const index = store.items.findIndex(i => i.id === editingItem.id);
      if (index !== -1) {
        store.items[index] = { ...store.items[index], ...itemData };
      }
    } else {
      // Create new item
      const newItem: Item = {
        id: `item-${Date.now()}`,
        ...itemData as Omit<Item, 'id'>,
      };
      store.items.push(newItem);
    }

    setIsDialogOpen(false);
  };

  const openDeleteDialog = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      // Remove from items array
      const itemIndex = store.items.findIndex(i => i.id === itemToDelete.id);
      if (itemIndex !== -1) {
        store.items.splice(itemIndex, 1);
      }

      // Remove from all menu category orders
      store.menus.forEach(menu => {
        menu.categoryOrder.forEach(catOrder => {
          const itemIdIndex = catOrder.itemIds.indexOf(itemToDelete.id);
          if (itemIdIndex !== -1) {
            catOrder.itemIds.splice(itemIdIndex, 1);
          }
        });
      });
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const availableDietaryTags = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher'];

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
        <div className="space-y-4">
          {/* Filters Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="w-5 h-5" />
                {isArabic ? 'تصفية العناصر' : 'Filter Items'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={isArabic ? 'ابحث عن العناصر...' : 'Search items...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-gray-900 dark:hover:text-white" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  {isArabic ? 'الفئة' : 'Category'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    {isArabic ? 'الكل' : 'All'}
                  </Button>
                  {store.categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {isArabic ? category.nameAr : category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags Filter */}
              {allDietaryTags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    {isArabic ? 'القيود الغذائية' : 'Dietary Tags'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allDietaryTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedDietaryTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleDietaryTag(tag)}
                      >
                        {getDietaryTagName(tag)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  {isArabic ? 'نطاق السعر' : 'Price Range'}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={priceRange === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceRange('all')}
                  >
                    {isArabic ? 'الكل' : 'All'}
                  </Button>
                  <Button
                    variant={priceRange === 'low' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceRange('low')}
                  >
                    {isArabic ? 'أقل من $15' : '< $15'}
                  </Button>
                  <Button
                    variant={priceRange === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceRange('medium')}
                  >
                    $15 - $30
                  </Button>
                  <Button
                    variant={priceRange === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriceRange('high')}
                  >
                    {isArabic ? 'أكثر من $30' : '> $30'}
                  </Button>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchQuery || selectedCategory !== 'all' || selectedDietaryTags.length > 0 || priceRange !== 'all') && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? `عرض ${filteredItems.length} من ${store.items.length} عنصر` : `Showing ${filteredItems.length} of ${store.items.length} items`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDietaryTags([]);
                      setPriceRange('all');
                    }}
                  >
                    {isArabic ? 'إعادة تعيين الكل' : 'Reset All'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isArabic ? 'جميع العناصر' : 'All Items'}
              </h2>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                {isArabic ? 'إضافة عنصر' : 'Add Item'}
              </Button>
            </div>
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'لم يتم العثور على عناصر' : 'No items found'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start justify-between gap-2">
                      <span>{isArabic ? item.nameAr : item.name}</span>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => openDeleteDialog(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                      {isArabic ? item.descriptionAr : item.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.dietaryTags && item.dietaryTags.length > 0 && (
                          <div className="flex gap-1 flex-wrap justify-end">
                            {item.dietaryTags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              >
                                {getDietaryTagName(tag)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {item.prepTime && (
                          <span>{item.prepTime} {isArabic ? 'دقيقة' : 'min'}</span>
                        )}
                        {item.calories && (
                          <span>{item.calories} {isArabic ? 'سعرة' : 'cal'}</span>
                        )}
                        {item.spiceLevel && (
                          <span>🌶️ {item.spiceLevel}/5</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories View */}
      {selectedView === 'categories' && (
        <div className="space-y-4">
          {/* Search Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={isArabic ? 'ابحث عن الفئات...' : 'Search categories...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-gray-900 dark:hover:text-white" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isArabic ? 'جميع الفئات' : 'All Categories'}
              {searchQuery && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredCategories.length} {isArabic ? 'نتيجة' : 'results'})
                </span>
              )}
            </h2>
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {isArabic ? 'لم يتم العثور على فئات' : 'No categories found'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredCategories.map((category, index) => {
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
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem 
                ? (isArabic ? 'تعديل العنصر' : 'Edit Item')
                : (isArabic ? 'إضافة عنصر جديد' : 'Add New Item')
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Grilled Salmon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">{isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="سلمون مشوي"
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">{isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh grilled salmon with herbs..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionAr">{isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="سلمون طازج مشوي مع الأعشاب..."
                  rows={3}
                />
              </div>
            </div>

            {/* Price and Prep Time */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{isArabic ? 'السعر ($)' : 'Price ($)'}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime">{isArabic ? 'وقت التحضير (دقيقة)' : 'Prep Time (min)'}</Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">{isArabic ? 'السعرات' : 'Calories'}</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="350"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spiceLevel">{isArabic ? 'الحرارة' : 'Spice Level'}</Label>
                <Input
                  id="spiceLevel"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.spiceLevel}
                  onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as any })}
                  placeholder="1-5"
                />
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2">
              <Label>{isArabic ? 'القيود الغذائية' : 'Dietary Tags'}</Label>
              <div className="flex flex-wrap gap-2">
                {availableDietaryTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedFormDietaryTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFormDietaryTag(tag)}
                  >
                    {getDietaryTagName(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveItem} className="gap-2">
              <Save className="w-4 h-4" />
              {isArabic ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic 
                ? `هل تريد حذف "${itemToDelete?.nameAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Do you want to delete "${itemToDelete?.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              {isArabic ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

export default Menus;

