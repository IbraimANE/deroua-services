import PocketBase from 'pocketbase';

// يمكنك لاحقاً تغيير هذا الرابط إلى الـ IP الخاص بسيرفر أوراكل
// مثال: const PB_URL = 'http://129.150.x.x:8090';
const PB_URL = 'http://51.170.132.91:8090';

export const pb = new PocketBase(PB_URL);

// إيقاف الإلغاء التلقائي للطلبات (اختياري ولكنه مفيد في بعض الحالات)
pb.autoCancellation(false);
