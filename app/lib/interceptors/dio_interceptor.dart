import 'package:zippy_ziggy/services/navigation_service.dart';
import 'package:zippy_ziggy/utils/routes/route_name.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DioInterceptor extends Interceptor {
  static const storage = FlutterSecureStorage();

  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    final accessToken = await storage.read(key: "accessToken");
    // print('[REQ] [${options.method}] [${options.uri}]');
    // print('[REQ] [ACCESSTOKEN] $accessToken');
    if (accessToken != null && accessToken.isNotEmpty) {
      options.headers.addAll({
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      });
    }

    return super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // print(
    // '[RES] [${response.requestOptions.method}] ${response.requestOptions.uri}');

    super.onResponse(response, handler);
  }

  @override
  void onError(DioError err, ErrorInterceptorHandler handler) async {
    // 401 에러가 났을 때 (statusCode)
    // 토큰 재발급 시도
    // 다시 새로운 토큰으로 요청
    // print('[ERR] [${err.requestOptions.method}] ${err.requestOptions.uri}');

    final refreshToken = await storage.read(key: 'refreshToken');
    final accessToken = await storage.read(key: 'accessToken');
    final String baseUrl = dotenv.env['BASE_URL']!;

    if (refreshToken == null || accessToken == null) {
      return handler.reject(err);
    }

    // print("statusCode: ${err.response?.statusCode}");
    final isStatus401 = err.response?.statusCode == 401;
    final isPathRefresh = err.requestOptions.path == '/members/refresh/token';

    if (isStatus401 && !isPathRefresh) {
      // print('[ERR] [${err.requestOptions.method}] accessToken 만료');

      // 401 에러가 발생 + 일반 REST API 요청에서 에러가 발생한 경우 -> accessToken 재발급
      final dio = Dio();
      dio.options.baseUrl = baseUrl;
      dio.options.headers = {
        'Authorization': 'Bearer $accessToken',
        'Refresh': 'Bearer $refreshToken',
      };

      try {
        final res = await dio.get('/users/refresh');

        final newAccessToken = res.data['accessToken'];

        final options = err.requestOptions;

        // 토큰 변경하기
        options.headers.addAll({
          'Authorization': 'Bearer $newAccessToken',
        });

        // 변경된 값 storage에 다시 저장
        await storage.write(key: 'accessToken', value: newAccessToken);

        // 요청 재전송
        final response = await dio.fetch(options);

        // 정상적인 response 값 리턴
        return handler.resolve(response);
      } on DioError {
        // print('[ERR] [${e.requestOptions.method}] refreshToken 만료');
        storage.deleteAll();
        final SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.remove('nickname');
        await prefs.remove('profileImg');
        await prefs.remove('userUuid');
        // 로그인 페이지로 이동
        navigatorKey.currentState!.pushNamedAndRemoveUntil(
          RoutesName.login,
          (route) => false,
        );
      }
    }
    // Token과 관련된 에러가 아닌 경우
    return handler.reject(err);
  }
}
