import 'dart:async';

import 'package:flutter/material.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/repository/chat_repository.dart';
import 'package:zippy_ziggy/data/repository/prompt_repository.dart';

class ChatProvider extends ChangeNotifier {
  final ChatRepository _chatRepository = ChatRepository();
  final PromptRepository _promptRepository = PromptRepository();

  // GPT 답변
  String answer = '';
  StreamSubscription? subscription;

  // GPT한테 보낼 메시지 목록
  late List<Map<String, String>> _messageList = [];
  List<Map<String, String>> get messageList => _messageList;

  // 유저한테 보여줄 메시지 목록
  List<Map<String, dynamic>> chatList = [];

  // 적용할 프롬프트
  late PromptDetailModel? _prompt = PromptDetailModel();
  PromptDetailModel? get prompt => _prompt;

  bool isLoading = false;
  bool isLoadingGPT = false;

  void addChat(String message, bool isMe) {
    chatList.add({'message': message, 'isMe': isMe, 'prompt': prompt});
    notifyListeners();
  }

  void addMessage(Map<String, String> message) {
    messageList.add(message);
    notifyListeners();
  }

  // 채팅 초기화
  void initProvider() {
    _prompt = null;
    _messageList = [];
    isLoading = false;
    isLoadingGPT = false;
    chatList = [];
    answer = '';
    stopChat();
    notifyListeners();
  }

  // 채팅에 적용하고 있는 프롬프트 제거
  void removePrompt() {
    _prompt = null;
    notifyListeners();
  }

  // 채팅에 적용할 프롬프트 가져오기
  Future<bool> getPrompt(String promptUuid) async {
    isLoading = true;
    _prompt = null;
    notifyListeners();
    try {
      Map<String, dynamic> data =
          await _promptRepository.getPromptDetailAPI(promptUuid);
      _prompt = data['prompt'];
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // ChatGPT SSE 요청
  Future<Map<String, dynamic>> SSEChatGPT() async {
    try {
      String systemMessage = '';
      String exampleMessage = '';
      final List<Map<String, String>> extraMessages = [];
      if (prompt != null) {
        final String? prefix = prompt?.messageResponse?.prefix;
        final String? suffix = prompt?.messageResponse?.suffix;
        final String? example = prompt?.messageResponse?.example;
        if (prefix != null) {
          systemMessage = '$prefix\n';
        }
        if (suffix != null) {
          systemMessage += suffix;
        }
        if (example != null) {
          exampleMessage = example;
        }
        if (systemMessage.isNotEmpty) {
          extraMessages.add({
            "role": "system",
            "content": systemMessage,
          });
        }
        if (exampleMessage.isNotEmpty) {
          extraMessages.add(
            {
              "role": "assistant",
              "content": exampleMessage,
            },
          );
        }
      }

      List<Map<String, String>> messages = messageList;
      if (extraMessages.isNotEmpty) {
        messages = extraMessages + messages;
      }

      final response = await _chatRepository.SSEChatGPTAPI(messages);
      answer = '';
      chatList.add({
        "message": answer,
        "isMe": false,
        "prompt": prompt,
      });
      messageList.add({
        "role": "assistant",
        "content": answer,
      });

      subscription = await response.listen((it) {
        // print('${it.choices.last.message!.content}');
        answer += it.choices.last.message!.content;
        chatList[chatList.length - 1]['message'] = answer;
        _messageList[_messageList.length - 1]['content'] = answer;
        notifyListeners();
      });

      return {"result": "SUCCESS", "data": subscription};
    } catch (e) {
      chatList.add({
        "message": "요청 실패, 다시 시도해주세요.",
        "isMe": false,
        "prompt": prompt,
      });
      messageList.removeLast();
      return {"result": "FAIL", "data": e};
    }
  }

  // stop
  void stopChat() {
    subscription?.cancel();
    subscription = null;
  }
}
