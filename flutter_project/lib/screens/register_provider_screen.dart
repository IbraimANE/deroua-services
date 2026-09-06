import 'package:flutter/material.dart';
import '../services/pb_service.dart';

class RegisterProviderScreen extends StatefulWidget {
  const RegisterProviderScreen({super.key});

  @override
  State<RegisterProviderScreen> createState() => _RegisterProviderScreenState();
}

class _RegisterProviderScreenState extends State<RegisterProviderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _priceController = TextEditingController();
  final _bioController = TextEditingController();

  String _selectedCategory = 'كهرباء';
  bool _isSubmitting = false;

  final List<String> _categories = [
    'كهرباء',
    'سباكة (بلومبي)',
    'صباغة وديكور',
    'نجارة خشب وألمنيوم',
    'ميكانيك سيارات ودراجات',
    'تبريد وتكييف',
    'بناء وتلبيس وجبس',
    'تنظيف منزلي',
    'حدادة وتلحيم',
    'خياطة وطرز',
  ];

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final providerData = {
      'businessName': _nameController.text.trim(),
      'category': _selectedCategory,
      'phone': _phoneController.text.trim(),
      'address': _addressController.text.trim(),
      'basePrice': double.tryParse(_priceController.text.trim()) ?? 50.0,
      'status': 'active',
      'isOnline': true,
      'rating': 5.0,
      'reviewCount': 1,
      'bio': _bioController.text.trim(),
    };

    final success = await PocketBaseService().registerProvider(providerData);

    setState(() => _isSubmitting = false);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.green,
            content: Text('تم تسجيل حسابك كحرفي بنجاح! يظهر الآن في القائمة.'),
          ),
        );
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.red,
            content: Text('حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقاً.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('تسجيل كحرفي جديد بالدروة'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'انضم إلى شبكة حرفيي ومزودي خدمات مدينة الدروة واستقبل طلبات الزبائن مباشرة.',
                style: TextStyle(color: Colors.black54, fontSize: 14),
              ),
              const SizedBox(height: 20),

              // الاسم أو اسم الورشة
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'الاسم الكامل أو اسم المحل/الورشة *',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال الاسم' : null,
              ),
              const SizedBox(height: 14),

              // اختيار المهنة
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'المهنة أو التخصص *',
                  prefixIcon: Icon(Icons.handyman),
                  border: OutlineInputBorder(),
                ),
                items: _categories.map((cat) {
                  return DropdownMenuItem(value: cat, child: Text(cat));
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),
              const SizedBox(height: 14),

              // رقم الهاتف
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'رقم الهاتف (للاتصال والواتساب) *',
                  prefixIcon: Icon(Icons.phone),
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال رقم الهاتف' : null,
              ),
              const SizedBox(height: 14),

              // العنوان أو الحي
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(
                  labelText: 'الحي أو العنوان بالدروة (مثلاً: الوفاء، المسيرة...) *',
                  prefixIcon: Icon(Icons.location_on),
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال الحي أو العنوان' : null,
              ),
              const SizedBox(height: 14),

              // السعر المبدئي
              TextFormField(
                controller: _priceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'السعر المبدئي للتدخل (درهم مغربي)',
                  prefixIcon: Icon(Icons.payments),
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 14),

              // نبذة
              TextFormField(
                controller: _bioController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'نبذة عن خبرتك والخدمات التي تقدمها',
                  alignLabelWithHint: true,
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _isSubmitting ? null : _submitForm,
                child: _isSubmitting
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('تسجيل الحساب الآن', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
