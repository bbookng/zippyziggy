import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:zippy_ziggy/data/providers/chat_provider.dart';
import 'package:zippy_ziggy/ui/chat/widgets/chat_message_list.dart';
import 'package:zippy_ziggy/ui/chat/widgets/creating_message.dart';
import 'package:zippy_ziggy/ui/chat/widgets/end_drawer.dart';
import 'package:zippy_ziggy/ui/chat/widgets/new_message.dart';
import 'package:zippy_ziggy/ui/chat/widgets/using_prompt.dart';

class ChatPage extends StatefulWidget {
  final String? promptUuid;
  const ChatPage({
    super.key,
    this.promptUuid,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) async {
        final provider = Provider.of<ChatProvider>(context, listen: false);
        if (widget.promptUuid != null) {
          await provider.getPrompt(widget.promptUuid!);
        } else {
          provider.initProvider();
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
    final chatProvider = Provider.of<ChatProvider>(context);
    final prompt = chatProvider.prompt;

    void _openEndDrawer() {
      scaffoldKey.currentState!.openEndDrawer();
    }

    void _closeEndDrawer() {
      Navigator.of(context).pop();
    }

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        title: FractionallySizedBox(
          widthFactor: 0.5,
          child: Image.asset(
            'assets/images/Logo_dark.png',
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {
              _openEndDrawer();
            },
            icon: const Icon(Icons.bookmarks_rounded),
          ),
        ],
      ),
      // drawer: const BurgerNavigator(),
      endDrawer: const EndDrawer(),
      body: Container(
        padding: const EdgeInsets.all(12),
        child: Stack(
          children: [
            const Column(
              children: [
                Expanded(child: ChatList()),
                creating_message(),
                NewMessage(),
              ],
            ),
            if (prompt != null) PromptInfo(prompt: prompt),
          ],
        ),
      ),
    );
  }
}
