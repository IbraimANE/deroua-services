import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DerouaServicesApp());
}

class DerouaServicesApp extends StatelessWidget {
  const DerouaServicesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'خدمات الدروة',
      debugShowCheckedModeBanner: false,
      // تفعيل اللغة العربية والاتجاه من اليمين إلى اليسار (RTL) تلقائياً
      locale: const Locale('ar', 'MA'),
      supportedLocales: const [
        Locale('ar', 'MA'),
        Locale('fr', 'FR'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        useMaterial3: true,
        primaryColor: const Color(0xFF059669),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF059669),
          primary: const Color(0xFF059669),
          secondary: const Color(0xFF10B981),
        ),
        scaffoldBackgroundColor: const Color(0xFFF9FAFB),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF059669),
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
        ),
        fontFamily: 'Roboto', // يمكنك استخدام خط كوفي أو Cairo
      ),
      home: const HomeScreen(),
    );
  }
}
