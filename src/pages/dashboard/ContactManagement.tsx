import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Edit, Trash2, Plus, Save, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContactInfo {
  id: string;
  type: "email" | "phone" | "social" | "address";
  label: string;
  value: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select";
  placeholder: string;
  isRequired: boolean;
  isVisible: boolean;
  order: number;
  options?: string[];
}

// مفتاح التخزين
const CONTACT_STORAGE_KEY = 'mariam_bassitman_contact';

// البيانات الافتراضية
const initialContactInfo: ContactInfo[] = [
  {
    id: "1",
    type: "email",
    label: "البريد الإلكتروني",
    value: "mariam@example.com",
    icon: "📧",
    isVisible: true,
    order: 1
  },
  {
    id: "2",
    type: "social",
    label: "LinkedIn",
    value: "https://linkedin.com/in/mariam",
    icon: "💼",
    isVisible: true,
    order: 2
  },
  {
    id: "3",
    type: "social",
    label: "Twitter",
    value: "https://twitter.com/mariam",
    icon: "🐦",
    isVisible: true,
    order: 3
  },
  {
    id: "4",
    type: "phone",
    label: "الهاتف",
    value: "+966 50 123 4567",
    icon: "📱",
    isVisible: true,
    order: 4
  }
];

const initialFormFields: FormField[] = [
  {
    id: "1",
    name: "name",
    label: "الاسم",
    type: "text",
    placeholder: "اسمك الكامل",
    isRequired: true,
    isVisible: true,
    order: 1
  },
  {
    id: "2",
    name: "email",
    label: "البريد الإلكتروني",
    type: "email",
    placeholder: "your@email.com",
    isRequired: true,
    isVisible: true,
    order: 2
  },
  {
    id: "3",
    name: "subject",
    label: "الموضوع",
    type: "text",
    placeholder: "موضوع الرسالة",
    isRequired: true,
    isVisible: true,
    order: 3
  },
  {
    id: "4",
    name: "message",
    label: "الرسالة",
    type: "textarea",
    placeholder: "اكتب رسالتك هنا...",
    isRequired: true,
    isVisible: true,
    order: 4
  }
];

// وظائف التخزين
const getContactData = () => {
  try {
    const stored = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // تهيئة البيانات الافتراضية
    const defaultData = {
      contactInfo: initialContactInfo,
      formFields: initialFormFields
    };
    setContactData(defaultData);
    return defaultData;
  } catch (error) {
    console.error('Error loading contact data:', error);
    return {
      contactInfo: initialContactInfo,
      formFields: initialFormFields
    };
  }
};

const setContactData = (data: any): void => {
  try {
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(data));
    // إرسال حدث تحديث
    window.dispatchEvent(new CustomEvent('contactUpdated', { detail: data }));
  } catch (error) {
    console.error('Error saving contact data:', error);
  }
};

