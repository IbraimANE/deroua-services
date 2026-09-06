import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/models.dart';
import '../services/pb_service.dart';

class ProviderDetailsScreen extends StatelessWidget {
  final ProviderModel provider;
  const ProviderDetailsScreen({super.key, required this.provider});

  Future<void> _makePhoneCall(String phoneNumber) async {
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'\s+'), '');
    final Uri launchUri = Uri(scheme: 'tel', path: cleanNumber);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    }
  }

  Future<void> _openWhatsApp(String phoneNumber, String name) async {
    var cleanNumber = phoneNumber.replaceAll(RegExp(r'[^0-9]'), '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '212${cleanNumber.substring(1)}';
    }
    final message = Uri.encodeComponent('السلام عليكم $name، رأيت حسابك في تطبيق خدمات الدروة وأود الاستفسار عن خدمة.');
    final url = Uri.parse('https://wa.me/$cleanNumber?text=$message');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _showRequestDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final addressCtrl = TextEditingController();
    final descCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('طلب خدمة من ${provider.businessName}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'الاسم الكامل *', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'رقم الهاتف *', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: addressCtrl,
                decoration: const InputDecoration(labelText: 'الحي / العنوان بالدروة *', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: descCtrl,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'وصف العطل أو الخدمة المطلوبة', border: OutlineInputBorder()),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF059669),
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              if (nameCtrl.text.isEmpty || phoneCtrl.text.isEmpty || addressCtrl.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('يرجى ملء جميع الحقول الإلزامية')),
                );
                return;
              }

              final req = ServiceRequestModel(
                id: '',
                clientName: nameCtrl.text,
                clientPhone: phoneCtrl.text,
                clientLocation: addressCtrl.text,
                providerId: provider.id,
                providerName: provider.businessName,
                category: provider.category,
                description: descCtrl.text,
                createdAt: 'الآن',
              );

              final success = await PocketBaseService().sendServiceRequest(req);
              if (context.mounted) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: success ? Colors.green : Colors.orange,
                    content: Text(success ? 'تم إرسال طلبك بنجاح للمزود!' : 'تم حفظ الطلب محلياً'),
                  ),
                );
              }
            },
            child: const Text('إرسال الطلب'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(provider.businessName),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // بطاقة المعلوات الأساسية
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: const Color(0xFF059669).withOpacity(0.1),
                      backgroundImage: provider.avatar.isNotEmpty ? NetworkImage(provider.avatar) : null,
                      child: provider.avatar.isEmpty ? const Icon(Icons.person, size: 45, color: Color(0xFF059669)) : null,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          provider.businessName,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        if (provider.isVerified) ...[
                          const SizedBox(width: 6),
                          const Icon(Icons.verified, size: 20, color: Colors.blue),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      provider.category,
                      style: const TextStyle(color: Color(0xFF059669), fontWeight: FontWeight.w600, fontSize: 15),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 18),
                        const SizedBox(width: 4),
                        Text(
                          '${provider.rating.toStringAsFixed(1)} (${provider.reviewCount} تقييم)',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    ListTile(
                      leading: const Icon(Icons.location_on_outlined, color: Color(0xFF059669)),
                      title: const Text('الموقع أو الحي'),
                      subtitle: Text(provider.address),
                    ),
                    if (provider.workHours != null)
                      ListTile(
                        leading: const Icon(Icons.access_time, color: Color(0xFF059669)),
                        title: const Text('ساعات العمل'),
                        subtitle: Text(provider.workHours!),
                      ),
                    if (provider.basePrice > 0)
                      ListTile(
                        leading: const Icon(Icons.payments_outlined, color: Color(0xFF059669)),
                        title: const Text('السعر المبدئي للتدخل'),
                        subtitle: Text('${provider.basePrice.toInt()} درهم'),
                      ),
                  ],
                ),
              ),
            ),

            if (provider.bio != null && provider.bio!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('نبذة عن الحرفي والخدمات', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 8),
                      Text(provider.bio!, style: const TextStyle(color: Colors.black87, height: 1.5)),
                    ],
                  ),
                ),
              ),
            ],

            const SizedBox(height: 24),

            // أزرار التواصل المباشر
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green[700],
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.phone),
                    label: const Text('اتصال مباشر', style: TextStyle(fontWeight: FontWeight.bold)),
                    onPressed: () => _makePhoneCall(provider.phone),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.chat),
                    label: const Text('واتساب', style: TextStyle(fontWeight: FontWeight.bold)),
                    onPressed: () => _openWhatsApp(provider.phone, provider.businessName),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.send_rounded),
                label: const Text('إرسال طلب خدمة عبر التطبيق', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                onPressed: () => _showRequestDialog(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
