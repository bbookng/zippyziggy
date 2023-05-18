import 'package:fluttertoast/fluttertoast.dart';
import 'package:zippy_ziggy/data/model/prompt_model.dart';
import 'package:zippy_ziggy/data/model/user_model.dart';
import 'package:zippy_ziggy/data/repository/user_repository.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserProvider extends ChangeNotifier {
  static const storage = FlutterSecureStorage();
  final UserRepository _userRepository = UserRepository();
  SocialSignUpModel? user;
  String? code;
  String error = "";
  dynamic tmp;
  String? nickname;
  String? profileImg;
  String? userUuid;

  // 프롬프트 목록들
  List<PromptModel> _promptList = [];
  List<PromptModel> get promptList => _promptList;
  int totalPageCnt = 0;
  int totalPromptsCnt = 0;
  bool isLoading = false;
  int page = 0;

  // 카카오로그인API요청
  Future kakaoLogin() async {
    try {
      final data = await _userRepository.kakaoLoginAPI();
      code = data["data"];
      if (data["result"]) {
        try {
          Map<String, dynamic> res = await _userRepository.kakaoLogin(code!);
          if (res["isSignUp"] != null) {
            return {"result": "SIGNUP", "data": res["user"]};
          }
          user = res["user"];
          storage.write(key: "accessToken", value: res["accessToken"]);
          storage.write(key: "refreshToken", value: res["refreshToken"]);
          nickname = user!.nickname;
          profileImg = user!.profileImg;
          userUuid = user!.userUuid;

          return {"result": "LOGIN", "data": res["user"]};
        } catch (e) {
          Fluttertoast.showToast(
              msg: "로그인 실패",
              backgroundColor: Colors.red,
              textColor: Colors.white);
          return {"result": "FAIL", "data": e};
        }
      }
    } catch (err) {
      Fluttertoast.showToast(
          msg: "로그인 실패", backgroundColor: Colors.red, textColor: Colors.white);
      return {"result": "FAIL", "data": err};
    }
  }

  // 구글로그인 API요청
  // Future googleLogin() async {
  //   try {
  //     final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
  //     print('구글 유저 : $googleUser');
  //   } catch (e) {}
  // }

  // 닉네임 중복검사
  Future<bool> getNickname(String nickname) async {
    try {
      final data = await _userRepository.getNicknameAPI(nickname);
      if (data['result'] == "SUCCESS") {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  // 회원가입 요청
  Future<bool> postSignUp(FormData formData) async {
    try {
      final data = await _userRepository.postSignUpAPI(formData);
      if (data['result'] == 'SUCCESS') {
        user = data['user'];
        storage.write(key: "accessToken", value: data["accessToken"]);
        storage.write(key: "refreshToken", value: data["refreshToken"]);
        nickname = user!.nickname;
        profileImg = user!.profileImg;
        userUuid = user!.userUuid;
        return true;
      } else {
        Fluttertoast.showToast(
            msg: "회원가입 실패",
            backgroundColor: Colors.red,
            textColor: Colors.white);
        return false;
      }
    } catch (err) {
      Fluttertoast.showToast(
          msg: "회원가입 실패", backgroundColor: Colors.red, textColor: Colors.white);
      return false;
    }
  }

  // 회원정보수정 요청
  Future<bool> postUpdate(FormData formData) async {
    try {
      final data = await _userRepository.putUpdateAPI(formData);
      if (data['result'] == 'SUCCESS') {
        user = data['user'];
        nickname = user!.nickname;
        profileImg = user!.profileImg;
        userUuid = user!.userUuid;
        return true;
      } else {
        Fluttertoast.showToast(
            msg: "회원정보수정 실패",
            backgroundColor: Colors.red,
            textColor: Colors.white);
        return false;
      }
    } catch (err) {
      Fluttertoast.showToast(
          msg: "회원정보수정 실패",
          backgroundColor: Colors.red,
          textColor: Colors.white);
      return false;
    }
  }

  // 로그아웃 요청
  Future<bool> postLogout() async {
    try {
      final data = await _userRepository.postLogoutAPI();
      if (data['result'] == 'SUCCESS') {
        nickname = null;
        profileImg = null;
        userUuid = null;
        storage.delete(key: "accessToken");
        storage.delete(key: "refreshToken");
        return true;
      } else {
        Fluttertoast.showToast(
            msg: "로그아웃 실패",
            backgroundColor: Colors.red,
            textColor: Colors.white);
        return false;
      }
    } catch (err) {
      Fluttertoast.showToast(
          msg: "로그아웃 실패", backgroundColor: Colors.red, textColor: Colors.white);
      return false;
    }
  }

  // 북마크 프롬프트 목록 조회
  Future<bool> getBookmarkedPromptList({userUuid, size}) async {
    isLoading = true;
    notifyListeners();
    try {
      Map<String, dynamic> data = await _userRepository
          .getBookmarkedPromptListAPI(userUuid, page, size);

      _promptList += data["promptList"];
      totalPageCnt = data["totalPageCnt"];
      totalPromptsCnt = data["totalPromptsCnt"];
      page += 1;
      return true;
    } catch (e) {
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // 내 프롬프트 목록 조회
  Future<bool> getMyPromptList({userUuid, size}) async {
    isLoading = true;
    notifyListeners();
    try {
      Map<String, dynamic> data =
          await _userRepository.getMyPromptListAPI(userUuid, page, size);
      _promptList += data["promptList"];
      totalPageCnt = data["totalPageCnt"];
      totalPromptsCnt = data["totalPromptsCnt"];
      page += 1;
      return true;
    } catch (e) {
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // 최근 프롬프트 목록 조회
  Future<bool> getRecentPromptList({userUuid, size}) async {
    isLoading = true;
    notifyListeners();
    try {
      Map<String, dynamic> data =
          await _userRepository.getRecentPromptListAPI(userUuid);
      _promptList = data["promptList"];
      return true;
    } catch (e) {
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // AccessToken으로 내 정보 가져오기
  Future<bool> getMyInfo() async {
    try {
      Map<String, dynamic> data = await _userRepository.getMyInfoAPI();
      if (data['result'] == 'SUCCESS') {
        user = data['user'];
        nickname = user!.nickname;
        profileImg = user!.profileImg;
        userUuid = user!.userUuid;
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  void initProvider() async {
    _promptList = [];
    totalPageCnt = 0;
    totalPromptsCnt = 0;
    isLoading = false;
    page = 0;

    nickname = null;
    profileImg = null;
    userUuid = null;

    notifyListeners();
  }

  void resetPrompt() async {
    _promptList = [];
    totalPageCnt = 0;
    totalPromptsCnt = 0;
    isLoading = false;
    page = 0;
    notifyListeners();
  }
}
