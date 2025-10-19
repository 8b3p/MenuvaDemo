import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, MessageSquare, DollarSign, Star } from 'lucide-react';

const Dashboard = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';

  const stats = [
    {
      title: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
      value: '1,234',
      change: '+12.5%',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: isArabic ? 'الإيرادات' : 'Revenue',
      value: '$45,678',
      change: '+8.2%',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
    },
    {
      title: isArabic ? 'العملاء النشطون' : 'Active Customers',
      value: '892',
      change: '+15.3%',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: isArabic ? 'متوسط التقييم' : 'Avg Rating',
      value: '4.8',
      change: '+0.3',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'order',
      message: isArabic ? 'طلب جديد من الطاولة #12' : 'New order from Table #12',
      time: isArabic ? 'منذ 5 دقائق' : '5 minutes ago',
    },
    {
      id: 2,
      type: 'complaint',
      message: isArabic ? 'شكوى جديدة تم استلامها' : 'New complaint received',
      time: isArabic ? 'منذ 15 دقيقة' : '15 minutes ago',
    },
    {
      id: 3,
      type: 'menu',
      message: isArabic ? 'تم تحديث عنصر القائمة "سلمون مشوي"' : 'Menu item "Grilled Salmon" updated',
      time: isArabic ? 'منذ ساعة واحدة' : '1 hour ago',
    },
    {
      id: 4,
      type: 'order',
      message: isArabic ? 'طلب من الطاولة #8 تم إكماله' : 'Order from Table #8 completed',
      time: isArabic ? 'منذ ساعتين' : '2 hours ago',
    },
  ];

  const topItems = [
    { name: isArabic ? 'ستيك ريب آي' : 'Ribeye Steak', orders: 145, revenue: '$4,785' },
    { name: isArabic ? 'سلمون مشوي' : 'Grilled Salmon', orders: 132, revenue: '$3,299' },
    { name: isArabic ? 'سلطة سيزر' : 'Caesar Salad', orders: 98, revenue: '$1,273' },
    { name: isArabic ? 'بروشيتا' : 'Bruschetta', orders: 87, revenue: '$869' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </h3>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + activity.id * 0.05 }}
                    className="flex items-start gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'order'
                        ? 'bg-blue-500'
                        : activity.type === 'complaint'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Selling Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                {isArabic ? 'الأصناف الأكثر مبيعاً' : 'Top Selling Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {topItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.orders} {isArabic ? 'طلب' : 'orders'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400 flex-shrink-0">
                      {item.revenue}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">
                {isArabic ? 'إجمالي القوائم' : 'Total Menus'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {store.menus.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {isArabic ? 'قوائم نشطة' : 'Active menus'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">
                {isArabic ? 'إجمالي الأصناف' : 'Total Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {store.menus.reduce(
                  (acc, menu) =>
                    acc + menu.categories.reduce((catAcc: any, cat: any) => catAcc + cat.items.length, 0),
                  0
                )}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {isArabic ? 'عبر جميع القوائم' : 'Across all menus'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">
                {isArabic ? 'الشكاوى المعلقة' : 'Pending Complaints'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {store.complaints.filter((c) => c.status === 'pending').length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {isArabic ? 'تتطلب الاهتمام' : 'Require attention'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
});

export default Dashboard;

