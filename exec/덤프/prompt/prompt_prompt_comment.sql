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
-- Table structure for table `prompt_comment`
--

DROP TABLE IF EXISTS `prompt_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prompt_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `member_uuid` binary(16) NOT NULL,
  `reg_dt` datetime(6) NOT NULL,
  `upd_dt` datetime(6) DEFAULT NULL,
  `prompt_uuid` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdmeb45s8qeiummmvnjxg23qls` (`prompt_uuid`),
  CONSTRAINT `FKdmeb45s8qeiummmvnjxg23qls` FOREIGN KEY (`prompt_uuid`) REFERENCES `prompt` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prompt_comment`
--

LOCK TABLES `prompt_comment` WRITE;
/*!40000 ALTER TABLE `prompt_comment` DISABLE KEYS */;
INSERT INTO `prompt_comment` VALUES (14,'ㄴ',_binary '8\�D.�L��U� �B3','2023-05-09 10:55:01.813970',NULL,30),(15,'ㄴㅁ',_binary '8\�D.�L��U� �B3','2023-05-09 10:55:01.846185',NULL,30),(16,'ㅁ',_binary '8\�D.�L��U� �B3','2023-05-09 10:55:01.878117',NULL,30),(17,'ㅁㅇ',_binary '8\�D.�L��U� �B3','2023-05-09 10:55:01.891065',NULL,30),(18,'ㅇ',_binary '8\�D.�L��U� �B3','2023-05-09 10:55:03.521546',NULL,30),(19,'ㅇㅁ',_binary '8\�D.�L��U� �B3','2023-05-09 10:55:03.525233',NULL,30),(64,'너무 귀엽다 파덕? !!! 아주 중독적이다 파덕?!!!!!!',_binary '��>��H��\�u�aA�9','2023-05-11 12:07:54.111366',NULL,49),(65,'오늘은 너무 피곤해서 \"집가고싶다\"라고 했더니\n\n\"오늘은 출근하고 나서부터 계속해서 집에 가고 싶은 생각이 들어. ???\n뭔가 힘든 하루를 보내고 나면 집에 돌아가서 편안하게 쉬고 싶은 욕구가 무척이나 강해져. ???\n마치 햇살 아래에서 피서객들이 물놀이를 즐기던 그 시간을 그리워하듯, 이제는 집으로 돌아가고 싶은 마음이 가득해. ☀️??\n그런데 아직 일도 남았고, 오늘밤에는 좀 더 노력해서 내일을 위한 일을 해야겠어. ??\n#집가고싶다 #힘든하루 #휴식이필요해 #일상 #일상스타그램 #홈스타그램 #이제일어난다 #팔로우미 #소통 #데일리 #데일리그램 #집으로가는길 #집앞바다 #일하는여자 #힘내자 #인스타그램 #instadaily #dailygram #소통해요 #좋아요 #팔로우해요\"\n\n\n라는 답변을 받았어용 ~',_binary '��>��H��\�u�aA�9','2023-05-11 12:17:36.408389','2023-05-11 12:20:38.854340',26),(67,'가라 고라파덕 ?',_binary '\�\�)\�\�M����q��D','2023-05-12 01:21:35.621150',NULL,49),(72,'내가 더 귀여워용 !!!!!! ',_binary '��kC��L#�?^Ӎ�<�','2023-05-12 21:15:34.305557',NULL,82),(74,'오늘은 금요일이라서 \"오늘은 금요일 ~\" 이라고 했더니\n\n오늘은 금요일! ?\n주말을 맞이하여 기분이 상쾌하고 설레이는 오늘, #주제에 관한 이야기를 해볼까요? ?\n어떤 주제가 궁금하신가요? 공유하고 싶은 주제가 있다면 댓글로 알려주세요! ??\n새로운 주제에 대해 함께 이야기 나누는 것은 언제나 즐겁고 흥미로운 시간이 될 것 같아요. ?✨\n주말 동안 새로운 주제에 대해 글을 작성해볼게요! 많은 사람들과 함께 즐겁게 소통하며 즐거운 주말 보내세요! ??\n#주말소통 #주말이다 #금요일 #토요일 #일요일 #주제토론 #소통 #인스타그램 #주말즐기기\n\n이라는 gpt의 답변을 받았답니댱 체고댜 체고 키키',_binary '��>��H��\�u�aA�9','2023-05-12 21:30:26.755701',NULL,26),(75,'Gpt도 체중 감량에는 유산소 운동이 최고라고 하네요 !!!!',_binary '��>��H��\�u�aA�9','2023-05-13 00:05:46.251137',NULL,62),(76,'포크해가요 ~ ❤️',_binary '��>��H��\�u�aA�9','2023-05-13 17:36:57.921636',NULL,76),(77,'묻고 더블로 가 ~',_binary '��>��H��\�u�aA�9','2023-05-13 23:50:55.456006',NULL,81),(87,'귀여워 시나모롤',_binary '�9>�#Ie�r\�\�M^��','2023-05-15 14:32:17.344474',NULL,101),(88,'귀여워 시나모롤',_binary '�9>�#Ie�r\�\�M^��','2023-05-15 14:33:34.270608',NULL,94),(89,'너무 귀여워...!',_binary 'E�KU\�KK�&�S?��','2023-05-15 14:42:30.835217','2023-05-16 00:21:22.125476',94),(90,'안녕 모롤?',_binary '��>��H��\�u�aA�9','2023-05-15 14:44:32.413090',NULL,94),(91,'저 집가도 되냐고 했는데 안된대요. 어떡해요 ? 힝구',_binary '��>��H��\�u�aA�9','2023-05-15 17:30:00.734743',NULL,102),(92,'최애 프롬프트입니다',_binary '{Y�q7\�J��\rȼ\�','2023-05-16 15:20:06.522663',NULL,49),(93,'ㅏㅣㅓㅏㅣ',_binary '�Bh\�\�ULq�\�@W\���\�','2023-05-17 04:56:50.110113',NULL,82),(96,'이거만 있으면 이제 면접 걱정은 안 해도 될 거 같아요!!!?',_binary '�W��\�OJ]�\�)l��,','2023-05-17 16:21:31.009445',NULL,107),(97,'네 공부할게용 흑흑',_binary '��>��H��\�u�aA�9','2023-05-17 16:26:19.121782',NULL,107),(98,'ㅋㅋㅋㅋㅋㅋ최고에요',_binary '�Bh\�\�ULq�\�@W\���\�','2023-05-18 10:10:45.787023',NULL,113),(99,'와 진짜 유용하고 재밌어보여요!!!!\n방구석 레포몬 전투 받습니다^^',_binary '���`�N���T�+���','2023-05-18 10:49:19.607081',NULL,113),(100,'다들 감사합니다 :)',_binary '�\��n֡B��\�J\��','2023-05-18 11:31:14.068173',NULL,113),(101,'유용하네요!',_binary 'GgV?\\A:��\�׼�o\�','2023-05-19 09:46:05.698939','2023-05-19 09:46:13.438070',67);
/*!40000 ALTER TABLE `prompt_comment` ENABLE KEYS */;
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

-- Dump completed on 2023-05-19  9:47:49
