import 'package:flutter/material.dart';
import 'package:zippy_ziggy/app_theme.dart';

class CustomDropdown extends StatefulWidget {
  final String? title;
  final List<List<String>> itemList;
  final String selectedValue;
  final Function(String) onSelected;

  const CustomDropdown({
    super.key,
    this.title,
    required this.itemList,
    required this.selectedValue,
    required this.onSelected,
  });

  @override
  _CustomDropdownState createState() => _CustomDropdownState();
}

class _CustomDropdownState extends State<CustomDropdown> {
  late String _selectedValue;
  String? _title;

  @override
  void initState() {
    super.initState();
    _selectedValue = widget.selectedValue;
    _title = widget.title;
  }

  @override
  void didUpdateWidget(CustomDropdown oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectedValue != oldWidget.selectedValue) {
      setState(() {
        _selectedValue = widget.selectedValue;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: _selectedValue,
      items: widget.itemList.map((List<String> item) {
        return DropdownMenuItem<String>(
          value: item[0],
          child: Text(item[1]),
        );
      }).toList(),
      onChanged: (String? newValue) {
        if (newValue != null) {
          widget.onSelected(newValue);
          setState(() {
            _selectedValue = newValue;
          });
        }
      },
      decoration: InputDecoration(
        enabledBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: AppTheme.grey),
        ),
        focusedBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white, width: 2.0),
        ),
        filled: true,
        // fillColor: Colors.green,
        labelText: _title,
        labelStyle: AppTheme.caption.copyWith(fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
      ),
    );
  }
}
