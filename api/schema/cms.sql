-- MySQL dump 10.15  Distrib 10.0.23-MariaDB, for Linux (i686)
--
-- Host: localhost    Database: guido
-- ------------------------------------------------------
-- Server version	10.0.23-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `navigation`
--

DROP TABLE IF EXISTS `navigation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `navigation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT '0',
  `position` int(11) DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `status` enum('active','deleted') DEFAULT 'active',
  `added_on` datetime DEFAULT NULL,
  `added_by` int(11) DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `combo1` (`parent`,`position`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navigation`
--

LOCK TABLES `navigation` WRITE;
/*!40000 ALTER TABLE `navigation` DISABLE KEYS */;
INSERT INTO `navigation` VALUES (1,0,0,'Top Level','active',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `navigation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `closed_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `closed_on` (`closed_on`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,1,'13e44c35-3bbf-4554-a535-10396c7e8e5d','2016-04-24 15:43:32','2016-05-06 18:38:05'),(2,1,'2ee23ff7-364f-4c77-b718-4db0b67219e4','2016-04-24 15:47:46','2016-05-06 18:38:05'),(3,1,'daf84b7f-1f0a-4377-947d-04b6d4da0dd4','2016-05-02 20:25:49','2016-05-06 18:38:05'),(4,1,'222f520b-4184-4f45-9c8a-9abcde928fb8','2016-05-03 00:48:06','2016-05-06 18:38:05'),(5,1,'ea8b209d-d7f7-474f-ac9d-f99119ad80ac','2016-05-03 00:48:55','2016-05-06 18:38:05'),(6,1,'95548541-810a-4f99-9320-47a4623a2809','2016-05-03 22:45:43','2016-05-06 18:38:05'),(7,1,'8fb661f3-81e2-459f-8c42-3e775b2954ab','2016-05-03 22:49:06','2016-05-06 18:38:05'),(8,1,'f86259b9-e60a-49dd-be6b-0b20f232b8c5','2016-05-03 22:58:44','2016-05-06 18:38:05'),(9,1,'03de2b5b-7543-4edd-ad8d-edea945ca498','2016-05-03 23:00:08','2016-05-06 18:38:05'),(10,1,'aad5bd3b-6e1a-4257-a0e1-7510bbb08cef','2016-05-03 23:05:16','2016-05-06 18:38:05'),(11,1,'114ae12c-80d8-4541-b197-b92abe958ca4','2016-05-03 23:11:36','2016-05-06 18:38:05'),(12,1,'46b2bac1-e9dc-4f47-bf02-ed1d076479a3','2016-05-03 23:32:23','2016-05-06 18:38:05'),(13,1,'a51aa496-2262-4a7a-b8b4-4436e672703c','2016-05-03 23:37:25','2016-05-06 18:38:05'),(14,1,'88257efb-980f-481e-a27c-9aaea4e9c187','2016-05-03 23:40:13','2016-05-06 18:38:05'),(15,1,'aeac30c9-f363-41af-8a83-05fefe271f20','2016-05-03 23:42:05','2016-05-06 18:38:05'),(16,1,'e11e71c6-7252-48b5-ba00-35c3d47f7ffc','2016-05-03 23:43:09','2016-05-06 18:38:05'),(17,1,'9c6aedbc-d547-42f8-8571-2a3702647a1d','2016-05-03 23:43:19','2016-05-06 18:38:05'),(18,1,'0e74071a-6113-4f0b-ba51-4618de6d7a79','2016-05-03 23:43:54','2016-05-06 18:38:05'),(19,1,'4029eeb2-3512-4cb0-8560-5bcb95663816','2016-05-03 23:51:12','2016-05-06 18:38:05'),(20,1,'681cf73e-fece-4305-ad7a-cf6f362843d9','2016-05-03 23:52:43','2016-05-06 18:38:05'),(21,1,'fd0e3e12-ef6c-479a-b2e3-5b5c00f4d4e0','2016-05-03 23:54:20','2016-05-06 18:38:05'),(22,1,'4bc50c2b-2191-42a0-bfac-78f256be116b','2016-05-04 00:02:28','2016-05-06 18:38:05'),(23,1,'86398799-354d-44d6-b64a-9f6aed8ac9f9','2016-05-04 00:02:44','2016-05-06 18:38:05'),(24,1,'7b6efefc-372b-4e0b-beb9-11e2b7a7471f','2016-05-04 21:31:39','2016-05-06 18:38:05'),(25,1,'ffba8105-afea-46c8-979d-f9ae53a274d3','2016-05-05 22:40:50','2016-05-06 18:38:05'),(26,1,'e7baeb5b-a0e9-4a3d-ae96-b42f2f07b8fb','2016-05-06 11:55:33','2016-05-06 18:38:05'),(27,1,'838065fa-51bd-4bb3-a99b-d55fe022672d','2016-05-06 18:38:05',NULL);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `gid` int(11) DEFAULT '0',
  `status` enum('active','replaced','deleted') DEFAULT 'active',
  `added_on` datetime DEFAULT NULL,
  `added_by` int(11) DEFAULT '0',
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `gid` (`gid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploads`
--

LOCK TABLES `uploads` WRITE;
/*!40000 ALTER TABLE `uploads` DISABLE KEYS */;
/*!40000 ALTER TABLE `uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `locale` varchar(255) DEFAULT 'en_US',
  `status` enum('active','locked','deleted') DEFAULT 'active',
  `added_on` datetime DEFAULT NULL,
  `added_by` int(10) unsigned DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `deleted_by` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','*071C4FE265E0C274048D6335D13DED36B53342F3','','en_US','active','2016-04-18 18:20:14',1,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `versions`
--

DROP TABLE IF EXISTS `versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `versions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `added_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `versions`
--

LOCK TABLES `versions` WRITE;
/*!40000 ALTER TABLE `versions` DISABLE KEYS */;
INSERT INTO `versions` VALUES (1,'2016-04-24 12:00:00');
/*!40000 ALTER TABLE `versions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-07  0:54:31
