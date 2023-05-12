import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/utils/routes/route.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:zippy_ziggy/services/navigation_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:kakao_flutter_sdk_user/kakao_flutter_sdk_user.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIMode(
    SystemUiMode.manual,
    overlays: [
      SystemUiOverlay.top,
      SystemUiOverlay.bottom,
    ],
  );
  await dotenv.load(fileName: 'assets/config/.env');
  KakaoSdk.init(nativeAppKey: dotenv.env['KAKAO_NATIVE_KEY']);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  static const String _title = 'Zippy_Ziggy';

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

    return MultiProvider(
      providers: [
        ChangeNotifierProvider<UserProvider>(
          create: (_) => UserProvider()..initProvider(),
        ),
        ChangeNotifierProvider<NavigationProvider>(
          create: (_) => NavigationProvider(),
        ),
        ChangeNotifierProvider<PromptProvider>(
          create: (_) => PromptProvider()..initProvider(),
        ),
      ],
      child: MaterialApp(
        builder: (context, widget) {
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
            child: widget!,
          );
        },
        theme: ThemeData(
          platform: TargetPlatform.iOS,
          appBarTheme: const AppBarTheme(
            backgroundColor: AppTheme.black,
          ),
          textTheme: AppTheme.textTheme,
          scaffoldBackgroundColor: AppTheme.black,
          colorScheme: const ColorScheme.dark(
            background: AppTheme.black,
          ),
        ),
        debugShowCheckedModeBanner: false,
        initialRoute: RoutesName.splash,
        onGenerateRoute: Routes.generateRoute,
        navigatorKey: navigatorKey,
        title: _title,
      ),
    );
  }
}
