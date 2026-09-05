import React, { useState } from 'react';
import { DirectoryItem, LabTest, Language } from '../types';
import { t } from '../translations';
import { 
  Building2, 
  MapPin, 
  Phone, 
  FlaskConical, 
  Plus, 
  Save, 
  Check, 
  Trash2, 
  ExternalLink,
  Stethoscope,
  Home
} from 'lucide-react';

interface CompanyDashboardProps {
  directoryItems: DirectoryItem[];
  onUpdateDirectoryItem: (updated: DirectoryItem) => void;
  language: Language;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  directoryItems,
  onUpdateDirectoryItem,
  language
}) => {
  // Clinic, lab, or center items
  const facilities = directoryItems.filter(d => d.category === 'clinic' || d.category === 'lab' || d.category === 'center');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || '');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const activeFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];

  // Editable Form states
  const [name, setName] = useState(activeFacility?.name || '');
  const [phone, setPhone] = useState(activeFacility?.phone || '');
  const [address, setAddress] = useState(activeFacility?.address || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(activeFacility?.googleMapsUrl || '');
  const [specialty, setSpecialty] = useState(activeFacility?.specialty || '');
  const [doctorName, setDoctorName] = useState(activeFacility?.doctorName || '');
  const [homeSampling, setHomeSampling] = useState(activeFacility?.homeSampling ?? false);
  const [workHours, setWorkHours] = useState(activeFacility?.workHours || '');
  const [notes, setNotes] = useState(activeFacility?.notes || '');

  // New Test / Service Inputs
  const [newTestName, setNewTestName] = useState('');
  const [newTestPrice, setNewTestPrice] = useState('');
  const [newTestDuration, setNewTestDuration] = useState('');

  const handleFacilitySelect = (id: string) => {
    setSelectedFacilityId(id);
    const item = facilities.find(f => f.id === id);
    if (item) {
      setName(item.name);
      setPhone(item.phone);
      setAddress(item.address);
      setGoogleMapsUrl(item.googleMapsUrl || '');
      setSpecialty(item.specialty || '');
      setDoctorName(item.doctorName || '');
      setHomeSampling(item.homeSampling ?? false);
      setWorkHours(item.workHours || '');
      setNotes(item.notes || '');
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFacility) return;
    const updated: DirectoryItem = {
      ...activeFacility,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      specialty: specialty.trim() || undefined,
      doctorName: doctorName.trim() || undefined,
      homeSampling: homeSampling,
      workHours: workHours.trim() || undefined,
      notes: notes.trim()
    };
    onUpdateDirectoryItem(updated);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2500);
  };

  const handleAddLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestPrice || !activeFacility) return;

    const newTest: LabTest = {
      id: 'test-' + Date.now(),
      name: newTestName.trim(),
      nameFr: newTestName.trim(),
      price: parseFloat(newTestPrice) || 0,
      duration: newTestDuration.trim() || 'نفس اليوم'
    };

    const currentTests = activeFacility.labTests || [];
    const updated: DirectoryItem = {
      ...activeFacility,
      labTests: [...currentTests, newTest]
    };
    onUpdateDirectoryItem(updated);
    setNewTestName('');
    setNewTestPrice('');
    setNewTestDuration('');
  };

  const handleDeleteLabTest = (testId: string) => {
    if (!activeFacility || !activeFacility.labTests) return;
    const updated: DirectoryItem = {
      ...activeFacility,
      labTests: activeFacility.labTests.filter(t => t.id !== testId)
    };
    onUpdateDirectoryItem(updated);
  };

  if (facilities.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
          <Stethoscope className="w-12 h-12 text-teal-600 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
            لا توجد منشآت صحية مسجلة حالياً
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            يمكنك تسجيل عيادة طبية مع ذكر التخصص، أو مختبر تحاليل مع تحديد الفحوصات والأسعار، أو مركز صحي مباشرة من شاشة تسجيل الدخول وإنشاء الحساب.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header with selector */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-white/10 text-teal-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
            فضاء المنشآت الطبية والصحية بالدروة
          </span>
          <h2 className="text-lg sm:text-xl font-black mt-1">
            لوحة إدارة المنشأة: {activeFacility?.name}
          </h2>
          <p className="text-xs text-teal-100/80 mt-0.5">
            تعديل أوقات العمل، التخصص، الفحوصات، والأسعار المعتمدة للظهور بدليل الدروة
          </p>
        </div>

        {facilities.length > 1 && (
          <div className="bg-white/10 p-2 rounded-xl border border-white/15">
            <label className="block text-[10px] text-teal-200 font-bold mb-1">اختر المنشأة:</label>
            <select
              value={selectedFacilityId}
              onChange={(e) => handleFacilitySelect(e.target.value)}
              className="text-xs font-bold p-2 bg-slate-900/80 border border-white/20 rounded-lg text-white outline-none"
            >
              {facilities.map(f => (
                <option key={f.id} value={f.id} className="text-slate-900">
                  {f.iconEmoji || '🏥'} {f.name} ({f.category === 'clinic' ? 'عيادة' : f.category === 'lab' ? 'مختبر' : 'مركز'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {showSavedNotification && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>تم حفظ بيانات المنشأة وتحديث الدليل بنجاح!</span>
        </div>
      )}

      {/* Facility Details Form */}
      <form onSubmit={handleSaveDetails} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <span>{activeFacility?.iconEmoji || '🏥'}</span>
            <span>
              بيانات {activeFacility?.category === 'clinic' ? 'العيادة الطبية' : activeFacility?.category === 'lab' ? 'المختبر' : 'المركز الصحي'}
            </span>
          </h3>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
            دليل الدروة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنشأة</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف الرسمي</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none dir-ltr text-right"
            />
          </div>

          {/* Specialty (ذكر التخصص) */}
          {(activeFacility?.category === 'clinic' || activeFacility?.category === 'center') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التخصص الطبي</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="مثال: طب الأطفال، جراحة الأسنان، ترويض طبي..."
                className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطبيب أو المشرف المسؤول</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="د. فلان الفلاني"
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">العنوان في الدروة</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">أوقات وساعات العمل</label>
            <input
              type="text"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              placeholder="الإثنين - الجمعة: 09:00 - 18:00"
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          {activeFacility?.category === 'lab' && (
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
              <div>
                <span className="font-bold text-xs text-slate-800 block">خدمة أخذ العينات بالمنزل</span>
                <span className="text-[10px] text-slate-500">إرسال ممرض لمنازل كبار السن وذوي الاحتياجات</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={homeSampling} 
                  onChange={(e) => setHomeSampling(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات للمواطنين</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: فحص السكر، مواعيد الاستشارات، التعاقد مع التعاضديات..."
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>تحديث وحفظ بيانات المنشأة</span>
          </button>
        </div>
      </form>

      {/* Lab Tests & Prices Manager (for Labs and Centers) */}
      {(activeFacility?.category === 'lab' || activeFacility?.category === 'center') && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-indigo-700" />
              <span>
                {activeFacility?.category === 'lab' 
                  ? 'لائحة التحاليل والفحوصات الطبية وأثمنتها بالدرهم (DH)' 
                  : 'لائحة الخدمات والفحوصات وأثمنتها بالدرهم (DH)'}
              </span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {activeFacility?.labTests?.length || 0} عنصر مسجل
            </span>
          </div>

          {/* Add New Test Form */}
          <form onSubmit={handleAddLabTest} className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
            <h4 className="text-xs font-bold text-indigo-900">إضافة فحص أو تحليل جديد للائحة:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                required
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="اسم التحليل (مثال: NFS, Glycémie...)"
                className="text-xs p-2.5 bg-white border border-indigo-200 rounded-xl outline-none"
              />
              <input
                type="number"
                required
                min="0"
                value={newTestPrice}
                onChange={(e) => setNewTestPrice(e.target.value)}
                placeholder="الثمن بالدرهم (مثال: 120)"
                className="text-xs p-2.5 bg-white border border-indigo-200 rounded-xl outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTestDuration}
                  onChange={(e) => setNewTestDuration(e.target.value)}
                  placeholder="المدة (مثال: نفس اليوم)"
                  className="flex-1 text-xs p-2.5 bg-white border border-indigo-200 rounded-xl outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </div>
            </div>
          </form>

          {/* Tests List */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {(!activeFacility?.labTests || activeFacility.labTests.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لا توجد فحوصات أو تحاليل مضافة بعد. استخدم النموذج أعلاه لإضافة الفحوصات وأثمنتها.
              </div>
            ) : (
              activeFacility.labTests.map(test => (
                <div key={test.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900">{test.name}</span>
                    {test.duration && (
                      <span className="text-[10px] text-slate-500 mr-2 rtl:mr-2 ltr:ml-2">
                        • المدة: {test.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                      {test.price} DH
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteLabTest(test.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
