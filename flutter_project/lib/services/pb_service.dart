import 'package:pocketbase/pocketbase.dart';
import '../models/models.dart';

class PocketBaseService {
  static final PocketBaseService _instance = PocketBaseService._internal();
  factory PocketBaseService() => _instance;

  late final PocketBase pb;
  // رابط سيرفرك المخصص في أوراكل
  static const String serverUrl = 'http://51.170.132.91:8090';

  PocketBaseService._internal() {
    pb = PocketBase(serverUrl);
  }

  // جلب قائمة الحرفيين
  Future<List<ProviderModel>> getProviders() async {
    try {
      final records = await pb.collection('providers').getFullList(
        sort: '-created',
      );
      return records.map((r) => ProviderModel.fromJson(r.toJson())).toList();
    } catch (e) {
      // ignore: avoid_print
      print('خطأ في جلب المزودين من PocketBase: $e');
      return [];
    }
  }

  // إضافة حرفي جديد
  Future<bool> registerProvider(Map<String, dynamic> data) async {
    try {
      await pb.collection('providers').create(body: data);
      return true;
    } catch (e) {
      // ignore: avoid_print
      print('خطأ في تسجيل الحرفي: $e');
      return false;
    }
  }

  // جلب دليل أرقام الطوارئ والمراكز
  Future<List<DirectoryItemModel>> getDirectory() async {
    try {
      final records = await pb.collection('directory').getFullList(
        sort: '-created',
      );
      if (records.isNotEmpty) {
        return records.map((r) => DirectoryItemModel.fromJson(r.toJson())).toList();
      }
    } catch (e) {
      // ignore: avoid_print
      print('خطأ في جلب الدليل: $e');
    }
    // في حال تعذر الاتصال، إرجاع الأرقام الرسمية الافتراضية
    return getDefaultDirectory();
  }

  // إرسال طلب خدمة
  Future<bool> sendServiceRequest(ServiceRequestModel request) async {
    try {
      await pb.collection('service_requests').create(body: request.toJson());
      return true;
    } catch (e) {
      // ignore: avoid_print
      print('خطأ في إرسال الطلب: $e');
      return false;
    }
  }

  // جلب طلبات زبون معين أو الحرفي
  Future<List<ServiceRequestModel>> getRequests() async {
    try {
      final records = await pb.collection('service_requests').getFullList(
        sort: '-created',
      );
      return records.map((r) => ServiceRequestModel.fromJson(r.toJson())).toList();
    } catch (e) {
      return [];
    }
  }

  // إرسال شكاية أو مقترح
  Future<bool> sendComplaint({
    required String name,
    required String phone,
    required String subject,
    required String message,
  }) async {
    try {
      await pb.collection('complaints').create(body: {
        'name': name,
        'phone': phone,
        'subject': subject,
        'message': message,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // الأرقام الافتراضية الرسمية للدروة
  List<DirectoryItemModel> getDefaultDirectory() {
    return [
      DirectoryItemModel(
        id: 'dir-1',
        name: 'الوقاية المدنية النواصر - الدروة',
        category: 'emergency',
        phone: '0522539502',
        address: 'طريق المطار، النواصر - الدروة',
        iconEmoji: '🚒',
        notes: 'خدمة التدخل السريع للحرائق والحوادث والإسعاف',
      ),
      DirectoryItemModel(
        id: 'dir-2',
        name: 'الدرك الملكي - سرية الدروة',
        category: 'emergency',
        phone: '0522323531',
        address: 'الشارع الرئيسي، وسط مدينة الدروة',
        iconEmoji: '🚓',
        notes: 'مداومة أمنية 24/24 ساعة',
      ),
      DirectoryItemModel(
        id: 'dir-3',
        name: 'الإسعاف الوطني المستعجل',
        category: 'emergency',
        phone: '15',
        address: 'المغرب - اتصال مجاني',
        iconEmoji: '🚑',
        notes: 'رقم الطوارئ المجاني للحالات الصحية المستعجلة',
      ),
      DirectoryItemModel(
        id: 'dir-4',
        name: 'صيدلية الدروة المركزية (حراسة)',
        category: 'emergency',
        phone: '0522539100',
        address: 'شارع الحسن الثاني، أمام البريد، الدروة',
        iconEmoji: '💊',
        notes: 'صيدلية الحراسة الليلية والأدوية المستعجلة',
      ),
      DirectoryItemModel(
        id: 'dir-5',
        name: 'صيدلية الوفاء',
        category: 'emergency',
        phone: '0522539820',
        address: 'تجزئة الوفاء، الدروة',
        iconEmoji: '💊',
      ),
    ];
  }
}
