// import 'package:app/data/model/book_detail_model.dart';
// import 'package:app/data/model/book_model.dart';
// import 'package:app/data/repository/book_repository.dart';
// import 'package:flutter/foundation.dart';

// class BookProvider extends ChangeNotifier {
//   final BookRepository _bookRepository = BookRepository();
//   List<Book> _bookList = [];
//   BookDetailModel? book;
//   List<Book> get bookList => _bookList;
//   Map<String, dynamic> pageData = {};
//   String error = "";
//   bool isLoading = false;

//   Future<void> getBookById(String bookId) async {
//     isLoading = true;
//     notifyListeners();
//     try {
//       BookDetailModel returnData =
//           await _bookRepository.getBookByIdData(bookId);
//       book = returnData;
//     } catch (e) {
//       print("error");
//       error = "error";
//     } finally {
//       isLoading = false;
//       notifyListeners();
//     }
//   }

//   Future<void> getBookListSearch(
//       String search, String queryType, String page) async {
//     isLoading = true;
//     notifyListeners();
//     try {
//       Map<String, dynamic> returnData =
//           await _bookRepository.getSearchBookListData(search, queryType, page);

//       List<Book> pageBookList = returnData["bookList"];
//       pageData = returnData["pageData"];
//       _bookList = pageBookList;
//     } catch (e) {
//       error = "error";
//     } finally {
//       isLoading = false;
//       notifyListeners();
//     }
//   }

//   void initProvider() {
//     _bookList = [];
//     pageData = {};
//     isLoading = false;
//   }
// }