export default function ContactManagement() {
  const [contactData, setContactDataState] = useState(getContactData());
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>(contactData.contactInfo);
  const [formFields, setFormFields] = useState<FormField[]>(contactData.formFields);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    type: "email" as ContactInfo["type"],
    label: "",
    value: "",
    icon: ""
  });
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "text" as FormField["type"],
    placeholder: "",
    isRequired: false
  });

  // تحديث البيانات عند تغيير contactData
  useEffect(() => {
    setContactInfo(contactData.contactInfo);
    setFormFields(contactData.formFields);
  }, [contactData]);

  // استماع لتحديثات البيانات
  useEffect(() => {
    const handleContactUpdate = () => {
      setContactDataState(getContactData());
    };
    
    window.addEventListener('contactUpdated', handleContactUpdate);
    
    return () => {
      window.removeEventListener('contactUpdated', handleContactUpdate);
    };
  }, []);

  // حفظ البيانات في التخزين
  const saveToStorage = () => {
    const data = { contactInfo, formFields };
    setContactData(data);
    setContactDataState(data);
  };

  const toggleContactVisibility = (id: string) => {
    const newContactInfo = contactInfo.map(contact => 
      contact.id === id ? { ...contact, isVisible: !contact.isVisible } : contact
    );
    setContactInfo(newContactInfo);
    saveToStorage();
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const toggleFieldVisibility = (id: string) => {
    const newFormFields = formFields.map(field => 
      field.id === id ? { ...field, isVisible: !field.isVisible } : field
    );
    setFormFields(newFormFields);
    saveToStorage();
    toast({ title: "تم تحديث الرؤية بنجاح" });
  };

  const deleteContact = (id: string) => {
    const newContactInfo = contactInfo.filter(contact => contact.id !== id);
    setContactInfo(newContactInfo);
    saveToStorage();
    toast({ title: "تم حذف معلومات الاتصال بنجاح" });
  };

  const deleteField = (id: string) => {
    const newFormFields = formFields.filter(field => field.id !== id);
    setFormFields(newFormFields);
    saveToStorage();
    toast({ title: "تم حذف الحقل بنجاح" });
  };

  const addNewContact = () => {
    if (newContact.label && newContact.value && newContact.icon) {
      const contact: ContactInfo = {
        id: Date.now().toString(),
        ...newContact,
        isVisible: true,
        order: contactInfo.length + 1
      };
      const newContactInfo = [...contactInfo, contact];
      setContactInfo(newContactInfo);
      setNewContact({ type: "email", label: "", value: "", icon: "" });
      saveToStorage();
      toast({ title: "تم إضافة معلومات الاتصال بنجاح" });
    }
  };

  const addNewField = () => {
    if (newField.name && newField.label && newField.placeholder) {
      const field: FormField = {
        id: Date.now().toString(),
        ...newField,
        isVisible: true,
        order: formFields.length + 1
      };
      const newFormFields = [...formFields, field];
      setFormFields(newFormFields);
      setNewField({ name: "", label: "", type: "text", placeholder: "", isRequired: false });
      saveToStorage();
      toast({ title: "تم إضافة الحقل بنجاح" });
    }
  };

  const updateContact = (id: string, updates: Partial<ContactInfo>) => {
    const newContactInfo = contactInfo.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    );
    setContactInfo(newContactInfo);
    setEditingContact(null);
    saveToStorage();
    toast({ title: "تم تحديث معلومات الاتصال بنجاح" });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    const newFormFields = formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    setFormFields(newFormFields);
    setEditingField(null);
    saveToStorage();
    toast({ title: "تم تحديث الحقل بنجاح" });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إدارة صفحة التواصل</h1>
        <p className="text-muted-foreground">إدارة معلومات الاتصال ونموذج التواصل</p>
      </div>

      {/* Contact Information Management */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الاتصال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactInfo.map((contact) => (
            <div key={contact.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{contact.icon}</span>
                  <div>
                    <h3 className="font-semibold">{contact.label}</h3>
                    <p className="text-sm text-muted-foreground">{contact.value}</p>
                  </div>
                  <Badge variant={contact.isVisible ? "default" : "secondary"}>
                    {contact.isVisible ? "مرئي" : "مخفي"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleContactVisibility(contact.id)}
                  >
                    {contact.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingContact(contact.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingContact === contact.id && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={contact.label}
                      onChange={(e) => updateContact(contact.id, { label: e.target.value })}
                      placeholder="التسمية"
                    />
                    <Input
                      value={contact.value}
                      onChange={(e) => updateContact(contact.id, { value: e.target.value })}
                      placeholder="القيمة"
                    />
                    <Input
                      value={contact.icon}
                      onChange={(e) => updateContact(contact.id, { icon: e.target.value })}
                      placeholder="الأيقونة"
                    />
                    <select
                      value={contact.type}
                      onChange={(e) => updateContact(contact.id, { type: e.target.value as ContactInfo["type"] })}
                      className="px-3 py-2 border border-border rounded-md"
                    >
                      <option value="email">بريد إلكتروني</option>
                      <option value="phone">هاتف</option>
                      <option value="social">وسائل اجتماعية</option>
                      <option value="address">عنوان</option>
                    </select>
                  </div>
                  <Button onClick={() => setEditingContact(null)}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Contact */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة معلومات اتصال جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newContact.label}
                onChange={(e) => setNewContact(prev => ({ ...prev, label: e.target.value }))}
                placeholder="التسمية"
              />
              <Input
                value={newContact.value}
                onChange={(e) => setNewContact(prev => ({ ...prev, value: e.target.value }))}
                placeholder="القيمة"
              />
              <Input
                value={newContact.icon}
                onChange={(e) => setNewContact(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="الأيقونة (emoji)"
              />
              <select
                value={newContact.type}
                onChange={(e) => setNewContact(prev => ({ ...prev, type: e.target.value as ContactInfo["type"] }))}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="email">بريد إلكتروني</option>
                <option value="phone">هاتف</option>
                <option value="social">وسائل اجتماعية</option>
                <option value="address">عنوان</option>
              </select>
            </div>
            <Button onClick={addNewContact}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة معلومات اتصال
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields Management */}
      <Card>
        <CardHeader>
          <CardTitle>حقول نموذج التواصل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-semibold">{field.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {field.type} - {field.placeholder}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={field.isVisible ? "default" : "secondary"}>
                      {field.isVisible ? "مرئي" : "مخفي"}
                    </Badge>
                    {field.isRequired && (
                      <Badge variant="destructive">مطلوب</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFieldVisibility(field.id)}
                  >
                    {field.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingField(field.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteField(field.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingField === field.id && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                      placeholder="اسم الحقل"
                    />
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="التسمية"
                    />
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="النص التوضيحي"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FormField["type"] })}
                      className="px-3 py-2 border border-border rounded-md"
                    >
                      <option value="text">نص</option>
                      <option value="email">بريد إلكتروني</option>
                      <option value="textarea">نص متعدد الأسطر</option>
                      <option value="select">اختيار من قائمة</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(e) => updateField(field.id, { isRequired: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm">حقل مطلوب</label>
                  </div>
                  <Button onClick={() => setEditingField(null)}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Field */}
          <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">إضافة حقل جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newField.name}
                onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم الحقل"
              />
              <Input
                value={newField.label}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                placeholder="التسمية"
              />
              <Input
                value={newField.placeholder}
                onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="النص التوضيحي"
              />
              <select
                value={newField.type}
                onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as FormField["type"] }))}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="text">نص</option>
                <option value="email">بريد إلكتروني</option>
                <option value="textarea">نص متعدد الأسطر</option>
                <option value="select">اختيار من قائمة</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newField.isRequired}
                onChange={(e) => setNewField(prev => ({ ...prev, isRequired: e.target.checked }))}
                className="w-4 h-4"
              />
              <label className="text-sm">حقل مطلوب</label>
            </div>
            <Button onClick={addNewField}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة حقل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}