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

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  categoryId: string;
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

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  menuId: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  nameAr: string;
  categories: Category[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
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

  // Menus
  menus: Menu[] = [];

  // Templates
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
    this.menus = [];
    this.complaints = [];
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

  // Category actions
  addCategory(menuId: string, category: Category) {
    const menu = this.menus.find((m) => m.id === menuId);
    if (menu) {
      menu.categories.push(category);
    }
  }

  updateCategory(menuId: string, categoryId: string, updates: Partial<Category>) {
    const menu = this.menus.find((m) => m.id === menuId);
    if (menu) {
      const index = menu.categories.findIndex((c) => c.id === categoryId);
      if (index !== -1) {
        menu.categories[index] = { ...menu.categories[index], ...updates };
      }
    }
  }

  deleteCategory(menuId: string, categoryId: string) {
    const menu = this.menus.find((m) => m.id === menuId);
    if (menu) {
      menu.categories = menu.categories.filter((c) => c.id !== categoryId);
    }
  }

  // Item actions
  addItem(menuId: string, categoryId: string, item: MenuItem) {
    const menu = this.menus.find((m) => m.id === menuId);
    if (menu) {
      const category = menu.categories.find((c) => c.id === categoryId);
      if (category) {
        category.items.push(item);
      }
    }
  }

  updateItem(menuId: string, categoryId: string, itemId: string, updates: Partial<MenuItem>) {
    const menu = this.menus.find((m) => m.id === menuId);
    if (menu) {
      const category = menu.categories.find((c) => c.id === categoryId);
      if (category) {
        const index = category.items.findIndex((i) => i.id === itemId);
        if (index !== -1) {
          category.items[index] = { ...category.items[index], ...updates };
        }
      }
    }
  }

  deleteItem(menuId: string, categoryId: string, itemId: string) {
    const menu = this.menus.find((m) => m.id === menuId);
    if (menu) {
      const category = menu.categories.find((c) => c.id === categoryId);
      if (category) {
        category.items = category.items.filter((i) => i.id !== itemId);
      }
    }
  }

  // Template actions
  setActiveTemplate(templateId: string) {
    this.activeTemplateId = templateId;
  }

  updateTemplateCustomization(updates: Partial<TemplateCustomization>) {
    this.templateCustomization = { ...this.templateCustomization, ...updates };
  }

  // Complaint actions
  addComplaint(data: Omit<Complaint, 'id' | 'status' | 'date'>) {
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      date: new Date().toISOString(),
    };
    this.complaints.push(newComplaint);
  }

  updateComplaintStatus(id: string, status: 'pending' | 'in-progress' | 'resolved') {
    const complaint = this.complaints.find((c) => c.id === id);
    if (complaint) {
      complaint.status = status;
    }
  }

  // Initialize mock data
  initializeMockData() {
    // Mock Templates
    this.templates = [
      {
        id: '1',
        name: 'Classic Menu',
        thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        description: 'Traditional elegant restaurant menu',
      },
      {
        id: '2',
        name: 'Modern Grid',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
        description: 'Contemporary grid-based design',
      },
      {
        id: '3',
        name: 'Minimalist',
        thumbnail: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
        description: 'Clean and simple typography-focused',
      },
    ];

    // Mock Menus with enhanced data
    this.menus = [
      {
        id: '1',
        name: 'Main Menu',
        nameAr: 'القائمة الرئيسية',
        categories: [
          {
            id: '1',
            name: 'Appetizers',
            nameAr: 'المقبلات',
            menuId: '1',
            items: [
              {
                id: '1',
                name: 'Caesar Salad',
                nameAr: 'سلطة سيزر',
                description: 'Fresh romaine lettuce with parmesan and croutons',
                descriptionAr: 'خس روماني طازج مع البارميزان والخبز المحمص',
                price: 12.99,
                categoryId: '1',
                ingredients: ['Romaine Lettuce', 'Parmesan Cheese', 'Croutons', 'Caesar Dressing', 'Lemon'],
                ingredientsAr: ['خس روماني', 'جبن بارميزان', 'خبز محمص', 'صلصة سيزر', 'ليمون'],
                allergens: ['Dairy', 'Gluten', 'Eggs'],
                allergensAr: ['منتجات الألبان', 'الغلوتين', 'البيض'],
                dietaryTags: ['vegetarian'],
                prepTime: 10,
                calories: 350,
                sizes: [
                  { name: 'Small', nameAr: 'صغير', price: 9.99 },
                  { name: 'Regular', nameAr: 'عادي', price: 12.99 },
                  { name: 'Large', nameAr: 'كبير', price: 15.99 },
                ],
                options: [
                  { id: 'opt1', name: 'Add Grilled Chicken', nameAr: 'إضافة دجاج مشوي', price: 5.0 },
                  { id: 'opt2', name: 'Add Shrimp', nameAr: 'إضافة جمبري', price: 7.0 },
                  { id: 'opt3', name: 'Extra Parmesan', nameAr: 'بارميزان إضافي', price: 2.0 },
                ],
              },
              {
                id: '2',
                name: 'Bruschetta',
                nameAr: 'بروشيتا',
                description: 'Toasted bread with tomatoes and basil',
                descriptionAr: 'خبز محمص مع الطماطم والريحان',
                price: 9.99,
                categoryId: '1',
                ingredients: ['Sourdough Bread', 'Tomatoes', 'Fresh Basil', 'Garlic', 'Olive Oil', 'Balsamic Glaze'],
                ingredientsAr: ['خبز العجين المخمر', 'طماطم', 'ريحان طازج', 'ثوم', 'زيت زيتون', 'صلصة بلسمك'],
                allergens: ['Gluten'],
                allergensAr: ['الغلوتين'],
                dietaryTags: ['vegan', 'dairy-free'],
                prepTime: 8,
                calories: 220,
              },
              {
                id: '6',
                name: 'Buffalo Wings',
                nameAr: 'أجنحة بافلو',
                description: 'Crispy chicken wings tossed in spicy buffalo sauce',
                descriptionAr: 'أجنحة دجاج مقرمشة بصلصة بافلو الحارة',
                price: 14.99,
                categoryId: '1',
                ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Butter', 'Celery', 'Blue Cheese Dip'],
                ingredientsAr: ['أجنحة دجاج', 'صلصة بافلو', 'زبدة', 'كرفس', 'صلصة الجبنة الزرقاء'],
                allergens: ['Dairy'],
                allergensAr: ['منتجات الألبان'],
                spiceLevel: 4,
                prepTime: 20,
                calories: 580,
                sizes: [
                  { name: '6 pieces', nameAr: '6 قطع', price: 14.99 },
                  { name: '12 pieces', nameAr: '12 قطعة', price: 24.99 },
                  { name: '18 pieces', nameAr: '18 قطعة', price: 32.99 },
                ],
                options: [
                  { id: 'opt4', name: 'Mild Sauce', nameAr: 'صلصة خفيفة', price: 0 },
                  { id: 'opt5', name: 'Extra Hot', nameAr: 'حار جداً', price: 0 },
                  { id: 'opt6', name: 'Ranch Dip', nameAr: 'صلصة رانش', price: 1.5 },
                ],
              },
            ],
          },
          {
            id: '2',
            name: 'Main Courses',
            nameAr: 'الأطباق الرئيسية',
            menuId: '1',
            items: [
              {
                id: '3',
                name: 'Grilled Salmon',
                nameAr: 'سلمون مشوي',
                description: 'Fresh Atlantic salmon with herbs and lemon butter sauce',
                descriptionAr: 'سلمون أطلسي طازج مع الأعشاب وصلصة الزبدة بالليمون',
                price: 24.99,
                categoryId: '2',
                ingredients: ['Atlantic Salmon', 'Lemon', 'Butter', 'Dill', 'Garlic', 'Asparagus', 'Mashed Potatoes'],
                ingredientsAr: ['سلمون أطلسي', 'ليمون', 'زبدة', 'شبت', 'ثوم', 'هليون', 'بطاطس مهروسة'],
                allergens: ['Fish', 'Dairy'],
                allergensAr: ['سمك', 'منتجات الألبان'],
                dietaryTags: ['gluten-free'],
                prepTime: 25,
                calories: 520,
              },
              {
                id: '4',
                name: 'Ribeye Steak',
                nameAr: 'ستيك ريب آي',
                description: 'Premium beef steak cooked to perfection with seasonal vegetables',
                descriptionAr: 'ستيك لحم بقري ممتاز مطبوخ بإتقان مع خضروات موسمية',
                price: 32.99,
                categoryId: '2',
                ingredients: ['Ribeye Beef', 'Sea Salt', 'Black Pepper', 'Rosemary', 'Grilled Vegetables', 'Garlic Butter'],
                ingredientsAr: ['لحم ريب آي', 'ملح البحر', 'فلفل أسود', 'إكليل الجبل', 'خضروات مشوية', 'زبدة بالثوم'],
                allergens: ['Dairy'],
                allergensAr: ['منتجات الألبان'],
                dietaryTags: ['gluten-free'],
                prepTime: 30,
                calories: 780,
                sizes: [
                  { name: '8 oz', nameAr: '8 أونصة', price: 28.99 },
                  { name: '12 oz', nameAr: '12 أونصة', price: 32.99 },
                  { name: '16 oz', nameAr: '16 أونصة', price: 42.99 },
                ],
                options: [
                  { id: 'opt7', name: 'Peppercorn Sauce', nameAr: 'صلصة الفلفل', price: 3.0 },
                  { id: 'opt8', name: 'Mushroom Sauce', nameAr: 'صلصة الفطر', price: 3.0 },
                  { id: 'opt9', name: 'Add Lobster Tail', nameAr: 'إضافة ذيل جراد البحر', price: 15.0 },
                ],
              },
              {
                id: '7',
                name: 'Margherita Pizza',
                nameAr: 'بيتزا مارغريتا',
                description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
                descriptionAr: 'بيتزا إيطالية كلاسيكية مع موزاريلا طازجة وطماطم وريحان',
                price: 16.99,
                categoryId: '2',
                ingredients: ['Pizza Dough', 'Tomato Sauce', 'Fresh Mozzarella', 'Basil', 'Olive Oil', 'Oregano'],
                ingredientsAr: ['عجينة بيتزا', 'صلصة طماطم', 'موزاريلا طازجة', 'ريحان', 'زيت زيتون', 'أوريجانو'],
                allergens: ['Gluten', 'Dairy'],
                allergensAr: ['الغلوتين', 'منتجات الألبان'],
                dietaryTags: ['vegetarian'],
                prepTime: 18,
                calories: 650,
                sizes: [
                  { name: 'Personal (10")', nameAr: 'شخصية (10 بوصة)', price: 12.99 },
                  { name: 'Medium (14")', nameAr: 'وسط (14 بوصة)', price: 16.99 },
                  { name: 'Large (18")', nameAr: 'كبيرة (18 بوصة)', price: 22.99 },
                ],
                options: [
                  { id: 'opt10', name: 'Extra Cheese', nameAr: 'جبنة إضافية', price: 2.5 },
                  { id: 'opt11', name: 'Add Pepperoni', nameAr: 'إضافة ببروني', price: 3.0 },
                  { id: 'opt12', name: 'Add Mushrooms', nameAr: 'إضافة فطر', price: 2.0 },
                ],
              },
              {
                id: '8',
                name: 'Pad Thai',
                nameAr: 'باد تاي',
                description: 'Traditional Thai stir-fried noodles with shrimp, peanuts, and tamarind sauce',
                descriptionAr: 'نودلز تايلندية تقليدية مقلية مع جمبري وفول سوداني وصلصة التمر الهندي',
                price: 18.99,
                categoryId: '2',
                ingredients: ['Rice Noodles', 'Shrimp', 'Eggs', 'Bean Sprouts', 'Peanuts', 'Tamarind Sauce', 'Lime'],
                ingredientsAr: ['نودلز الأرز', 'جمبري', 'بيض', 'براعم الفاصوليا', 'فول سوداني', 'صلصة التمر الهندي', 'ليمون'],
                allergens: ['Shellfish', 'Peanuts', 'Eggs'],
                allergensAr: ['محار', 'فول سوداني', 'بيض'],
                spiceLevel: 2,
                prepTime: 15,
                calories: 590,
                options: [
                  { id: 'opt13', name: 'Chicken instead of Shrimp', nameAr: 'دجاج بدلاً من الجمبري', price: 0 },
                  { id: 'opt14', name: 'Tofu (Vegan)', nameAr: 'توفو (نباتي)', price: 0 },
                  { id: 'opt15', name: 'Extra Spicy', nameAr: 'حار جداً', price: 0 },
                ],
              },
            ],
          },
        ],
      },
    ];

    // Mock Complaints
    this.complaints = [
      {
        id: '1',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'The food was cold when it arrived',
        status: 'pending',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Food Quality',
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        message: 'Excellent service, very satisfied!',
        status: 'resolved',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'General',
      },
      {
        id: '3',
        customerName: 'Ahmed Ali',
        email: 'ahmed@example.com',
        phone: '+1234567892',
        message: 'Waiting time was too long',
        status: 'in-progress',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Service',
      },
    ];
  }
}

export default RootStore;



export const rootStore = new RootStore();

