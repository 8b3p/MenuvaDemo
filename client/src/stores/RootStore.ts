import { makeAutoObservable } from 'mobx';

// Types
export interface MenuItemSize {
  name: string;
  nameAr: string;
  price: number;
}

export interface MenuItemOption {
  id: string;
  name: string;
  nameAr: string;
  price: number;
}

// Global Item (in the item pool)
export interface Item {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image?: string;
  ingredients?: string[];
  ingredientsAr?: string[];
  allergens?: string[];
  allergensAr?: string[];
  dietaryTags?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'halal' | 'kosher')[];
  spiceLevel?: 1 | 2 | 3 | 4 | 5;
  prepTime?: number; // in minutes
  calories?: number;
  sizes?: MenuItemSize[];
  options?: MenuItemOption[];
}

// Type alias for backward compatibility
export type MenuItem = Item;

// Global Category (in the category pool)
export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
}

// Menu Category Order (references category and items)
export interface MenuCategoryOrder {
  categoryId: string;
  itemIds: string[];
}

// Menu (defines which items/categories and their order)
// Populated menu with actual category and item data
export interface PopulatedMenu extends Omit<Menu, 'categoryOrder'> {
  categories: Array<Category & { items: Item[] }>;
}

export interface Menu {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  categoryOrder: MenuCategoryOrder[];
}

// Template (just UI configuration)
export interface Template {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  thumbnail: string;
  description?: string;
  descriptionAr?: string;
}

export interface Complaint {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  date: string;
  category: string;
}

export interface TemplateCustomization {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
}

class RootStore {
  // Auth
  isAuthenticated = false;

  // Theme
  theme: 'light' | 'dark' = 'light';

  // Language
  language: 'en' | 'ar' = 'en';

  // Global Data Pools
  items: Item[] = [];
  categories: Category[] = [];

  // Menus (reference items and categories)
  menus: Menu[] = [];
  activeMenuId: string | null = null;

  // Templates (UI only)
  templates: Template[] = [];
  activeTemplateId: string | null = null;
  templateCustomization: TemplateCustomization = {
    logo: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
  };

