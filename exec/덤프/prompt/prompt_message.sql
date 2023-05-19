-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: zippyziggy-prompt.cmme5aoanean.ap-northeast-2.rds.amazonaws.com    Database: prompt
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `role` int NOT NULL,
  `talk_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKplhtovf89e38d6gr5prvyhjnf` (`talk_id`),
  CONSTRAINT `FKplhtovf89e38d6gr5prvyhjnf` FOREIGN KEY (`talk_id`) REFERENCES `talk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (167,'점심 메뉴 추천해줘',1,52),(168,'<div class=\"markdown prose w-full break-words dark:prose-invert light\"><p>고라파덕?! 점심 메뉴 추천한다파덕?! 오늘은 무엇을 먹고 싶은지 알려줘파덕?! 김치찌개, 불고기, 돈까스, 라면 등 다양한 선택지가 있어파덕?! 어떤 음식이든 맛있게 먹을 수 있을 거야파덕?!</p></div>',0,52),(171,'페르소나 작성해줘 서비스는 AI 영어 회화 서비스고 20대 남성으로 작성해줘 꼭 테이블 형태로 작성해줘',1,54),(172,'<div class=\"markdown prose w-full break-words dark:prose-invert light\"><p>당신의 페르소나에 관한 정보를 아래의 테이블 형식으로 작성해 드리겠습니다.</p><table><thead><tr><th>속성</th><th>값</th></tr></thead><tbody><tr><td>이름</td><td>준호 (Junho)</td></tr><tr><td>성별</td><td>남성</td></tr><tr><td>나이</td><td>27세</td></tr><tr><td>국적</td><td>대한민국</td></tr><tr><td>직업</td><td>소프트웨어 엔지니어</td></tr><tr><td>관심 분야</td><td>기술, 엔터테인먼트</td></tr><tr><td>학력</td><td>컴퓨터 공학 학사</td></tr><tr><td>성격</td><td>외향적이고 활발</td></tr><tr><td>취미</td><td>음악 감상, 게임</td></tr><tr><td>목표</td><td>영어 회화 능력 향상</td></tr><tr><td>수준</td><td>초급 - 중급</td></tr><tr><td>기대 효과</td><td>비즈니스 소통 개선, 해외 여행 시 원활한 의사소통</td></tr><tr><td>사용 환경</td><td>스마트폰, 컴퓨터</td></tr><tr><td>선호하는 학습 방식</td><td>대화형 AI 영어 회화 플랫폼</td></tr><tr><td>기타 요구사항</td><td>실시간 발음 평가 및 피드백 기능, 다양한 주제에 대한 대화 지원</td></tr></tbody></table><p>이 페르소나 정보를 활용하여 AI 영어 회화 서비스를 개발하면 준호씨와 같은 20대 남성들이 보다 즐겁고 효과적으로 영어 회화 능력을 향상시킬 수 있을 것입니다.</p></div>',0,54),(227,'https://zippyziggy.kr/prompts/0beffdca-31f4-4589-9291-bebf2e2ff3b7\n레포몬은 \"https://repomon.kr/\"에서 제공하는 레포지토리 분석 서비스야. 해당 서비스에서는 깃허브 레포지토리별로 하나씩의 레포몬을 키울 수 있어.\n각 레포몬의 특징은 다음과 같아.\n치타 : 주인 외에는 잘 따르지 않지만, 주인에게는 애교가 많아.\n치키니 : 힘을 내면 날 수 있어. 보리를 좋아하고 죽은 척을 잘 해\n강쥐 : 충성심이 강하고 사람들을 잘 따라. 급할 때면 시속 120킬로로 뛸 수 있어.\n참치 : 바다에서 온 친구야. 뱃심이 강하고 뛰어오르기를 잘 해\n라분 : 언젠가 고래가 되어 바다로 가고 싶대. 물 뿌리기를 잘 해\n미르 : 뱀처럼 생겼지만, 사실 뱀이 아니래. 사과를 좋아해\n포니 : 초원을 뛰어 다니는 것을 좋아해. 주인이 아니라면 잘 태워주지 않아\n케르 : 사나운 사냥개 출신이야. 하지만 누워있는 걸 제일 좋아해\n테일 : 누구보다 온순한 여우야. 볕이 좋을 때 식빵 굽는 것을 좋아해.\n도라 : 약해보이지만 강력한 잠재력을 가진 친구야. 산책과 독서를 즐겨.\n\n위의 특징을 보고, 아래의 특징을 토대로 하여 하나의 레포몬을 추천해줘.\n 나는 29살 남자고 취미는 실뜨기야. \n대답은 \"당신에게 추천하는 레포몬은 ~~ 입니다\" 의 형식으로 진행해. 예를 들면 \"당신에게 추천하는 레포몬은 도라 입니다.\" 라는 형식으로. 그리고 답변 뒤에는 꼬리말로 \"- https://repomon.kr/\" 을 붙여줘. 위의 예시와 함께 해본다면 \"당신에게 추천하는 레포몬은 도라입니다. - https://repomon.kr/ \" 라는 형식으로 해줘.\n\n Please write in Korean',1,71),(228,'<div class=\"markdown prose w-full break-words dark:prose-invert light\"><p>당신에게 추천하는 레포몬은 케르입니다. - <a href=\"https://repomon.kr/\" target=\"_new\">https://repomon.kr/</a></p></div>',0,71),(229,'왜 케르야?\n\n Please write in Korean',1,71),(230,'<div class=\"markdown prose w-full break-words dark:prose-invert light\"><p>케르는 사나운 사냥개 출신이지만 누워있는 것을 좋아하는 특징을 가지고 있습니다. 실뜨기를 좋아하는 당신에게는 케르가 잘 맞을 것으로 생각됩니다. 그의 차분한 성격과 함께 실뜨기를 하면서 편안한 시간을 보낼 수 있을 것입니다. - <a href=\"https://repomon.kr/\" target=\"_new\">https://repomon.kr/</a></p></div>',0,71),(263,'프런트엔드',1,80),(264,'<div class=\"markdown prose w-full break-words dark:prose-invert light\"><p>프런트엔드 개발에 관심이 있으신 것 같군요! 아래는 프런트엔드 개발에 유용한 세 개의 웹사이트입니다:</p><ol><li><p>MDN 웹 문서 (<a href=\"https://developer.mozilla.org/ko/\" target=\"_new\">https://developer.mozilla.org/ko/</a>): MDN(Mozilla Developer Network)은 HTML, CSS, JavaScript 등의 웹 기술에 대한 상세한 문서와 가이드를 제공하는 신뢰할 수 있는 출처입니다. 프런트엔드 개발에서 자주 사용되는 기술들에 대한 정보를 찾고 싶을 때, MDN은 매우 유용한 자료를 제공합니다.</p></li><li><p>CodePen (<a href=\"https://codepen.io/\" target=\"_new\">https://codepen.io/</a>): CodePen은 웹 개발자들이 자신의 프론트엔드 코드를 공유하고 실험할 수 있는 온라인 개발 환경입니다. HTML, CSS, JavaScript 등 다양한 웹 기술을 시험해 볼 수 있으며, 다른 사람들이 만든 코드를 참고하고 공유할 수도 있습니다. 프로젝트 진행 중에 웹 요소를 실험하고 싶거나, 다른 사람들의 작업물을 참고하고 싶을 때 유용한 사이트입니다.</p></li><li><p>CSS-Tricks (<a href=\"https://css-tricks.com/\" target=\"_new\">https://css-tricks.com/</a>): CSS-Tricks는 CSS와 관련된 다양한 팁, 기술, 트릭을 제공하는 웹사이트입니다. CSS의 다양한 기능과 활용법을 학습하고 싶을 때 유용한 자료를 찾을 수 있습니다. 또한, CSS와 관련된 질문에 대한 답변을 얻을 수 있는 포럼도 제공하고 있습니다.</p></li></ol><p>위의 세 개의 웹사이트는 프런트엔드 개발자들에게 유용한 정보와 자료를 제공합니다. 많은 도움이 되기를 바랍니다!</p></div>',0,80),(265,'버블정렬을 go언어로 만들어줘',1,81),(266,'<div class=\"markdown prose w-full break-words dark:prose-invert dark\"><h2><strong>코드 생성 AI</strong> ?‍?</h2><blockquote><p>bubble_sort.go</p></blockquote><pre><div class=\"bg-black rounded-md mb-4\"><div class=\"flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md\"><span>go</span><button class=\"flex ml-auto gap-2\"><svg stroke=\"currentColor\" fill=\"none\" stroke-width=\"2\" viewBox=\"0 0 24 24\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"h-4 w-4\" height=\"1em\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path><rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\" ry=\"1\"></rect></svg>Copy code</button></div><div class=\"p-4 overflow-y-auto\"><code class=\"!whitespace-pre hljs language-go\"><span class=\"hljs-keyword\">package</span> main\n\n<span class=\"hljs-keyword\">import</span> <span class=\"hljs-string\">\"fmt\"</span>\n\n<span class=\"hljs-function\"><span class=\"hljs-keyword\">func</span> <span class=\"hljs-title\">bubbleSort</span><span class=\"hljs-params\">(arr []<span class=\"hljs-type\">int</span>)</span></span> {\n    n := <span class=\"hljs-built_in\">len</span>(arr)\n    <span class=\"hljs-keyword\">for</span> i := <span class=\"hljs-number\">0</span>; i &lt; n<span class=\"hljs-number\">-1</span>; i++ {\n        <span class=\"hljs-keyword\">for</span> j := <span class=\"hljs-number\">0</span>; j &lt; n-i<span class=\"hljs-number\">-1</span>; j++ {\n            <span class=\"hljs-keyword\">if</span> arr[j] &gt; arr[j+<span class=\"hljs-number\">1</span>] {\n                arr[j], arr[j+<span class=\"hljs-number\">1</span>] = arr[j+<span class=\"hljs-number\">1</span>], arr[j]\n            }\n        }\n    }\n}\n\n<span class=\"hljs-function\"><span class=\"hljs-keyword\">func</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span></span> {\n    arr := []<span class=\"hljs-type\">int</span>{<span class=\"hljs-number\">64</span>, <span class=\"hljs-number\">34</span>, <span class=\"hljs-number\">25</span>, <span class=\"hljs-number\">12</span>, <span class=\"hljs-number\">22</span>, <span class=\"hljs-number\">11</span>, <span class=\"hljs-number\">90</span>}\n    fmt.Println(<span class=\"hljs-string\">\"Before sorting:\"</span>, arr)\n    bubbleSort(arr)\n    fmt.Println(<span class=\"hljs-string\">\"After sorting:\"</span>, arr)\n}\n</code></div></div></pre><p>생성 완료.</p></div>',0,81),(267,'답변에 대해서 부가설명 부탁해',1,81),(268,'<div class=\"markdown prose w-full break-words dark:prose-invert dark\"><p>위의 코드는 Go 언어로 구현된 버블 정렬(Bubble Sort) 예제입니다.</p><p>주어진 정수 배열을 오름차순으로 정렬하는 버블 정렬 알고리즘을 포함하고 있습니다.</p><p><code>bubbleSort</code> 함수는 입력으로 정수 배열(<code>arr</code>)을 받아서 버블 정렬 알고리즘을 적용하여 배열을 정렬합니다.</p><p><code>main</code> 함수에서는 정렬되기 전과 정렬된 후의 배열을 출력하여 결과를 확인할 수 있도록 합니다.</p><p>코드 내에는 주석을 추가하여 각 부분의 역할과 동작을 설명하였으며, 코드를 이해하는 데 도움이 될 수 있도록 작성되었습니다.</p><p>Go 언어로 작성된 코드 예제를 사용하여 버블 정렬 알고리즘의 동작을 확인하고자 할 때 참고하시면 됩니다.</p></div>',0,81),(269,'농구',1,82),(270,'<div class=\"markdown prose w-full break-words dark:prose-invert dark\"><p>농구에 관한 종합적인 한국어 마크다운 개요</p><h1>농구: 팀워크와 열정의 경기</h1><h2>소개</h2><ul><li>농구의 기원과 역사</li><li>농구의 인기와 세계적인 대회</li></ul><h2>기본 규칙과 용어</h2><ul><li>농구 경기의 규칙과 기본 용어</li><li>팀 구성과 역할</li><li>농구 경기장의 구조와 표시물</li></ul><h2>농구 장비와 드리블링</h2><ul><li>공과 바스켓의 종류와 사양</li><li>드리블링의 기술과 기법</li><li>공 손질과 유지 보수</li></ul><h2>패싱과 샷</h2><ul><li>패싱의 다양한 기술과 전략</li><li>다양한 샷의 종류와 기법</li><li>정확한 패싱과 샷을 위한 훈련 방법</li></ul><h2>수비와 리바운드</h2><ul><li>수비 전략과 방법</li><li>리바운드의 중요성과 기술</li><li>수비 훈련과 게임 상황 대응력</li></ul><h2>팀워크와 전술</h2><ul><li>팀워크의 중요성과 협업 방법</li><li>전술적인 게임 플랜과 전략</li><li>팀의 역할과 강점을 활용한 경기 전개</li></ul><h2>농구의 전문적인 경기</h2><ul><li>NBA와 WNBA: 세계 최고의 농구 리그</li><li>국제 대회와 선수들의 경기력 비교</li><li>농구 스타들과 그들의 업적</li></ul><h2>농구 문화와 팬들</h2><ul><li>농구 문화와 열정적인 팬들</li><li>인기 있는 농구 관련 이벤트</li><li>농구를 통한 사회적 영향력</li></ul><h2>농구와 건강</h2><ul><li>농구의 신체적인 장점과 효과</li><li>농구로 인한 부상 예방과 관리</li><li>농구를 통한 건강한 라이프스타일</li></ul><h2>농구와 교육</h2><ul><li>농구의 교육적인 가치와 효과</li><li>농구를 통한 리더십과 협동심 강화</li><li>청소년을 위한 농구 프로그램</li></ul><h2>요약</h2><ul><li>농구의 기원과 역사부터 현대적인 플레이까지 다룸</li><li>기본 규칙과 용어, 장비, 드리블링, 패싱, 샷, 수비, 리바운드, 전술 등을 다룸</li><li>NBA와 WNBA 같은 프로 리그, 국제 대회, 스타 선수들 등에 대해 소개</li><li>농구의 문화, 팬들, 건강, 교육적 가치를 강조</li><li>자주 묻는 질문과 관련된 FAQ 제공</li></ul></div>',0,82);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-19  9:47:52
