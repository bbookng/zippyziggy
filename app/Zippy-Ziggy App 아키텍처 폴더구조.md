# Zippy-Ziggy App 아키텍처 폴더구조



#### 기능

**유저**

- 소셜로그인
  - 카카오, 구글
- 마이페이지
  - 북마크한 프롬프트
- 회원정보수정

- 알림
  - Firebase? SSE?



**프롬프트**

- 피드 조회
- 피드 상세
- GPT 대화창



```
/data
	/model
		- prompt.dart
		- user.dart
	/repository
		- prompt_repository.dart
		- user_repository.dart
	/datasource
		- local_datasource.dart
		- remote_datasource.dart
/ui
	/account
		- login_view.dart
		- login_viewmodel.dart
		- signUp_view.dart
		- signUp_viewmodel.dart
		- modify_view.dart
		- modify_viewmodel.dart
	/profile
		- profile_view.dart
		- profile_viewmodel.dart
	/prompt
		- prompt_list_view.dart
		- prompt_list_viewmodel.dart
		- prompt_detail_view.dart
		- prompt_detail_viewmodel.dart
	/chat
		- chat_list_view.dart
		- chat_list_viewmodel.dart
		- chat_room_view.dart
		- chat_room_viewmodel.dart
/widgets
	/navbar
		- navbar.dart
```