  // Complaints
  complaints: Complaint[] = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeMockData();
  }

  // Auth actions
  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
    // Reset all data on logout
    this.items = [];
    this.categories = [];
    this.menus = [];
    this.complaints = [];
    this.activeMenuId = null;
    this.activeTemplateId = null;
    this.templateCustomization = {
      logo: null,
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
    };
    this.initializeMockData();
  }

  // Theme actions
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
  }

  // Language actions
  toggleLanguage() {
    this.language = this.language === 'en' ? 'ar' : 'en';
  }

  setLanguage(lang: 'en' | 'ar') {
    this.language = lang;
  }

  // Item actions
  addItem(item: Item) {
    this.items.push(item);
  }

  updateItem(id: string, updates: Partial<Item>) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
    }
  }

  deleteItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }

  // Category actions
  addCategory(category: Category) {
    this.categories.push(category);
  }

  updateCategory(id: string, updates: Partial<Category>) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...updates };
    }
  }

  deleteCategory(id: string) {
    this.categories = this.categories.filter((c) => c.id !== id);
  }

  // Menu actions
  addMenu(menu: Menu) {
    this.menus.push(menu);
  }

  updateMenu(id: string, updates: Partial<Menu>) {
    const index = this.menus.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.menus[index] = { ...this.menus[index], ...updates };
    }
  }

  deleteMenu(id: string) {
    this.menus = this.menus.filter((m) => m.id !== id);
  }

  setActiveMenu(id: string) {
    this.activeMenuId = id;
  }

  // Template actions
  setActiveTemplate(id: string) {
    this.activeTemplateId = id;
  }

  updateTemplateCustomization(customization: Partial<TemplateCustomization>) {
    this.templateCustomization = { ...this.templateCustomization, ...customization };
  }

  // Complaint actions
  addComplaint(complaint: Complaint) {
    this.complaints.push(complaint);
  }

  updateComplaint(id: string, updates: Partial<Complaint>) {
    const index = this.complaints.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.complaints[index] = { ...this.complaints[index], ...updates };
    }
  }

  deleteComplaint(id: string) {
    this.complaints = this.complaints.filter((c) => c.id !== id);
  }

  // Helper: Get menu with populated data
  getMenuWithData(menuId: string): PopulatedMenu | null {
    const menu = this.menus.find((m) => m.id === menuId);
    if (!menu) return null;

    return {
      ...menu,
      categories: menu.categoryOrder.map((co) => {
        const category = this.categories.find((c) => c.id === co.categoryId);
        if (!category) throw new Error(`Category ${co.categoryId} not found`);

        const items = co.itemIds
          .map((itemId) => this.items.find((i) => i.id === itemId))
          .filter((item): item is Item => item !== undefined);

        return {
          ...category,
          items,
        };
      }),
    };
  }

  // Helper: Get active menu with data
  get activeMenu() {
    if (!this.activeMenuId) return null;
    return this.getMenuWithData(this.activeMenuId);
  }

  // Helper: Get active template
  get activeTemplate() {
    if (!this.activeTemplateId) return null;
    return this.templates.find((t) => t.id === this.activeTemplateId);
  }

  // Initialize mock data
  private initializeMockData() {
    // Items
    this.items = [
      { id: 'item-1', name: 'Caesar Salad', nameAr: 'سلطة سيزر', description: 'Fresh romaine lettuce with parmesan and croutons', descriptionAr: 'خس روماني طازج مع البارميزان والخبز المحمص', price: 12.99, image: '/menu-items/caesar-salad.jpg', ingredients: ['Romaine Lettuce', 'Parmesan Cheese', 'Croutons', 'Caesar Dressing', 'Lemon'], allergens: ['Dairy', 'Gluten', 'Eggs'], dietaryTags: ['vegetarian'], prepTime: 10, calories: 350, sizes: [{ name: 'Small', nameAr: 'صغير', price: 9.99 }, { name: 'Regular', nameAr: 'عادي', price: 12.99 }, { name: 'Large', nameAr: 'كبير', price: 15.99 }] },
      { id: 'item-2', name: 'Bruschetta', nameAr: 'بروشيتا', description: 'Toasted bread with tomatoes and basil', descriptionAr: 'خبز محمص مع الطماطم والريحان', price: 9.99, image: '/menu-items/bruschetta.jpg', ingredients: ['Sourdough Bread', 'Tomatoes', 'Fresh Basil', 'Garlic', 'Olive Oil'], allergens: ['Gluten'], dietaryTags: ['vegan', 'dairy-free'], prepTime: 8, calories: 220 },
      { id: 'item-3', name: 'Buffalo Wings', nameAr: 'أجنحة بافلو', description: 'Crispy chicken wings tossed in spicy buffalo sauce', descriptionAr: 'أجنحة دجاج مقرمشة بصلصة بافلو الحارة', price: 14.99, image: '/menu-items/buffalo-wings.jpg', ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Butter', 'Celery'], allergens: ['Dairy'], spiceLevel: 4, prepTime: 20, calories: 580, sizes: [{ name: '6 pieces', nameAr: '6 قطع', price: 14.99 }, { name: '12 pieces', nameAr: '12 قطعة', price: 24.99 }] },
      { id: 'item-4', name: 'Greek Salad', nameAr: 'سلطة يونانية', description: 'Fresh vegetables with feta cheese and olives', descriptionAr: 'خضروات طازجة مع جبنة فيتا وزيتون', price: 11.99, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', ingredients: ['Cucumber', 'Tomatoes', 'Feta Cheese', 'Olives', 'Red Onion'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 8, calories: 280 },
      { id: 'item-5', name: 'Garlic Bread', nameAr: 'خبز بالثوم', description: 'Crispy bread with garlic butter and herbs', descriptionAr: 'خبز مقرمش مع زبدة الثوم والأعشاب', price: 6.99, image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24f0e4', ingredients: ['French Bread', 'Garlic', 'Butter', 'Parsley'], allergens: ['Gluten', 'Dairy'], dietaryTags: ['vegetarian'], prepTime: 10, calories: 320 },
      { id: 'item-6', name: 'Grilled Salmon', nameAr: 'سلمون مشوي', description: 'Fresh Atlantic salmon with herbs and lemon butter sauce', descriptionAr: 'سلمون أطلسي طازج مع الأعشاب وصلصة الزبدة بالليمون', price: 24.99, image: '/menu-items/grilled-salmon.jpg', ingredients: ['Atlantic Salmon', 'Lemon', 'Butter', 'Dill', 'Asparagus'], allergens: ['Fish', 'Dairy'], dietaryTags: ['gluten-free'], prepTime: 25, calories: 520 },
      { id: 'item-7', name: 'Ribeye Steak', nameAr: 'ستيك ريب آي', description: 'Premium beef steak cooked to perfection', descriptionAr: 'ستيك لحم بقري ممتاز مطبوخ بإتقان', price: 32.99, image: '/menu-items/ribeye-steak.jpg', ingredients: ['Ribeye Beef', 'Sea Salt', 'Black Pepper', 'Rosemary'], allergens: ['Dairy'], dietaryTags: ['gluten-free'], prepTime: 30, calories: 780, sizes: [{ name: '8 oz', nameAr: '8 أونصة', price: 28.99 }, { name: '12 oz', nameAr: '12 أونصة', price: 32.99 }, { name: '16 oz', nameAr: '16 أونصة', price: 42.99 }] },
      { id: 'item-8', name: 'Margherita Pizza', nameAr: 'بيتزا مارغريتا', description: 'Classic Italian pizza with fresh mozzarella', descriptionAr: 'بيتزا إيطالية كلاسيكية مع موزاريلا طازجة', price: 16.99, image: '/menu-items/margherita-pizza.jpg', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Fresh Mozzarella', 'Basil'], allergens: ['Gluten', 'Dairy'], dietaryTags: ['vegetarian'], prepTime: 18, calories: 650, sizes: [{ name: 'Personal (10")', nameAr: 'شخصية', price: 12.99 }, { name: 'Medium (14")', nameAr: 'وسط', price: 16.99 }, { name: 'Large (18")', nameAr: 'كبيرة', price: 22.99 }] },
      { id: 'item-9', name: 'Pad Thai', nameAr: 'باد تاي', description: 'Traditional Thai stir-fried noodles with shrimp', descriptionAr: 'نودلز تايلندية تقليدية مقلية مع جمبري', price: 18.99, image: '/menu-items/pad-thai.jpg', ingredients: ['Rice Noodles', 'Shrimp', 'Eggs', 'Peanuts', 'Tamarind Sauce'], allergens: ['Shellfish', 'Peanuts', 'Eggs'], spiceLevel: 2, prepTime: 22, calories: 620 },
      { id: 'item-10', name: 'Chicken Alfredo', nameAr: 'دجاج ألفريدو', description: 'Creamy pasta with grilled chicken', descriptionAr: 'معكرونة كريمية مع دجاج مشوي', price: 19.99, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a', ingredients: ['Fettuccine', 'Chicken Breast', 'Cream', 'Parmesan', 'Garlic'], allergens: ['Gluten', 'Dairy'], prepTime: 25, calories: 890 },
      { id: 'item-11', name: 'Beef Burger', nameAr: 'برجر لحم', description: 'Juicy beef patty with cheese and toppings', descriptionAr: 'لحم بقري مع الجبن والإضافات', price: 15.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Onion', 'Brioche Bun'], allergens: ['Gluten', 'Dairy'], prepTime: 18, calories: 720 },
      { id: 'item-12', name: 'Chocolate Lava Cake', nameAr: 'كيك الشوكولاتة', description: 'Warm chocolate cake with molten center', descriptionAr: 'كيك شوكولاتة دافئ مع مركز ذائب', price: 8.99, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51', ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'], allergens: ['Gluten', 'Dairy', 'Eggs'], dietaryTags: ['vegetarian'], prepTime: 15, calories: 450 },
      { id: 'item-13', name: 'Tiramisu', nameAr: 'تيراميسو', description: 'Classic Italian coffee-flavored dessert', descriptionAr: 'حلوى إيطالية كلاسيكية بنكهة القهوة', price: 9.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', ingredients: ['Mascarpone', 'Ladyfingers', 'Espresso', 'Cocoa Powder'], allergens: ['Gluten', 'Dairy', 'Eggs'], dietaryTags: ['vegetarian'], prepTime: 20, calories: 380 },
      { id: 'item-14', name: 'Cheesecake', nameAr: 'تشيز كيك', description: 'Creamy New York style cheesecake', descriptionAr: 'تشيز كيك نيويورك الكريمي', price: 8.99, image: 'https://images.unsplash.com/photo-1533134242820-b4f3b4a2f1b7', ingredients: ['Cream Cheese', 'Graham Crackers', 'Sugar', 'Vanilla'], allergens: ['Gluten', 'Dairy', 'Eggs'], dietaryTags: ['vegetarian'], prepTime: 10, calories: 420 },
      { id: 'item-15', name: 'Ice Cream Sundae', nameAr: 'آيس كريم صنداي', description: 'Vanilla ice cream with toppings', descriptionAr: 'آيس كريم فانيليا مع الإضافات', price: 6.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', ingredients: ['Vanilla Ice Cream', 'Chocolate Sauce', 'Whipped Cream', 'Cherry'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 5, calories: 340 },
      { id: 'item-16', name: 'Fresh Orange Juice', nameAr: 'عصير برتقال طازج', description: 'Freshly squeezed orange juice', descriptionAr: 'عصير برتقال معصور طازج', price: 5.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', ingredients: ['Fresh Oranges'], allergens: [], dietaryTags: ['vegan', 'gluten-free', 'dairy-free'], prepTime: 3, calories: 110 },
      { id: 'item-17', name: 'Iced Coffee', nameAr: 'قهوة مثلجة', description: 'Cold brew coffee with ice', descriptionAr: 'قهوة باردة مع الثلج', price: 4.99, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7', ingredients: ['Coffee', 'Ice', 'Milk', 'Sugar'], allergens: ['Dairy'], dietaryTags: ['vegetarian'], prepTime: 5, calories: 120 },
      { id: 'item-18', name: 'Mojito', nameAr: 'موهيتو', description: 'Refreshing mint and lime cocktail', descriptionAr: 'كوكتيل منعش بالنعناع والليمون', price: 8.99, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a', ingredients: ['Mint', 'Lime', 'Soda Water', 'Sugar'], allergens: [], dietaryTags: ['vegan', 'gluten-free', 'dairy-free'], prepTime: 5, calories: 150 },
      { id: 'item-19', name: 'Lemonade', nameAr: 'ليمونادة', description: 'Fresh homemade lemonade', descriptionAr: 'ليمونادة منزلية طازجة', price: 4.99, image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d', ingredients: ['Lemon', 'Sugar', 'Water', 'Ice'], allergens: [], dietaryTags: ['vegan', 'gluten-free', 'dairy-free'], prepTime: 5, calories: 130 },
      { id: 'item-20', name: 'Cappuccino', nameAr: 'كابتشينو', description: 'Espresso with steamed milk foam', descriptionAr: 'إسبريسو مع رغوة الحليب', price: 5.99, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d', ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'], allergens: ['Dairy'], dietaryTags: ['vegetarian'], prepTime: 5, calories: 140 },
      // Additional Appetizers
      { id: 'item-21', name: 'Calamari Fritti', nameAr: 'كالاماري مقلي', description: 'Crispy fried calamari with marinara sauce', descriptionAr: 'كالاماري مقرمش مع صلصة مارينارا', price: 13.99, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0', ingredients: ['Squid', 'Flour', 'Lemon', 'Marinara Sauce'], allergens: ['Gluten', 'Shellfish'], prepTime: 15, calories: 420 },
      { id: 'item-22', name: 'Spinach Artichoke Dip', nameAr: 'صلصة السبانخ والخرشوف', description: 'Creamy dip served with tortilla chips', descriptionAr: 'صلصة كريمية تقدم مع رقائق التورتيلا', price: 10.99, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270', ingredients: ['Spinach', 'Artichoke', 'Cream Cheese', 'Parmesan'], allergens: ['Dairy', 'Gluten'], dietaryTags: ['vegetarian'], prepTime: 12, calories: 380 },
      { id: 'item-23', name: 'Mozzarella Sticks', nameAr: 'أصابع الموزاريلا', description: 'Golden fried mozzarella with ranch dressing', descriptionAr: 'موزاريلا مقلية ذهبية مع صلصة رانش', price: 9.99, image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7', ingredients: ['Mozzarella', 'Breadcrumbs', 'Ranch Dressing'], allergens: ['Dairy', 'Gluten'], dietaryTags: ['vegetarian'], prepTime: 12, calories: 450 },
      { id: 'item-24', name: 'Nachos Supreme', nameAr: 'ناتشوز سوبريم', description: 'Loaded nachos with cheese, jalapeños, and sour cream', descriptionAr: 'ناتشوز محملة بالجبن والهالبينو والكريمة الحامضة', price: 12.99, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d', ingredients: ['Tortilla Chips', 'Cheddar', 'Jalapeños', 'Sour Cream', 'Guacamole'], allergens: ['Dairy', 'Gluten'], dietaryTags: ['vegetarian'], spiceLevel: 3, prepTime: 10, calories: 680 },
      { id: 'item-25', name: 'Spring Rolls', nameAr: 'سبرينغ رول', description: 'Crispy vegetable spring rolls with sweet chili sauce', descriptionAr: 'سبرينغ رول خضار مقرمش مع صلصة الفلفل الحلو', price: 8.99, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d', ingredients: ['Cabbage', 'Carrots', 'Rice Paper', 'Sweet Chili Sauce'], allergens: ['Gluten'], dietaryTags: ['vegan'], prepTime: 8, calories: 240 },
      // Additional Main Courses
      { id: 'item-26', name: 'Lamb Chops', nameAr: 'قطع لحم الخروف', description: 'Grilled lamb chops with rosemary and garlic', descriptionAr: 'قطع لحم خروف مشوية مع إكليل الجبل والثوم', price: 34.99, image: 'https://images.unsplash.com/photo-1595777216528-071e0127ccbf', ingredients: ['Lamb', 'Rosemary', 'Garlic', 'Olive Oil'], allergens: [], dietaryTags: ['gluten-free'], prepTime: 28, calories: 720 },
      { id: 'item-27', name: 'Seafood Paella', nameAr: 'بايلا المأكولات البحرية', description: 'Spanish rice dish with mixed seafood', descriptionAr: 'طبق أرز إسباني مع مأكولات بحرية متنوعة', price: 26.99, image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a', ingredients: ['Rice', 'Shrimp', 'Mussels', 'Squid', 'Saffron'], allergens: ['Shellfish'], dietaryTags: ['gluten-free'], prepTime: 35, calories: 650 },
      { id: 'item-28', name: 'BBQ Ribs', nameAr: 'أضلاع باربيكيو', description: 'Slow-cooked pork ribs with BBQ sauce', descriptionAr: 'أضلاع خنزير مطبوخة ببطء مع صلصة باربيكيو', price: 22.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947', ingredients: ['Pork Ribs', 'BBQ Sauce', 'Spices'], allergens: [], prepTime: 40, calories: 850 },
      { id: 'item-29', name: 'Vegetable Stir Fry', nameAr: 'خضار مقلية', description: 'Mixed vegetables in savory Asian sauce', descriptionAr: 'خضروات مشكلة في صلصة آسيوية لذيذة', price: 14.99, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19', ingredients: ['Broccoli', 'Bell Peppers', 'Carrots', 'Soy Sauce', 'Ginger'], allergens: ['Soy'], dietaryTags: ['vegan', 'dairy-free'], prepTime: 15, calories: 280 },
      { id: 'item-30', name: 'Chicken Tikka Masala', nameAr: 'دجاج تيكا ماسالا', description: 'Tender chicken in creamy tomato curry sauce', descriptionAr: 'دجاج طري في صلصة كاري الطماطم الكريمية', price: 18.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Curry Spices', 'Rice'], allergens: ['Dairy'], spiceLevel: 3, prepTime: 30, calories: 580 },
      { id: 'item-31', name: 'Fish and Chips', nameAr: 'سمك وبطاطس', description: 'Beer-battered fish with crispy fries', descriptionAr: 'سمك مقلي مع بطاطس مقرمشة', price: 17.99, image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7', ingredients: ['Cod', 'Beer Batter', 'Potatoes', 'Tartar Sauce'], allergens: ['Fish', 'Gluten'], prepTime: 22, calories: 720 },
      { id: 'item-32', name: 'Mushroom Risotto', nameAr: 'ريزوتو الفطر', description: 'Creamy Italian rice with wild mushrooms', descriptionAr: 'أرز إيطالي كريمي مع فطر بري', price: 19.99, image: 'https://images.unsplash.com/photo-1476124369491-f51a92e5bb3d', ingredients: ['Arborio Rice', 'Mushrooms', 'Parmesan', 'White Wine', 'Butter'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 28, calories: 520 },
      { id: 'item-33', name: 'Beef Tacos', nameAr: 'تاكو لحم البقر', description: 'Three soft tacos with seasoned beef and toppings', descriptionAr: 'ثلاثة تاكو طرية مع لحم بقري متبل وإضافات', price: 13.99, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', ingredients: ['Beef', 'Tortillas', 'Lettuce', 'Cheese', 'Salsa'], allergens: ['Dairy', 'Gluten'], spiceLevel: 2, prepTime: 18, calories: 540 },
      { id: 'item-34', name: 'Sushi Platter', nameAr: 'طبق سوشي', description: 'Assorted sushi rolls with wasabi and ginger', descriptionAr: 'لفائف سوشي متنوعة مع الواسابي والزنجبيل', price: 24.99, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', ingredients: ['Rice', 'Salmon', 'Tuna', 'Avocado', 'Nori'], allergens: ['Fish'], dietaryTags: ['gluten-free'], prepTime: 25, calories: 480 },
      // Additional Desserts
      { id: 'item-35', name: 'Crème Brûlée', nameAr: 'كريم بروليه', description: 'Classic French custard with caramelized sugar', descriptionAr: 'كاسترد فرنسي كلاسيكي مع سكر كراميل', price: 9.99, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc', ingredients: ['Cream', 'Egg Yolks', 'Sugar', 'Vanilla'], allergens: ['Dairy', 'Eggs'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 18, calories: 360 },
      { id: 'item-36', name: 'Apple Pie', nameAr: 'فطيرة التفاح', description: 'Homemade apple pie with vanilla ice cream', descriptionAr: 'فطيرة تفاح منزلية مع آيس كريم الفانيليا', price: 8.99, image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9', ingredients: ['Apples', 'Pie Crust', 'Cinnamon', 'Vanilla Ice Cream'], allergens: ['Gluten', 'Dairy', 'Eggs'], dietaryTags: ['vegetarian'], prepTime: 12, calories: 480 },
      { id: 'item-37', name: 'Panna Cotta', nameAr: 'بانا كوتا', description: 'Italian cream dessert with berry compote', descriptionAr: 'حلوى كريمة إيطالية مع كومبوت التوت', price: 8.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777', ingredients: ['Cream', 'Gelatin', 'Sugar', 'Berries'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 15, calories: 320 },
      { id: 'item-38', name: 'Brownie Sundae', nameAr: 'براوني صنداي', description: 'Warm chocolate brownie with ice cream and fudge', descriptionAr: 'براوني شوكولاتة دافئ مع آيس كريم وفدج', price: 9.99, image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2', ingredients: ['Brownie', 'Vanilla Ice Cream', 'Chocolate Fudge', 'Whipped Cream'], allergens: ['Gluten', 'Dairy', 'Eggs'], dietaryTags: ['vegetarian'], prepTime: 8, calories: 620 },
      // Additional Beverages
      { id: 'item-39', name: 'Green Tea', nameAr: 'شاي أخضر', description: 'Premium Japanese green tea', descriptionAr: 'شاي أخضر ياباني فاخر', price: 3.99, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', ingredients: ['Green Tea Leaves', 'Hot Water'], allergens: [], dietaryTags: ['vegan', 'gluten-free', 'dairy-free'], prepTime: 3, calories: 5 },
      { id: 'item-40', name: 'Mango Smoothie', nameAr: 'سموذي المانجو', description: 'Fresh mango blended with yogurt and honey', descriptionAr: 'مانجو طازج ممزوج مع الزبادي والعسل', price: 6.99, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625', ingredients: ['Mango', 'Yogurt', 'Honey', 'Ice'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 5, calories: 220 },
      { id: 'item-41', name: 'Espresso', nameAr: 'إسبريسو', description: 'Strong Italian coffee shot', descriptionAr: 'قهوة إيطالية قوية', price: 3.99, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', ingredients: ['Espresso Beans'], allergens: [], dietaryTags: ['vegan', 'gluten-free', 'dairy-free'], prepTime: 2, calories: 5 },
      { id: 'item-42', name: 'Strawberry Milkshake', nameAr: 'ميلك شيك الفراولة', description: 'Creamy strawberry milkshake with whipped cream', descriptionAr: 'ميلك شيك فراولة كريمي مع كريمة مخفوقة', price: 6.99, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', ingredients: ['Strawberries', 'Milk', 'Ice Cream', 'Whipped Cream'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 5, calories: 380 },
      { id: 'item-43', name: 'Iced Matcha Latte', nameAr: 'ماتشا لاتيه مثلج', description: 'Refreshing matcha green tea with milk', descriptionAr: 'شاي ماتشا أخضر منعش مع الحليب', price: 5.99, image: 'https://images.unsplash.com/photo-1536013564761-2a1c88d3a7c4', ingredients: ['Matcha Powder', 'Milk', 'Ice', 'Honey'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 4, calories: 180 },
      { id: 'item-44', name: 'Hot Chocolate', nameAr: 'شوكولاتة ساخنة', description: 'Rich hot chocolate with marshmallows', descriptionAr: 'شوكولاتة ساخنة غنية مع مارشميلو', price: 4.99, image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25', ingredients: ['Cocoa', 'Milk', 'Sugar', 'Marshmallows'], allergens: ['Dairy'], dietaryTags: ['vegetarian', 'gluten-free'], prepTime: 5, calories: 280 },
      { id: 'item-45', name: 'Sparkling Water', nameAr: 'ماء فوار', description: 'Refreshing sparkling mineral water', descriptionAr: 'ماء معدني فوار منعش', price: 2.99, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504', ingredients: ['Sparkling Water'], allergens: [], dietaryTags: ['vegan', 'gluten-free', 'dairy-free'], prepTime: 1, calories: 0 },
    ];

    // Categories
    this.categories = [
      { id: 'cat-1', name: 'Appetizers', nameAr: 'المقبلات', description: 'Start your meal with our delicious starters', descriptionAr: 'ابدأ وجبتك مع مقبلاتنا اللذيذة' },
      { id: 'cat-2', name: 'Main Courses', nameAr: 'الأطباق الرئيسية', description: 'Hearty and satisfying main dishes', descriptionAr: 'أطباق رئيسية شهية ومشبعة' },
      { id: 'cat-3', name: 'Desserts', nameAr: 'الحلويات', description: 'Sweet treats to end your meal', descriptionAr: 'حلويات لذيذة لإنهاء وجبتك' },
      { id: 'cat-4', name: 'Beverages', nameAr: 'المشروبات', description: 'Refreshing drinks and coffee', descriptionAr: 'مشروبات منعشة وقهوة' },
    ];

    // Menus
    this.menus = [
      {
        id: 'menu-1',
        name: 'Main Menu',
        nameAr: 'القائمة الرئيسية',
        description: 'Our complete menu selection',
        descriptionAr: 'مجموعة قائمتنا الكاملة',
        categoryOrder: [
          { categoryId: 'cat-1', itemIds: ['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-21', 'item-22', 'item-23', 'item-24', 'item-25'] },
          { categoryId: 'cat-2', itemIds: ['item-6', 'item-7', 'item-8', 'item-9', 'item-10', 'item-11', 'item-26', 'item-27', 'item-28', 'item-29', 'item-30', 'item-31', 'item-32', 'item-33', 'item-34'] },
          { categoryId: 'cat-3', itemIds: ['item-12', 'item-13', 'item-14', 'item-15', 'item-35', 'item-36', 'item-37', 'item-38'] },
          { categoryId: 'cat-4', itemIds: ['item-16', 'item-17', 'item-18', 'item-19', 'item-20', 'item-39', 'item-40', 'item-41', 'item-42', 'item-43', 'item-44', 'item-45'] },
        ],
      },
      {
        id: 'menu-2',
        name: 'Lunch Special',
        nameAr: 'عرض الغداء',
        description: 'Quick lunch options',
        descriptionAr: 'خيارات غداء سريعة',
        categoryOrder: [
          { categoryId: 'cat-1', itemIds: ['item-1', 'item-4'] },
          { categoryId: 'cat-2', itemIds: ['item-8', 'item-11', 'item-10'] },
          { categoryId: 'cat-4', itemIds: ['item-16', 'item-17', 'item-19'] },
        ],
      },
    ];

    // Set default active menu
    this.activeMenuId = 'menu-1';

    // Templates
    this.templates = [
      { id: '1', name: 'Fine Dining', nameAr: 'الطعام الفاخر', slug: 'fine-dining', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' },
      { id: '2', name: 'Modern', nameAr: 'الحديث', slug: 'modern', thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b' },
      { id: '3', name: 'Minimalist', nameAr: 'البسيط', slug: 'minimalist', thumbnail: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add' },
      { id: '4', name: 'Coffee Shop', nameAr: 'مقهى', slug: 'coffee-shop', thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb' },
    ];

    // Mock complaints
    this.complaints = [
      {
        id: '1',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'The food was cold when it arrived',
        status: 'pending',
        date: '2024-01-15',
        category: 'Food Quality',
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        message: 'Service was slow',
        status: 'in-progress',
        date: '2024-01-14',
        category: 'Service',
      },
      {
        id: '3',
        customerName: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567892',
        message: 'Great experience, thank you!',
        status: 'resolved',
        date: '2024-01-13',
        category: 'Compliment',
      },
    ];
  }
}

export const rootStore = new RootStore();

