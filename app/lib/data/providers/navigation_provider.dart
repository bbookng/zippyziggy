import 'package:app/data/model/navigation_model.dart';
import 'package:flutter/material.dart';

class NavigationProvider extends ChangeNotifier {
  NavigationItem _navigationItem = NavigationItem.main; // 기본값

  NavigationItem get navigationItem => _navigationItem;

  void setNavigationItem(NavigationItem navigationItem) {
    _navigationItem = navigationItem;

    notifyListeners();
  }

  void initProvider() {}
}
