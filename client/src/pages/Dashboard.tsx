import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, MessageSquare, Star, FileText, UtensilsCrossed, Salad, Cake, Coffee, Search, Clock, Globe, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import { visitorData, searchTerms, peakTimes, languageStats, aggregateVisitorsByPeriod } from '@/data/analytics';
import { Button } from '@/components/ui/button';

const Dashboard = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('week');

  const stats = [
    {
      title: isArabic ? 'زوار اليوم' : "Today's Visitors",
      value: '342',
      change: '+18.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: isArabic ? 'متوسط التقييم' : 'Average Rating',
      value: '4.8',
      change: '+0.3',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  const topVisitedItems = [
    { name: isArabic ? 'ستيك ريب آي' : 'Ribeye Steak', views: 245, percentage: '18%' },
    { name: isArabic ? 'سلمون مشوي' : 'Grilled Salmon', views: 198, percentage: '15%' },
    { name: isArabic ? 'سلطة سيزر' : 'Caesar Salad', views: 167, percentage: '12%' },
    { name: isArabic ? 'بروشيتا' : 'Bruschetta', views: 134, percentage: '10%' },
    { name: isArabic ? 'بيتزا مارغريتا' : 'Margherita Pizza', views: 121, percentage: '9%' },
  ];

  const topVisitedCategories = [
    { name: isArabic ? 'الأطباق الرئيسية' : 'Main Courses', views: 1245, icon: UtensilsCrossed, color: 'from-orange-500 to-red-600' },
    { name: isArabic ? 'المقبلات' : 'Appetizers', views: 892, icon: Salad, color: 'from-green-500 to-emerald-600' },
    { name: isArabic ? 'الحلويات' : 'Desserts', views: 678, icon: Cake, color: 'from-pink-500 to-rose-600' },
    { name: isArabic ? 'المشروبات' : 'Beverages', views: 534, icon: Coffee, color: 'from-amber-500 to-yellow-600' },
  ];

  const chartData = aggregateVisitorsByPeriod(visitorData, timePeriod);
  
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ArrowUp className="w-3 h-3 text-green-600 dark:text-green-400" />;
    if (trend === 'down') return <ArrowDown className="w-3 h-3 text-red-600 dark:text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />;
  };

  const getIntensityColor = (intensity: 'low' | 'medium' | 'high') => {
    if (intensity === 'high') return 'from-red-500 to-orange-600';
    if (intensity === 'medium') return 'from-yellow-500 to-amber-600';
    return 'from-blue-500 to-cyan-600';
  };

  const pieChartData = languageStats.map((stat) => ({
    name: isArabic ? stat.nameAr : stat.name,
    value: stat.count,
    percentage: stat.percentage,
  }));

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="space-y-4">
      {/* Top Row: Stats and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stats Cards */}
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Time-based Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5" />
                {isArabic ? 'اتجاهات الزوار' : 'Visitor Trends'}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={timePeriod === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('day')}
                  className="h-8 text-xs"
                >
                  {isArabic ? '7 أيام' : '7 Days'}
                </Button>
                <Button
                  variant={timePeriod === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('week')}
                  className="h-8 text-xs"
                >
                  {isArabic ? '4 أسابيع' : '4 Weeks'}
                </Button>
                <Button
                  variant={timePeriod === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('month')}
                  className="h-8 text-xs"
                >
                  {isArabic ? '30 يوم' : '30 Days'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="label" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Grid - Search Terms, Peak Times, Language Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="w-5 h-5" />
                {isArabic ? 'أهم البحث' : 'Top Searches'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchTerms.slice(0, 6).map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {isArabic ? term.termAr : term.term}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getTrendIcon(term.trend)}
                      <span className="text-sm font-semibold text-muted-foreground">
                        {term.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Peak Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-5 h-5" />
                {isArabic ? 'أوقات الذروة' : 'Peak Hours'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakTimes}>
                    <XAxis 
                      dataKey={isArabic ? 'labelAr' : 'label'} 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={1}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-5 h-5" />
                {isArabic ? 'تفضيلات اللغة' : 'Language Preferences'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[240px]">
                <div className="w-full max-w-[200px]">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {languageStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {isArabic ? stat.nameAr : stat.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">
                          {stat.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Visited Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5" />
                {isArabic ? 'الأصناف الأكثر زيارة' : 'Top Visited Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topVisitedItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.views} {isArabic ? 'مشاهدة' : 'views'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {item.percentage}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Visited Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="w-5 h-5" />
                {isArabic ? 'الفئات الأكثر زيارة' : 'Top Visited Categories'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topVisitedCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + index * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {category.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {category.views}
                        </p>
                        <p className="text-xs text-muted-foreground">{isArabic ? 'مشاهدة' : 'views'}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'القوائم' : 'Menus'}</p>
                  <p className="text-2xl font-bold">{store.menus.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'الأصناف' : 'Items'}</p>
                  <p className="text-2xl font-bold">{store.items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'تم الحل' : 'Resolved'}</p>
                  <p className="text-2xl font-bold">{store.complaints.filter((c) => c.status === 'resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isArabic ? 'الفئات' : 'Categories'}</p>
                  <p className="text-2xl font-bold">{store.categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
});

export default Dashboard;

