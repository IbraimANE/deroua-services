import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/models.dart';
import '../services/pb_service.dart';
import 'directory_screen.dart';
import 'provider_details_screen.dart';
import 'register_provider_screen.dart';
import 'my_requests_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PocketBaseService _pbService = PocketBaseService();
  List<ProviderModel> _allProviders = [];
  List<ProviderModel> _filteredProviders = [];
  bool _isLoading = true;
  String _selectedCategory = 'الكل';
  String _searchQuery = '';

  final List<String> _categories = [
    'الكل',
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

  @override
  void initState() {
    super.initState();
    _loadProviders();
  }

  Future<void> _loadProviders() async {
    setState(() => _isLoading = true);
    final list = await _pbService.getProviders();
    setState(() {
      _allProviders = list;
      _filter();
      _isLoading = false;
    });
  }

  void _filter() {
    _filteredProviders = _allProviders.where((p) {
      final matchesCategory = _selectedCategory == 'الكل' || p.category.contains(_selectedCategory);
      final matchesQuery = _searchQuery.isEmpty ||
          p.businessName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.category.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.address.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    }).toList();
  }

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.handyman_rounded, color: Colors.white),
            SizedBox(width: 8),
            Text('خدمات الدروة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'دليل الطوارئ والصيدليات',
            icon: const Icon(Icons.medical_services_outlined),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const DirectoryScreen()),
              );
            },
          ),
          IconButton(
            tooltip: 'طلباتي',
            icon: const Icon(Icons.receipt_long_rounded),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const MyRequestsScreen()),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadProviders,
        child: Column(
          children: [
            // شريط البحث
            Container(
              padding: const EdgeInsets.all(12),
              color: Colors.white,
              child: TextField(
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                    _filter();
                  });
                },
                decoration: InputDecoration(
                  hintText: 'ابحث عن حرفي، مهنة، أو حي بالدروة...',
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF059669)),
                  filled: true,
                  fillColor: const Color(0xFFF3F4F6),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),

            // قائمة التصنيفات الأفقية
            SizedBox(
              height: 48,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      selectedColor: const Color(0xFF059669),
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : Colors.black87,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                      onSelected: (selected) {
                        setState(() {
                          _selectedCategory = cat;
                          _filter();
                        });
                      },
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 8),

            // قائمة الحرفيين
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _filteredProviders.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.person_off_outlined, size: 64, color: Colors.grey),
                              const SizedBox(height: 12),
                              const Text(
                                'لا يوجد مزود خدمة مطابق للبحث حالياً',
                                style: TextStyle(fontSize: 16, color: Colors.black54),
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF059669),
                                  foregroundColor: Colors.white,
                                ),
                                icon: const Icon(Icons.person_add),
                                label: const Text('كن أول من يسجل كحرفي بالدروة'),
                                onPressed: () async {
                                  final res = await Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => const RegisterProviderScreen()),
                                  );
                                  if (res == true) _loadProviders();
                                },
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          itemCount: _filteredProviders.length,
                          itemBuilder: (context, index) {
                            final provider = _filteredProviders[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 1.5,
                              child: InkWell(
                                borderRadius: BorderRadius.circular(16),
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => ProviderDetailsScreen(provider: provider),
                                    ),
                                  );
                                },
                                child: Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          CircleAvatar(
                                            radius: 28,
                                            backgroundColor: const Color(0xFF059669).withOpacity(0.1),
                                            backgroundImage: provider.avatar.isNotEmpty
                                                ? NetworkImage(provider.avatar)
                                                : null,
                                            child: provider.avatar.isEmpty
                                                ? const Icon(Icons.person, size: 30, color: Color(0xFF059669))
                                                : null,
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    Flexible(
                                                      child: Text(
                                                        provider.businessName,
                                                        style: const TextStyle(
                                                          fontSize: 16,
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                    if (provider.isVerified) ...[
                                                      const SizedBox(width: 4),
                                                      const Icon(Icons.verified, size: 18, color: Colors.blue),
                                                    ],
                                                  ],
                                                ),
                                                const SizedBox(height: 2),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFF059669).withOpacity(0.1),
                                                    borderRadius: BorderRadius.circular(6),
                                                  ),
                                                  child: Text(
                                                    provider.category,
                                                    style: const TextStyle(
                                                      color: Color(0xFF059669),
                                                      fontSize: 12,
                                                      fontWeight: FontWeight.w600,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Row(
                                                  children: [
                                                    const Icon(Icons.location_on, size: 14, color: Colors.grey),
                                                    const SizedBox(width: 2),
                                                    Text(
                                                      provider.address,
                                                      style: const TextStyle(color: Colors.black54, fontSize: 13),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.end,
                                            children: [
                                              Row(
                                                children: [
                                                  const Icon(Icons.star, size: 16, color: Colors.amber),
                                                  const SizedBox(width: 2),
                                                  Text(
                                                    provider.rating.toStringAsFixed(1),
                                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                                  ),
                                                ],
                                              ),
                                              if (provider.basePrice > 0) ...[
                                                const SizedBox(height: 4),
                                                Text(
                                                  '${provider.basePrice.toInt()} درهم',
                                                  style: const TextStyle(
                                                    color: Color(0xFF059669),
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 13,
                                                  ),
                                                ),
                                              ]
                                            ],
                                          ),
                                        ],
                                      ),
                                      const Divider(height: 20),
                                      Row(
                                        children: [
                                          Expanded(
                                            child: OutlinedButton.icon(
                                              style: OutlinedButton.styleFrom(
                                                foregroundColor: Colors.green[700],
                                                side: BorderSide(color: Colors.green[300]!),
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                              ),
                                              icon: const Icon(Icons.phone, size: 18),
                                              label: const Text('اتصال'),
                                              onPressed: () => _makePhoneCall(provider.phone),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: ElevatedButton.icon(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: const Color(0xFF25D366),
                                                foregroundColor: Colors.white,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                              ),
                                              icon: const Icon(Icons.chat, size: 18),
                                              label: const Text('واتساب'),
                                              onPressed: () => _openWhatsApp(provider.phone, provider.businessName),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF059669),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('تسجيل كحرفي', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () async {
          final res = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const RegisterProviderScreen()),
          );
          if (res == true) _loadProviders();
        },
      ),
    );
  }
}
