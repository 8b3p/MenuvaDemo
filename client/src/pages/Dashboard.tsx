import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'order'
                      ? 'bg-blue-500'
                      : activity.type === 'complaint'
                      ? 'bg-red-500'
                      : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isArabic ? 'الأصناف الأكثر مبيعاً' : 'Top Selling Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.orders} {isArabic ? 'طلب' : 'orders'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {item.revenue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isArabic ? 'إجمالي القوائم' : 'Total Menus'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {store.menus.length}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {isArabic ? 'قوائم نشطة' : 'Active menus'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isArabic ? 'إجمالي الأصناف' : 'Total Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {store.menus.reduce(
                (acc, menu) =>
                  acc + menu.categories.reduce((catAcc, cat) => catAcc + cat.items.length, 0),
                0
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {isArabic ? 'عبر جميع القوائم' : 'Across all menus'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isArabic ? 'الشكاوى المعلقة' : 'Pending Complaints'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {store.complaints.filter((c) => c.status === 'pending').length}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {isArabic ? 'تتطلب الاهتمام' : 'Require attention'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default Dashboard;

