import 'package:app/data/providers/theme_provider.dart';
import 'package:app/data/providers/user_provider.dart';
import 'package:app/utils/routes/route.dart';
import 'package:app/utils/routes/route_name.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
      overlays: [SystemUiOverlay.bottom]);
  runApp(
    ChangeNotifierProvider<ThemeProvider>(
      create: (_) => ThemeProvider()..initialize(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  static const String _title = 'Zippy_Ziggy';

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<UserProvider>(
          create: (_) => UserProvider(),
        )
      ],
      child: Consumer<ThemeProvider>(builder: (context, provider, child) {
        return MaterialApp(
          builder: (context, widget) {
            return MediaQuery(
                data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
                child: widget!);
          },
          theme: ThemeData(
            platform: TargetPlatform.iOS,
            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.green,
            ),
          ),
          // themeMode: provider.themeMode ? ThemeMode.dark : ThemeMode.light,
          // theme: Styles.themeData(provider.themeMode, context),
          debugShowCheckedModeBanner: false,
          initialRoute: RoutesName.main,
          onGenerateRoute: Routes.generateRoute,
          title: _title,
        );
      }),
    );
  }
}
