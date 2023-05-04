// import "dart:convert";

// import "package:app/constants/common.dart";
// import "package:app/data/model/book_detail_model.dart";
// import "package:app/data/model/book_model.dart";
// import "package:app/services/api_service.dart";
// import "package:http/http.dart" as http;

// class BookRepository {
//   final APIService _apiService = APIService();

//   // GET : 키워드에 맞는 책 리스트 데이터
//   Future<Map<String, dynamic>> getSearchBookListData(
//       String search, String queryType, String page) async {
//     Map<String, String> params = {
//       "search": search,
//       "queryType": queryType,
//       "page": page,
//       "size": PAGE_LIMIT,
//     };
//     http.Response response = await _apiService.get("/books/search", params);
//     dynamic responseJson = jsonDecode(utf8.decode(response.bodyBytes));
//     final booksData = responseJson["content"] as List;
//     List<Book> bookList = booksData.map((json) => Book.fromJson(json)).toList();

//     final first = responseJson["first"];
//     final last = responseJson["last"];
//     final empty = responseJson["empty"];
//     final numberOfElements = responseJson["numberOfElements"];
//     Map<String, dynamic> pagesData = {
//       "numberOfElements": numberOfElements,
//       "empty": empty,
//       "first": first,
//       "last": last,
//     };
//     Map<String, dynamic> returnData = {
//       "bookList": bookList,
//       "pageData": pagesData,
//     };
//     return returnData;
//   }

//   // GET : 책 상세 데이터
//   Future<BookDetailModel> getBookByIdData(String bookId) async {
//     http.Response response = await _apiService.get("/books/$bookId", null);
//     dynamic responseJson =
//         jsonDecode(utf8.decode(response.bodyBytes)); // string으로온 데이터를 json으로 변경
//     if (responseJson["bookCoverPath"] == null) {
//       responseJson["bookCoverPath"] = "";
//     }
//     if (responseJson["bookCoverBackImagePath"] == null) {
//       responseJson["bookCoverBackImagePath"] = "";
//     }
//     if (responseJson["bookCoverSideImagePath"] == null) {
//       responseJson["bookCoverSideImagePath"] = "";
//     }
//     if (responseJson["readerCount"] == null) {
//       responseJson["readerCount"] = 0;
//     }
//     if (responseJson["meanScore"] == null) {
//       responseJson["meanScore"] = 0;
//     }
//     if (responseJson["meanReadTime"] == null) {
//       responseJson["meanReadTime"] = 0;
//     }
//     if (responseJson["review"] == null) {
//       responseJson["review"] = [];
//     }
//     print(responseJson);
//     BookDetailModel bookDetailData = BookDetailModel.fromJson(responseJson);
//     print(bookDetailData);
//     return bookDetailData;
//   }
// }
