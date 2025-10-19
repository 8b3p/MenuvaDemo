import { makeAutoObservable } from 'mobx';

// Types
export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  categoryId: string;
  image?: string;
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
        thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        description: 'A traditional menu layout with elegant typography',
      },
      {
        id: '2',
        name: 'Modern Grid',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
        description: 'Contemporary grid-based design with large images',
      },
      {
        id: '3',
        name: 'Minimalist',
        thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
        description: 'Clean and simple design focusing on content',
      },
    ];

    // Mock Menus
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
              },
              {
                id: '2',
                name: 'Bruschetta',
                nameAr: 'بروشيتا',
                description: 'Toasted bread with tomatoes and basil',
                descriptionAr: 'خبز محمص مع الطماطم والريحان',
                price: 9.99,
                categoryId: '1',
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
                description: 'Fresh Atlantic salmon with herbs',
                descriptionAr: 'سلمون أطلسي طازج مع الأعشاب',
                price: 24.99,
                categoryId: '2',
              },
              {
                id: '4',
                name: 'Ribeye Steak',
                nameAr: 'ستيك ريب آي',
                description: 'Premium beef steak cooked to perfection',
                descriptionAr: 'ستيك لحم بقري ممتاز مطبوخ بإتقان',
                price: 32.99,
                categoryId: '2',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'Drinks Menu',
        nameAr: 'قائمة المشروبات',
        categories: [
          {
            id: '3',
            name: 'Hot Beverages',
            nameAr: 'المشروبات الساخنة',
            menuId: '2',
            items: [
              {
                id: '5',
                name: 'Espresso',
                nameAr: 'إسبريسو',
                description: 'Strong Italian coffee',
                descriptionAr: 'قهوة إيطالية قوية',
                price: 4.99,
                categoryId: '3',
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
        customerName: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'The food was cold when it arrived at our table.',
        status: 'pending',
        date: '2025-10-18T14:30:00Z',
        category: 'Food Quality',
      },
      {
        id: '2',
        customerName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567891',
        message: 'Service was slow, waited 45 minutes for our order.',
        status: 'in-progress',
        date: '2025-10-18T12:15:00Z',
        category: 'Service',
      },
      {
        id: '3',
        customerName: 'Mike Brown',
        email: 'mike@example.com',
        phone: '+1234567892',
        message: 'Great food but the restaurant was too noisy.',
        status: 'resolved',
        date: '2025-10-17T19:45:00Z',
        category: 'Ambiance',
      },
      {
        id: '4',
        customerName: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1234567893',
        message: 'Found a hair in my salad. Very disappointed.',
        status: 'pending',
        date: '2025-10-17T18:20:00Z',
        category: 'Food Quality',
      },
      {
        id: '5',
        customerName: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        phone: '+1234567894',
        message: 'The bill was incorrect, charged twice for dessert.',
        status: 'resolved',
        date: '2025-10-16T20:10:00Z',
        category: 'Billing',
      },
    ];
  }
}

export const rootStore = new RootStore();

