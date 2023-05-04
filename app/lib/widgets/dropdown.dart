import 'package:flutter/material.dart';

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
        border: const OutlineInputBorder(),
        labelText: _title,
        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
      ),
    );
  }
}
