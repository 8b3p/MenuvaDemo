# E-Menu SaaS Prototype - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager

### Installation

1. **Extract the project** (if you received a tarball):
   ```bash
   tar -xzf emenu-saas-prototype-complete.tar.gz
   cd emenu-saas-prototype
   ```

2. **Navigate to the client directory**:
   ```bash
   cd client
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   pnpm install
   ```

4. **Start the development server**:
   ```bash
   pnpm run dev
   ```

5. **Open your browser**:
   - Navigate to: **http://localhost:3001**
   - Or the port shown in the terminal

---

## 🔐 Login

The prototype accepts **any credentials** for demonstration purposes:

- **Email**: `test@test.com` (or any email)
- **Password**: `password` (or any password)

---

## 📱 Viewing Menu Templates

### Admin Dashboard
After logging in, you'll see the admin dashboard with:
- Total Orders, Revenue, Active Customers, Average Rating
- Recent Activity feed
- Top Selling Items

### Menu Templates
Access the templates in two ways:

#### Option 1: Through Templates Page
1. Click **Templates** in the sidebar
2. Click **Preview** on any template
3. Click **Open Menu** to view the full template

#### Option 2: Direct URLs
- **Classic Menu**: http://localhost:3001/menu/classic
- **Modern Grid**: http://localhost:3001/menu/modern
- **Minimalist**: http://localhost:3001/menu/minimalist
- **Colorful Cards**: http://localhost:3001/menu/colorful

---

## 🎨 Template Styles

### 1. Classic Menu
- **Style**: Traditional fine dining, dark elegant design
- **Best For**: Upscale restaurants, formal dining
- **Features**: Serif fonts, dedicated item pages, sophisticated layout

### 2. Modern Grid
- **Style**: Instagram-inspired grid layout with vibrant gradients
- **Best For**: Trendy cafes, modern restaurants
- **Features**: Photo-forward cards, bottom sheet details, colorful design

### 3. Minimalist
- **Style**: Ultra-clean Scandinavian design
- **Best For**: High-end establishments, zen-like cafes
- **Features**: Maximum whitespace, inline expansion, distraction-free

### 4. Colorful Cards
- **Style**: Playful pastel card design
- **Best For**: Casual dining, family restaurants
- **Features**: Blurred backgrounds, colorful cards, friendly aesthetic

---

## 📊 Menu Content

### Current Menu: "Main Menu"
- **Total Items**: 45
- **Categories**: 4

#### Category Breakdown:
- **Appetizers** (10 items): Caesar Salad, Bruschetta, Buffalo Wings, Greek Salad, Garlic Bread, Calamari Fritti, Spinach Artichoke Dip, Mozzarella Sticks, Nachos Supreme, Spring Rolls

- **Main Courses** (15 items): Grilled Salmon, Ribeye Steak, Margherita Pizza, Pad Thai, Chicken Alfredo, Beef Burger, Lamb Chops, Seafood Paella, BBQ Ribs, Vegetable Stir Fry, Chicken Tikka Masala, Fish and Chips, Mushroom Risotto, Beef Tacos, Sushi Platter

- **Desserts** (8 items): Chocolate Lava Cake, Tiramisu, Cheesecake, Ice Cream Sundae, Crème Brûlée, Apple Pie, Panna Cotta, Brownie Sundae

- **Beverages** (12 items): Fresh Orange Juice, Iced Coffee, Mojito, Lemonade, Cappuccino, Green Tea, Mango Smoothie, Espresso, Strawberry Milkshake, Iced Matcha Latte, Hot Chocolate, Sparkling Water

---

## 🎯 Key Features to Demonstrate

### 1. Template Variety
- Show all 4 templates to demonstrate design flexibility
- Each template has a unique visual identity
- All templates work with the same data

### 2. Rich Item Details
- Click on any menu item to see:
  - Full description
  - Ingredients list
  - Allergen information
  - Dietary tags (vegan, vegetarian, gluten-free, dairy-free)
  - Size options with pricing
  - Preparation time
  - Calorie information
  - Spice level (for applicable items)

### 3. Category Navigation
- Smooth scrolling between categories
- Category indicators/tabs
- Easy navigation on mobile

### 4. Customer Complaints
- Complaint button on each template
- Submit feedback directly from menu
- Admin can view/manage complaints in dashboard

### 5. Bilingual Support
- Language switcher in admin dashboard
- English and Arabic support
- RTL layout for Arabic

### 6. Admin Management
- **Dashboard**: Metrics and analytics
- **Menus**: View all items and categories
- **Templates**: Preview and manage templates
- **Complaints**: View and respond to customer feedback

---

## 📱 Mobile Testing

All templates are **mobile-first** and optimized for phone screens:

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 12 Pro)
4. Navigate to any menu template
5. Test scrolling, category navigation, and item details

---

## 🎬 Demo Script

### For Investors/Clients (5-minute demo):

1. **Login** (10 seconds)
   - Show the clean login interface
   - Enter any credentials

2. **Dashboard** (30 seconds)
   - Highlight key metrics
   - Show recent activity
   - Point out top-selling items

3. **Templates Page** (30 seconds)
   - Show 4 template options
   - Explain customization possibilities

4. **Template Demos** (3 minutes)
   - **Classic Menu**: Traditional elegance
   - **Modern Grid**: Instagram-style visual appeal
   - **Minimalist**: High-end simplicity
   - **Colorful Cards**: Friendly and approachable
   - Click on items to show detailed information

5. **Menus Management** (30 seconds)
   - Show Items tab with all 45 items
   - Show Categories organization
   - Explain global pool architecture

6. **Mobile Demo** (30 seconds)
   - Switch to mobile view
   - Show responsive design
   - Test touch interactions

7. **Q&A** (remaining time)

---

## 🔧 Troubleshooting

### Port Already in Use
If port 3001 is in use, Vite will automatically try another port. Check the terminal output for the actual port.

### Dependencies Not Installed
```bash
cd client
pnpm install
```

### Development Server Not Starting
1. Check Node.js version: `node --version` (should be 22.x)
2. Check pnpm installation: `pnpm --version`
3. Clear cache and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

### Templates Not Loading
1. Check browser console for errors (F12)
2. Ensure you're logged in
3. Try refreshing the page (Ctrl+R)

---

## 📞 Support

For questions or issues, refer to:
- **PROJECT_STATUS.md**: Complete project overview and technical details
- **README.md**: Original project documentation

---

## ✅ Checklist Before Demo

- [ ] Development server is running
- [ ] Can login successfully
- [ ] Dashboard loads correctly
- [ ] All 4 templates are accessible
- [ ] Items display correctly in templates
- [ ] Item details open when clicked
- [ ] Category navigation works
- [ ] Mobile view is responsive
- [ ] No console errors

---

**Ready to impress!** 🚀

The E-Menu SaaS prototype is fully functional and ready for demonstration. All features work as expected, and the application showcases a professional, production-ready digital menu solution.

