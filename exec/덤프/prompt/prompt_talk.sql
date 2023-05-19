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
-- Table structure for table `talk`
--

DROP TABLE IF EXISTS `talk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talk` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hit` bigint DEFAULT NULL,
  `like_cnt` bigint DEFAULT NULL,
  `member_uuid` binary(16) NOT NULL,
  `reg_dt` datetime(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `prompt_uuid` bigint DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK57bmj8y0y2s8jtmlsvnsu1r0u` (`prompt_uuid`),
  CONSTRAINT `FK57bmj8y0y2s8jtmlsvnsu1r0u` FOREIGN KEY (`prompt_uuid`) REFERENCES `prompt` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talk`
--

LOCK TABLES `talk` WRITE;
/*!40000 ALTER TABLE `talk` DISABLE KEYS */;
INSERT INTO `talk` VALUES (52,18,2,_binary '¢W=\—c\ƒN;îñhéú\‚å','2023-05-17 14:00:17.668998','Ï†êÏã¨ Ï∂îÏ≤úÌååÎçï?',49,'Model: Default (GPT-3.5)'),(54,10,0,_binary '\»\Á)\È\«Mòè™©qõ¯D','2023-05-17 17:46:13.978226','AI ÏòÅÏñ¥ ÌöåÌôî ÏÑúÎπÑÏä§ ÌéòÎ•¥ÏÜåÎÇò',NULL,'Model: Default (GPT-3.5)'),(71,6,0,_binary 'Ñ\Ê˘n÷°Bºª\’J\Ÿå','2023-05-18 11:02:57.770730','Î†àÌè¨Î™¨ Ï∂îÏ≤ú: Ï∑®ÎØ∏ÏôÄ ÌäπÏßï',113,'Model: Default (GPT-3.5)'),(80,3,0,_binary 'ñ\ﬁ\‚	\0EàÇ¡\‹\Â.\Ã\¬','2023-05-18 23:59:12.031928','ÌîÑÎü∞Ìä∏ÏóîÎìú Ïú†Ïö©Ìïú ÏõπÏÇ¨Ïù¥Ìä∏',67,'Model: Default (GPT-3.5)'),(81,7,1,_binary '@\‚\«\ƒsõC¬ÜB“èM;','2023-05-19 00:38:54.538176','Î≤ÑÎ∏îÏ†ïÎ†¨ goÏñ∏Ïñ¥ (Bubble Sort Go)',80,'Model: Default (GPT-3.5)'),(82,1,0,_binary '@\‚\«\ƒsõC¬ÜB“èM;','2023-05-19 00:52:02.362655','New chat',NULL,'Model: Default (GPT-3.5)');
/*!40000 ALTER TABLE `talk` ENABLE KEYS */;
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

-- Dump completed on 2023-05-19  9:47:53
