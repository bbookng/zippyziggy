import 'package:shared_preferences/shared_preferences.dart';

class Store {
  const Store._();

  static const String _accessToken = "";

  static Future<void> setToken(String token) async {
    final preferences = await SharedPreferences.getInstance();

    await preferences.setString(_accessToken, token);
  }

  static Future<String?> getToken() async {
    final preferences = await SharedPreferences.getInstance();

    return preferences.getString(_accessToken);
  }

  static Future<void> clear() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.clear();
  }
}
