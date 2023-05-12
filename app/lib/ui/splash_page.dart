import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/app_theme.dart';
import 'package:zippy_ziggy/data/providers/user_provider.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) {
        final provider = Provider.of<UserProvider>(context, listen: false);
        Timer(
          const Duration(milliseconds: 1000),
          () {
            provider.initProvider();
            provider.getMyInfo().then(
                  (_) => {
                    if (provider.nickname != null)
                      {
                        Navigator.of(context).pushNamedAndRemoveUntil(
                            RoutesName.main, (route) => false)
                      }
                    else
                      {
                        Navigator.of(context).pushNamedAndRemoveUntil(
                            RoutesName.login, (route) => false)
                      }
                  },
                );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    var screenHeight = MediaQuery.of(context).size.height;
    var screenWidth = MediaQuery.of(context).size.width;

    return WillPopScope(
      onWillPop: () async => false,
      child: MediaQuery(
        data: MediaQuery.of(context).copyWith(textScaleFactor: 1),
        child: Scaffold(
          backgroundColor: Colors.black,
          body: SizedBox(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(
                  height: screenHeight * 0.384375,
                ),
                SizedBox(
                  child: Image.asset(
                    'assets/images/Logo_dark.png',
                    width: screenWidth * 0.616666,
                    height: screenHeight * 0.0859375,
                  ),
                ),
                const Expanded(child: SizedBox()),
                const Align(
                  child: Text(
                    "@ Copyright 2023, 팀든든",
                    style: AppTheme.body2,
                  ),
                ),
                SizedBox(
                  height: screenHeight * 0.0625,
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
