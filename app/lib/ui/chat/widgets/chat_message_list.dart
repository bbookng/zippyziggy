import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';
import 'package:zippy_ziggy/ui/chat/widgets/chat_bubble.dart';

class ChatList extends StatefulWidget {
  const ChatList({super.key});

  @override
  State<ChatList> createState() => _ChatListState();
}

class _ChatListState extends State<ChatList> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ChatProvider>(context);
    final chatList = provider.chatList;
    return ListView.builder(
      reverse: true,
      itemCount: chatList.length,
      itemBuilder: (context, index) {
        final idx = chatList.length - index - 1;
        return ChatBubble(
          message: chatList[idx]['message'],
          isMe: chatList[idx]['isMe'],
          prompt: chatList[idx]['prompt'],
        );
      },
    );
  }
}
