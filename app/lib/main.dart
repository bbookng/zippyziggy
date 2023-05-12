import 'package:dio/dio.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/providers/navigation_provider.dart';
import 'package:zippy_ziggy/data/providers/prompt_provider.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/services/dio_service.dart';
import 'package:zippy_ziggy/utils/routes/route.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:zippy_ziggy/services/navigation_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:kakao_flutter_sdk_user/kakao_flutter_sdk_user.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  // SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
  //     overlays: [SystemUiOverlay.bottom]);
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
    Map<String, dynamic> userInfo = {
      "nickname": null,
      "profileImg": null,
      "userUuid": null,
    };
    handleGetUserInfo() async {
      return await getInfo();
    }

    handleGetUserInfo().then(
      (value) => {
        print('여기야! $userInfo'),
        FlutterNativeSplash.remove(),
      },
    );

    print('유저정보 $userInfo');
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
        initialRoute:
            userInfo["nickname"] == null ? RoutesName.login : RoutesName.main,
        onGenerateRoute: Routes.generateRoute,
        navigatorKey: navigatorKey,
        title: _title,
      ),
    );
  }
}

Future<Map<String, dynamic>> getInfo() async {
  const storage = FlutterSecureStorage();
  final accessToken = await storage.read(key: 'accessToken');
  final DioService dioService = DioService();
  Response response = await dioService.dio.get(
    "/members/profile",
    options: Options(
      headers: {
        'Authorization': accessToken,
      },
    ),
  );
  final nickname = response.data['nickname'];
  final profileImg = response.data['profileImg'];
  final userUuid = response.data['userUuid'];
  final userInfo = {
    "nickname": nickname,
    "profileImg": profileImg,
    "userUuid": userUuid,
  };
  return userInfo;
}
