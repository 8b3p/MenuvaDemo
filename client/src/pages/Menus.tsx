import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Menu as MenuIcon,
  FolderOpen,
  Package,
} from 'lucide-react';
import type { Menu, Category, MenuItem } from '@/stores/RootStore';

const Menus = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [view, setView] = useState<'menus' | 'categories' | 'items'>('menus');

  // Dialog states
  const [menuDialog, setMenuDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [menuForm, setMenuForm] = useState({ name: '', nameAr: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', nameAr: '' });
  const [itemForm, setItemForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
  });

  // Menu handlers
  const handleAddMenu = () => {
    setEditingMenu(null);
    setMenuForm({ name: '', nameAr: '' });
    setMenuDialog(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuForm({ name: menu.name, nameAr: menu.nameAr });
    setMenuDialog(true);
  };

  const handleSaveMenu = () => {
    if (editingMenu) {
      store.updateMenu(editingMenu.id, menuForm);
    } else {
      const newMenu: Menu = {
        id: Date.now().toString(),
        ...menuForm,
        categories: [],
      };
      store.addMenu(newMenu);
    }
    setMenuDialog(false);
  };

  const handleDeleteMenu = (id: string) => {
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذه القائمة؟' : 'Are you sure you want to delete this menu?')) {
      store.deleteMenu(id);
      if (selectedMenu?.id === id) {
        setSelectedMenu(null);
        setView('menus');
      }
    }
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', nameAr: '' });
    setCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, nameAr: category.nameAr });
    setCategoryDialog(true);
  };

  const handleSaveCategory = () => {
    if (!selectedMenu) return;

    if (editingCategory) {
      store.updateCategory(selectedMenu.id, editingCategory.id, categoryForm);
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryForm,
        menuId: selectedMenu.id,
        items: [],
      };
      store.addCategory(selectedMenu.id, newCategory);
    }
    setCategoryDialog(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!selectedMenu) return;
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) {
      store.deleteCategory(selectedMenu.id, categoryId);
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
        setView('categories');
      }
    }
  };

  // Item handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({ name: '', nameAr: '', description: '', descriptionAr: '', price: '' });
    setItemDialog(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      nameAr: item.nameAr,
      description: item.description,
      descriptionAr: item.descriptionAr,
      price: item.price.toString(),
    });
    setItemDialog(true);
  };

  const handleSaveItem = () => {
    if (!selectedMenu || !selectedCategory) return;

    const itemData = {
      ...itemForm,
      price: parseFloat(itemForm.price) || 0,
    };

    if (editingItem) {
      store.updateItem(selectedMenu.id, selectedCategory.id, editingItem.id, itemData);
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...itemData,
        categoryId: selectedCategory.id,
      };
      store.addItem(selectedMenu.id, selectedCategory.id, newItem);
    }
    setItemDialog(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedMenu || !selectedCategory) return;
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this item?')) {
      store.deleteItem(selectedMenu.id, selectedCategory.id, itemId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => {
            setView('menus');
            setSelectedMenu(null);
            setSelectedCategory(null);
          }}
          className="hover:text-foreground transition-colors"
        >
          {isArabic ? 'القوائم' : 'Menus'}
        </button>
        {selectedMenu && (
          <>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => {
                setView('categories');
                setSelectedCategory(null);
              }}
              className="hover:text-foreground transition-colors"
            >
              {isArabic ? selectedMenu.nameAr : selectedMenu.name}
            </button>
          </>
        )}
        {selectedCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">
              {isArabic ? selectedCategory.nameAr : selectedCategory.name}
            </span>
          </>
        )}
      </div>

      {/* Menus View */}
      {view === 'menus' && (
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {isArabic ? 'إدارة القوائم' : 'Manage Menus'}
            </h2>
            <Button onClick={handleAddMenu} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              {isArabic ? 'قائمة جديدة' : 'New Menu'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {store.menus.map((menu: any) => (
              <Card
                key={menu.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedMenu(menu);
                  setView('categories');
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MenuIcon className="w-5 h-5" />
                    {isArabic ? menu.nameAr : menu.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {menu.categories.length} {isArabic ? 'فئة' : 'categories'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditMenu(menu);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMenu(menu.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categories View */}
      {view === 'categories' && selectedMenu && (
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {isArabic ? 'الفئات' : 'Categories'}
            </h2>
            <Button onClick={handleAddCategory} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              {isArabic ? 'فئة جديدة' : 'New Category'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {selectedMenu.categories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setView('items');
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    {isArabic ? category.nameAr : category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.items.length} {isArabic ? 'عنصر' : 'items'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Items View */}
      {view === 'items' && selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {isArabic ? 'العناصر' : 'Items'}
            </h2>
            <Button onClick={handleAddItem} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              {isArabic ? 'عنصر جديد' : 'New Item'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {selectedCategory.items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {isArabic ? item.nameAr : item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isArabic ? item.descriptionAr : item.description}
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Menu Dialog */}
      <Dialog open={menuDialog} onOpenChange={setMenuDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMenu
                ? isArabic
                  ? 'تعديل القائمة'
                  : 'Edit Menu'
                : isArabic
                ? 'قائمة جديدة'
                : 'New Menu'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'أدخل تفاصيل القائمة باللغتين الإنجليزية والعربية'
                : 'Enter menu details in both English and Arabic'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="menu-name">Name (English)</Label>
              <Input
                id="menu-name"
                value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="menu-name-ar">Name (Arabic)</Label>
              <Input
                id="menu-name-ar"
                value={menuForm.nameAr}
                onChange={(e) => setMenuForm({ ...menuForm, nameAr: e.target.value })}
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMenuDialog(false)}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveMenu}>
              {isArabic ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? isArabic
                  ? 'تعديل الفئة'
                  : 'Edit Category'
                : isArabic
                ? 'فئة جديدة'
                : 'New Category'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'أدخل تفاصيل الفئة باللغتين الإنجليزية والعربية'
                : 'Enter category details in both English and Arabic'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Name (English)</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category-name-ar">Name (Arabic)</Label>
              <Input
                id="category-name-ar"
                value={categoryForm.nameAr}
                onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog(false)}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveCategory}>
              {isArabic ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? isArabic
                  ? 'تعديل العنصر'
                  : 'Edit Item'
                : isArabic
                ? 'عنصر جديد'
                : 'New Item'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'أدخل تفاصيل العنصر باللغتين الإنجليزية والعربية'
                : 'Enter item details in both English and Arabic'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Name (English)</Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="item-name-ar">Name (Arabic)</Label>
              <Input
                id="item-name-ar"
                value={itemForm.nameAr}
                onChange={(e) => setItemForm({ ...itemForm, nameAr: e.target.value })}
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="item-description">Description (English)</Label>
              <Textarea
                id="item-description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="item-description-ar">Description (Arabic)</Label>
              <Textarea
                id="item-description-ar"
                value={itemForm.descriptionAr}
                onChange={(e) => setItemForm({ ...itemForm, descriptionAr: e.target.value })}
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="item-price">Price ($)</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog(false)}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveItem}>
              {isArabic ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Menus;

