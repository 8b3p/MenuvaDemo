import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/contexts/StoreContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check, Upload, Palette, Eye, QrCode, ExternalLink } from 'lucide-react';
import type { Template } from '@/stores/RootStore';
import { QRCodeSVG } from 'qrcode.react';

const Templates = observer(() => {
  const store = useStore();
  const isArabic = store.language === 'ar';

  const [customizeDialog, setCustomizeDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);

  const handleCustomize = (template: Template) => {
    setSelectedTemplate(template);
    setCustomizeDialog(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        store.updateTemplateCustomization({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActivateTemplate = () => {
    if (selectedTemplate) {
      store.setActiveTemplate(selectedTemplate.id);
      setCustomizeDialog(false);
    }
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {isArabic ? 'قوالب القائمة' : 'Menu Templates'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? 'اختر قالباً وخصصه ليتناسب مع علامتك التجارية'
              : 'Choose a template and customize it to match your brand'}
          </p>
        </div>
      </div>

      {/* Active Template Info */}
      {store.activeTemplateId && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  {isArabic ? 'القالب النشط' : 'Active Template'}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {store.templates.find((t) => t.id === store.activeTemplateId)?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {store.templates.map((template) => {
          const isActive = store.activeTemplateId === template.id;
          return (
            <Card
              key={template.id}
              className={`hover:shadow-lg transition-all ${
                isActive ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
              }`}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {isActive && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {isArabic ? 'نشط' : 'Active'}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(template)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isArabic ? 'معاينة' : 'Preview'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCustomize(template)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {isArabic ? 'تخصيص' : 'Customize'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customize Dialog */}
      <Dialog open={customizeDialog} onOpenChange={setCustomizeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isArabic ? 'تخصيص القالب' : 'Customize Template'}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? 'قم بتحميل شعارك واختر ألوان السمة الخاصة بك'
                : 'Upload your logo and choose your theme colors'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                {isArabic ? 'الشعار' : 'Logo'}
              </Label>
              <div className="flex items-center gap-4">
                {store.templateCustomization.logo && (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                    <img
                      src={store.templateCustomization.logo}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {isArabic ? 'تحميل الشعار' : 'Upload Logo'}
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {isArabic
                      ? 'PNG أو JPG أو SVG (الحد الأقصى 2 ميجابايت)'
                      : 'PNG, JPG or SVG (max 2MB)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color" className="text-base font-semibold mb-3 block">
                  {isArabic ? 'اللون الأساسي' : 'Primary Color'}
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="primary-color"
                    type="color"
                    value={store.templateCustomization.primaryColor}
                    onChange={(e) =>
                      store.updateTemplateCustomization({ primaryColor: e.target.value })
                    }
                    className="w-20 h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={store.templateCustomization.primaryColor}
                    onChange={(e) =>
                      store.updateTemplateCustomization({ primaryColor: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary-color" className="text-base font-semibold mb-3 block">
                  {isArabic ? 'اللون الثانوي' : 'Secondary Color'}
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={store.templateCustomization.secondaryColor}
                    onChange={(e) =>
                      store.updateTemplateCustomization({ secondaryColor: e.target.value })
                    }
                    className="w-20 h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={store.templateCustomization.secondaryColor}
                    onChange={(e) =>
                      store.updateTemplateCustomization({ secondaryColor: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                {isArabic ? 'معاينة' : 'Preview'}
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <div className="flex items-center gap-4 mb-4">
                  {store.templateCustomization.logo && (
                    <img
                      src={store.templateCustomization.logo}
                      alt="Logo Preview"
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <h3
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: store.templateCustomization.primaryColor }}
                  >
                    {isArabic ? 'اسم المطعم' : 'Restaurant Name'}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <div
                    className="px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: store.templateCustomization.primaryColor }}
                  >
                    {isArabic ? 'زر أساسي' : 'Primary Button'}
                  </div>
                  <div
                    className="px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: store.templateCustomization.secondaryColor }}
                  >
                    {isArabic ? 'زر ثانوي' : 'Secondary Button'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomizeDialog(false)}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={handleActivateTemplate}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Check className="w-4 h-4 mr-2" />
              {isArabic ? 'تفعيل القالب' : 'Activate Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template Preview */}
            <div className="aspect-video rounded-lg overflow-hidden border">
              <img
                src={selectedTemplate?.thumbnail}
                alt={selectedTemplate?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* QR Code and Link */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-center mb-2">
                <h4 className="font-semibold text-lg mb-1">
                  {isArabic ? 'رمز الاستجابة السريعة للقائمة' : 'Menu QR Code'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'امسح للعرض على الهاتف المحمول' : 'Scan to view on mobile'}
                </p>
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCodeSVG
                  value={`${window.location.origin}/menu/${selectedTemplate?.id === '1' ? 'classic' : selectedTemplate?.id === '2' ? 'modern' : selectedTemplate?.id === '3' ? 'minimalist' : 'classic'}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              {/* Direct Link */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const menuPath = selectedTemplate?.id === '1' ? 'classic' : selectedTemplate?.id === '2' ? 'modern' : selectedTemplate?.id === '3' ? 'minimalist' : 'classic';
                  window.open(`/menu/${menuPath}`, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isArabic ? 'فتح القائمة' : 'Open Menu'}
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialog(false)}>
              {isArabic ? 'إغلاق' : 'Close'}
            </Button>
            <Button
              onClick={() => {
                setPreviewDialog(false);
                if (selectedTemplate) handleCustomize(selectedTemplate);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              {isArabic ? 'تخصيص هذا القالب' : 'Customize This Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Templates;

