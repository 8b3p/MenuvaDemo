import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Mail, Phone, Calendar, Tag, Eye } from 'lucide-react';
import type { Complaint } from '@/stores/RootStore';

const Complaints = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  // Category translation mapping
  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: { en: string; ar: string } } = {
      'Food Quality': { en: 'Food Quality', ar: 'جودة الطعام' },
      'Service': { en: 'Service', ar: 'الخدمة' },
      'Compliment': { en: 'Compliment', ar: 'إطراء' },
      'Delivery': { en: 'Delivery', ar: 'التوصيل' },
      'Pricing': { en: 'Pricing', ar: 'التسعير' },
      'Hygiene': { en: 'Hygiene', ar: 'النظافة' },
      'Staff': { en: 'Staff', ar: 'الموظفين' },
      'Other': { en: 'Other', ar: 'أخرى' },
    };

    return isArabic ? (categoryMap[category]?.ar || category) : (categoryMap[category]?.en || category);
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(store.complaints.map((c) => c.category));
    return Array.from(cats);
  }, [store.complaints]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return store.complaints.filter((complaint) => {
      const matchesSearch =
        complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [store.complaints, searchQuery, statusFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
            {isArabic ? 'معلق' : 'Pending'}
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            {isArabic ? 'قيد المعالجة' : 'In Progress'}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            {isArabic ? 'تم الحل' : 'Resolved'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDetailsDialog(true);
  };

  const handleStatusChange = (complaintId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    store.updateComplaint(complaintId, { status: newStatus });
  };

  const stats = {
    total: store.complaints.length,
    pending: store.complaints.filter((c) => c.status === 'pending').length,
    inProgress: store.complaints.filter((c) => c.status === 'in-progress').length,
    resolved: store.complaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="mb-2 block">
                {isArabic ? 'بحث' : 'Search'}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={isArabic ? 'ابحث عن الشكاوى...' : 'Search complaints...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter" className="mb-2 block">
                {isArabic ? 'الحالة' : 'Status'}
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
                  <SelectItem value="pending">{isArabic ? 'معلق' : 'Pending'}</SelectItem>
                  <SelectItem value="in-progress">
                    {isArabic ? 'قيد المعالجة' : 'In Progress'}
                  </SelectItem>
                  <SelectItem value="resolved">{isArabic ? 'تم الحل' : 'Resolved'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter" className="mb-2 block">
                {isArabic ? 'الفئة' : 'Category'}
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryName(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Compact Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm text-muted-foreground">
            <span>{isArabic ? 'الإجمالي:' : 'Total:'} <strong className="text-foreground">{stats.total}</strong></span>
            <span>{isArabic ? 'معلقة:' : 'Pending:'} <strong className="text-yellow-600">{stats.pending}</strong></span>
            <span>{isArabic ? 'قيد المعالجة:' : 'In Progress:'} <strong className="text-blue-600">{stats.inProgress}</strong></span>
            <span>{isArabic ? 'تم الحل:' : 'Resolved:'} <strong className="text-green-600">{stats.resolved}</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isArabic ? 'لم يتم العثور على شكاوى' : 'No complaints found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                        {complaint.customerName}
                      </h3>
                      {getStatusBadge(complaint.status)}
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Tag className="w-3 h-3" />
                        {getCategoryName(complaint.category)}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                      {complaint.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{complaint.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(complaint.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(complaint)}
                      className="h-8 px-3"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {isArabic ? 'عرض' : 'View'}
                    </Button>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) =>
                        handleStatusChange(complaint.id, value as 'pending' | 'in-progress' | 'resolved')
                      }
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{isArabic ? 'معلق' : 'Pending'}</SelectItem>
                        <SelectItem value="in-progress">
                          {isArabic ? 'قيد المعالجة' : 'In Progress'}
                        </SelectItem>
                        <SelectItem value="resolved">{isArabic ? 'تم الحل' : 'Resolved'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'تفاصيل الشكوى' : 'Complaint Details'}</DialogTitle>
            <DialogDescription>
              {isArabic ? 'معلومات كاملة عن الشكوى' : 'Full information about the complaint'}
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {isArabic ? 'اسم العميل' : 'Customer Name'}
                  </Label>
                  <p className="text-base mt-1">{selectedComplaint.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {isArabic ? 'الحالة' : 'Status'}
                  </Label>
                  <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <p className="text-base mt-1">{selectedComplaint.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {isArabic ? 'الهاتف' : 'Phone'}
                  </Label>
                  <p className="text-base mt-1">{selectedComplaint.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {isArabic ? 'الفئة' : 'Category'}
                  </Label>
                  <p className="text-base mt-1">{getCategoryName(selectedComplaint.category)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {isArabic ? 'التاريخ' : 'Date'}
                  </Label>
                  <p className="text-base mt-1">{formatDate(selectedComplaint.date)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-muted-foreground">
                  {isArabic ? 'الرسالة' : 'Message'}
                </Label>
                <p className="text-base mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {selectedComplaint.message}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                  {isArabic ? 'تحديث الحالة' : 'Update Status'}
                </Label>
                <Select
                  value={selectedComplaint.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedComplaint.id, value as 'pending' | 'in-progress' | 'resolved');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{isArabic ? 'معلق' : 'Pending'}</SelectItem>
                    <SelectItem value="in-progress">
                      {isArabic ? 'قيد المعالجة' : 'In Progress'}
                    </SelectItem>
                    <SelectItem value="resolved">{isArabic ? 'تم الحل' : 'Resolved'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Complaints;

