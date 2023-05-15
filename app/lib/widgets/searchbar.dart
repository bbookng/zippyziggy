import 'dart:async';

import 'package:flutter/material.dart';

class DebouncedSearchBar extends StatefulWidget {
  final String content;
  final Function(String) onChangeContent;
  final Function(bool) handleSearch;

  const DebouncedSearchBar({
    super.key,
    required this.content,
    required this.onChangeContent,
    required this.handleSearch,
  });

  @override
  State<DebouncedSearchBar> createState() => _DebouncedSearchBarState();
}

class _DebouncedSearchBarState extends State<DebouncedSearchBar> {
  late String _content;
  final _searchController = TextEditingController();
  late Timer _debounce;

  void _onChangeContent(String value) {
    setState(() {
      _content = value;
    });
    widget.onChangeContent(_content);
    if (_debounce.isActive) _debounce.cancel();
    _debounce = Timer(
        const Duration(milliseconds: 500), () => widget.handleSearch(true));
  }

  @override
  void initState() {
    super.initState();
    _content = widget.content;
    _searchController.addListener(() {
      _onChangeContent(_searchController.text);
    });
    _debounce = Timer(const Duration(milliseconds: 500), () {});
  }

  @override
  void dispose() {
    super.dispose();
    _searchController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _searchController,
      decoration: InputDecoration(
          hintText: '검색어를 입력하세요',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          focusedBorder: const OutlineInputBorder(
            borderSide: BorderSide(color: Colors.white, width: 2.0),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 8,
          )),
    );
  }
}
