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
-- Table structure for table `talk_comment`
--

DROP TABLE IF EXISTS `talk_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talk_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `member_uuid` binary(16) NOT NULL,
  `reg_dt` datetime(6) NOT NULL,
  `upd_dt` datetime(6) DEFAULT NULL,
  `talk_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKapbokgmtd6ys77rp970ghsh3u` (`talk_id`),
  CONSTRAINT `FKapbokgmtd6ys77rp970ghsh3u` FOREIGN KEY (`talk_id`) REFERENCES `talk` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talk_comment`
--

LOCK TABLES `talk_comment` WRITE;
/*!40000 ALTER TABLE `talk_comment` DISABLE KEYS */;
INSERT INTO `talk_comment` VALUES (2,'그래서 무엇을 드셨나용 ?',_binary '��>��H��\�u�aA�9','2023-05-17 16:27:01.518475','2023-05-17 16:27:01.518484',52),(3,'우와 유익한 프롬프트에요!! 저도 활용해볼게요!!',_binary '�\�\�	\0E���\�\�.\�\�','2023-05-17 21:04:33.086633','2023-05-17 21:04:33.086638',54),(4,'와오11',_binary '�Bh\�\�ULq�\�@W\���\�','2023-05-17 22:07:26.267805','2023-05-17 22:07:26.267808',54);
/*!40000 ALTER TABLE `talk_comment` ENABLE KEYS */;
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
