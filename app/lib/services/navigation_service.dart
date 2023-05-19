import 'package:flutter/material.dart';

abstract class NavigationService {
  get key;

  void pop({Object arguments});

  Future<dynamic> pushNamed(String routeName, {Object arguments});

  Future<dynamic> pushNamedAndRemoveAll(String routeName, {Object arguments});
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class NavigationServiceImpl implements NavigationService {
  @override
  get key => navigatorKey;

  @override
  void pop({Object? arguments}) {
    return navigatorKey.currentState!.pop(arguments);
  }

  @override
  Future pushNamed(String routeName, {Object? arguments}) {
    return navigatorKey.currentState!.pushNamed(
      routeName,
      arguments: arguments,
    );
  }

  @override
  Future pushNamedAndRemoveAll(String routeName, {Object? arguments}) {
    return navigatorKey.currentState!.pushNamedAndRemoveUntil(
      routeName,
      arguments: arguments,
      (Route<dynamic> route) => false,
    );
  }
}
