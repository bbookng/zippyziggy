import 'package:flutter/material.dart';

class UserProvider extends ChangeNotifier {
  Map<String, dynamic> pageData = {};
  String error = "";
  bool isLoading = false;
  int _count = 0;
  int get count => _count;

  void initProvider() {}

  void increment() {
    _count++;
    notifyListeners();
  }

  void decrement() {
    _count--;
    notifyListeners();
  }
}
