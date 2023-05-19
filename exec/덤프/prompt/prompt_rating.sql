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
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_uuid` binary(16) NOT NULL,
  `reg_dt` datetime(6) NOT NULL,
  `score` int NOT NULL,
  `prompt_uuid` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK31qnjka11m1v3yai6iekru223` (`prompt_uuid`),
  CONSTRAINT `FK31qnjka11m1v3yai6iekru223` FOREIGN KEY (`prompt_uuid`) REFERENCES `prompt` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,_binary 'ˇBh\œ\÷ULq≥\‹@W\ﬁˇà\∆','2023-05-15 13:56:03.416890',1,49),(2,_binary 'Ùæ>ıøH∫ô\œu¿aAè9','2023-05-15 13:57:38.398295',5,49),(3,_binary '†9>˚#Ießr\ÿ\ÂM^µ§','2023-05-15 14:32:08.039837',5,101),(4,_binary 'ˇBh\œ\÷ULq≥\‹@W\ﬁˇà\∆','2023-05-15 14:53:17.389777',5,81),(5,_binary '®¿∆øzD8Æ≥\÷qˇ3“â','2023-05-15 17:48:54.438163',5,102),(6,_binary 'E∂KU\ËKKá&ªS?úû','2023-05-16 00:20:58.105356',5,88),(7,_binary 'ˇBh\œ\÷ULq≥\‹@W\ﬁˇà\∆','2023-05-16 06:44:57.094355',5,92),(8,_binary 'ø\√\ ¡¢E)æ\È|2¨AI','2023-05-17 10:00:45.261940',5,49),(9,_binary 'ô ùY\ﬂH=ΩE/œπ–ô\n','2023-05-17 15:00:59.692443',5,107),(10,_binary '°Wû\·OJ]í\‡¨)lı±,','2023-05-17 16:20:47.937776',5,107),(11,_binary 'Ùæ>ıøH∫ô\œu¿aAè9','2023-05-17 16:20:50.797550',5,107),(12,_binary '°Wû\·OJ]í\‡¨)lı±,','2023-05-17 17:48:42.862229',5,72);
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
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

-- Dump completed on 2023-05-19  9:47:51
