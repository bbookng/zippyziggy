import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';

class NewMessage extends StatefulWidget {
  const NewMessage({super.key});

  @override
  State<NewMessage> createState() => _NewMessageState();
}

class _NewMessageState extends State<NewMessage> {
  final _controller = TextEditingController();
  var _userEnterMessage = '';

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ChatProvider>(context);
    final prompt = provider.prompt;

    void _sendMessage() async {
      // 전송 버튼 클릭시 키보드 사라지게 만듦
      FocusScope.of(context).unfocus();
      final Map<String, String> message = {
        "role": "user",
        "content": _controller.text,
      };

      provider.addChat(_controller.text, true);
      provider.addMessage(message);
      await provider.SSEChatGPT();

      // 전송시 텍스트폼 초기화
      _controller.clear();
      _userEnterMessage = '';
    }

    return Container(
      margin: const EdgeInsets.only(
        top: 8,
      ),
      padding: const EdgeInsets.all(
        8,
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 4,
              ),
              child: TextField(
                controller: _controller,
                decoration: InputDecoration(
                  labelText:
                      prompt != null && prompt.messageResponse?.example != null
                          ? '예시) ${prompt.messageResponse!.example}'
                          : '메세지를 입력해주세요.',
                  labelStyle: const TextStyle(color: Colors.white54),
                  focusedBorder: const OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white54, width: 2),
                  ),
                ),
                cursorColor: Colors.white54,
                onChanged: (value) {
                  setState(() {
                    _userEnterMessage = value;
                  });
                },
                minLines: 1,
                maxLines: 10,
                keyboardType: TextInputType.multiline,
              ),
            ),
          ),
          IconButton(
            onPressed: _userEnterMessage.trim().isEmpty || provider.isLoadingGPT
                ? null
                : _sendMessage,
            icon: Icon(
              Icons.send,
              color: _userEnterMessage.trim().isEmpty || provider.isLoadingGPT
                  ? null
                  : Colors.white,
            ),
            constraints: const BoxConstraints(),
          )
        ],
      ),
    );
  }
}
