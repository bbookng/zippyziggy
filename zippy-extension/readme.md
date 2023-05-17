# ZippyZiggy

ZippyZiggy 확장프로그램을 통해 미리 작성된 프롬프트를 적용해서 chatGPT를 조금 더 쉽고 재밌게 사용해보세요!

Made by [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

[Install Extension](https://chrome.google.com/webstore/detail/%EC%A7%80%ED%94%BC%EC%A7%80%EA%B8%B0-chatgpt-%ED%99%95%EC%9E%A5%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8/gcinlhaphmofekpjjjcnbiigbgnffokc?hl=ko)

---

## 목차

- [소개](#intro)
- [기술스택](#tech)
- [기능](#features)
- [확장프로그램](#installation)
- [웹사이트](#website)

## 소개 <a name="intro"></a>
>이 확장 프로그램은 ChatGPT를 웹 환경에서 친숙하게 다양한 용도로 사용하려는 사용자를 돕기 위해 설계되었습니다.
>사용자 정의 프롬프트 공유 기능과 대화내역 공유를 통해 사용자들간 유용한 프롬프트를 공유 가능합니다.

## 기술스택 <a name="tech"></a>
- react 18.2.0
- tastack/react-query 4.29.5
- axios 1.3.6
- typescript 4.8.3
- chokidar 3.5.3
- ws 8.9.0
- rollup 2.79.1
- vite 3.1.3

## 기능 <a name="features"></a>
- 미리 정의된 프롬프트 사용: 사용자들이 간편하게 챗 지피티를 사용할 수 있도록 미리 정의된 프롬프트를 제공합니다. 이를 통해 사용자는 쉽게 지피티와 대화를 나눌 수 있습니다.
- 다양한 언어로 번역 기능: 다양한 언어 챗 지피티의 답변을 받아 사용자에게 제공합니다. 이를 통해 사용자들이 손쉽게 지피티와 다양한 언어로 대화를 나눌 수 있습니다.
- 간편 기능 제공: 요약, 계속 답변, 설명 등의 기능을 통해 사용자의 편의성을 증가시킵니다. 이를 통해 사용자는 지피티와의 대화를 보다 효율적으로 활용할 수 있습니다
- 대화내용 공유: 지피티와의 대화내용 공유를 통해서 자신만의 대화방법을 공유할 수 있습니다.
- 웹사이트와의 연동: [ZippyZiggy](https://zippyziggy.kr/)웹사이트와 확장프로그램의 계정을 연동할 수 있습니다.


### TODO
- 간편 명령 기능을 커스텀할 수 있는 기능 추가(현재는 기본 고정 명령만 존재)
- 확장프로그램을 통해서 바로 프롬프트를 생성할 수 있게 함
- 내가 작성한 질문을 클립보드에 저장할 수 있는 기능 구현
- ZippyZiggy에서 제공하는 프롬프트를 사용했던 대화 목록에는 프롬프트 상세 링크 버튼을 구현

## 👬 팀 구성
<table>
  <tr>
   <td align="center"><p>FE(웹, 앱)</p><a href="https://github.com/Choihyoungkyu"><img
   src="https://avatars.githubusercontent.com/Choihyoungkyu" width="100px;" alt=""/>
    <br /><sub><b>Choihyoungkyu</b><br></sub></a></td>
    <td align="center"><p>FE(웹, 성능측정)</p><a href="https://github.com/heisje"><img src="https://avatars.githubusercontent.com/heisje" width="100px;" alt=""/>
   <br /><sub><b>heeje</b><br></sub></a></td>
   <td align="center"><p>FE(확장)</p><a href="https://github.com/ChangJuneKim"><img src="https://avatars.githubusercontent.com/ChangJuneKim" width="100px;" alt=""/>
   <br /><sub><b>ChangJuneKim</b><br></sub></a></td>
   <td align="center"><p>BE</p><a href="https://github.com/dltkdcks456"><img src="https://avatars.githubusercontent.com/dltkdcks456" width="100px;" alt=""/>
   <br /><sub><b>Lee Sangchan</b><br></sub></a></td>
   <td align="center"><p>BE</p><a href="https://github.com/bbookng"><img src="https://avatars.githubusercontent.com/bbookng" width="100px;" alt=""/>
   <br /><sub><b>bbookng</b><br></sub></a></td>
   <td align="center"><p>BE</p><a href="https://github.com/EZ-000"><img src="https://avatars.githubusercontent.com/EZ-000" width="100px;" alt=""/>
   <br /><sub><b>EZ-000</b><br></sub></a></td>
  </tr>
</table>

## 확장프로그램 <a name="installation"></a>
확장 프로그램을 설치해서 사용해보세요.  [Installation link](https://chrome.google.com/webstore/detail/%EC%A7%80%ED%94%BC%EC%A7%80%EA%B8%B0-chatgpt-%ED%99%95%EC%9E%A5%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8/gcinlhaphmofekpjjjcnbiigbgnffokc?hl=ko)