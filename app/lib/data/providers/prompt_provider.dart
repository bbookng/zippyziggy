import 'package:flutter/material.dart';

class PromptProvider extends ChangeNotifier {
  Map<String, dynamic> pageData = {};
  String error = "";
  bool isLoading = false;

  void initProvider() {}
}
