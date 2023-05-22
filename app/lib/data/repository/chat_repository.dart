import 'package:dio/dio.dart';
import 'package:zippy_ziggy/services/dio_service.dart';

class ChatRepository {
  final DioService _dioService = DioService();

  // POST : ChatGPT API
  Future<Map<String, dynamic>> postChatGPTAPI(
      List<Map<String, dynamic>> messages) async {
    Response response = await _dioService.post(
      '/prompts/gpt/app',
      {
        'messages': messages,
      },
    );

    return response.data;
  }

  // POST : ChatGPT SSE API
  Future SSEChatGPTAPI(List<Map<String, String>> messages) async {
    final response = await _dioService.chat(messages);
    return response;
  }
}
