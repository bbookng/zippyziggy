import 'package:chat_gpt_sdk/chat_gpt_sdk.dart';
import 'package:zippy_ziggy/interceptors/dio_interceptor.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

String _baseUrl = dotenv.env["BASE_URL"]!;
String _chatKey = dotenv.env["GPT_KEY"]!;

final openAI = OpenAI.instance.build(token: _chatKey);

class DioService {
  final BaseOptions options = BaseOptions(
    // connectTimeout: const Duration(seconds: 10),
    // receiveTimeout: 10000,
    // sendTimeout: 10000,
    // responseType: ResponseType.plain,
    // validateStatus: (_) {
    //   return true;
    // },
    baseUrl: _baseUrl,
  );

  late final Dio dio;
  late final Dio _dio;

  DioService() {
    dio = Dio(options);
    _dio = Dio(options);
    _dio.interceptors.add(DioInterceptor());
  }

  Future<dynamic> get(String url, Map<String, dynamic>? params) async {
    try {
      final response = await _dio.get(url, queryParameters: params);
      return response;
    } on DioError catch (error) {
      throw DioError(
          requestOptions: error.requestOptions, response: error.response);
    }
  }

  Future<dynamic> post(String url, Map<String, dynamic>? data) async {
    try {
      final response = await _dio.post(url, data: data);
      return response;
    } on DioError catch (error) {
      throw DioError(
          requestOptions: error.requestOptions, response: error.response);
    }
  }

  Future<dynamic> put(String url, Map<String, dynamic>? data) async {
    try {
      final response = await _dio.put(url, data: data);
      return response;
    } on DioError catch (error) {
      throw DioError(
          requestOptions: error.requestOptions, response: error.response);
    }
  }

  Future<dynamic> delete(String url) async {
    try {
      final response = await _dio.delete(url);
      return response;
    } on DioError catch (error) {
      throw DioError(
          requestOptions: error.requestOptions, response: error.response);
    }
  }

  Future chat(List<Map<String, String>> messages) async {
    try {
      final request = ChatCompleteText(
        messages: messages,
        maxToken: 1000,
        model: ChatModel.gptTurbo,
      );
      final response = openAI.onChatCompletionSSE(request: request);
      return response;
    } on DioError catch (error) {
      throw DioError(
        requestOptions: error.requestOptions,
        response: error.response,
      );
    }
  }
}
