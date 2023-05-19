import 'package:zippy_ziggy/data/model/prompt_model.dart';

class MessageModel {
  final String role;
  final String content;
  final PromptDetailModel? prompt;

  MessageModel({
    required this.role,
    required this.content,
    this.prompt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      role: json['role'],
      content: json['content'],
      prompt: json['prompt'],
    );
  }
}
