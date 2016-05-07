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
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'inactive',
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'Afrikaans','Afrikaans','af_ZA','inactive'),(2,'Akan','Akan','ak_GH','inactive'),(3,'አማርኛ','Amharic','am_ET','inactive'),(4,'العربية‎','Arabic','ar_SA','inactive'),(5,'Kipare','Asu','asa_TZ','inactive'),(6,'অসমীয়া','Assamese','as_IN','inactive'),(7,'Azərbaycanca','Azerbaijani','az_AZ','inactive'),(8,'Беларуская','Belarusian','be_BY','inactive'),(9,'Ichibemba','Bemba','bem_ZM','inactive'),(10,'Hibena','Bena','bez_TZ','inactive'),(11,'Български','Bulgarian','bg_BG','inactive'),(12,'Bamanakan','Bambara','bm_ML','inactive'),(13,'বাংলা','Bengali','bn_BD','inactive'),(14,'པོད་སྐད','Tibetan','bo_CN','inactive'),(15,'Bosanski','Bosnian','bs_BA','inactive'),(16,'Breton','Breton','br_FR','inactive'),(17,'Català','Catalan','ca_ES','inactive'),(18,'Rukiga','Chiga','cgg_UG','inactive'),(19,'ᏣᎳᎩ','Cherokee','chr_US','inactive'),(20,'čeština','Czech','cs_CZ','inactive'),(21,'Cymraeg','Welsh','cy_GB','inactive'),(22,'Dansk','Danish','da_DK','inactive'),(23,'Kitaita','Taita','dav_KE','inactive'),(24,'Deutsch','German','de_DE','inactive'),(25,'Kĩembu','Embu','ebu_KE','inactive'),(26,'Eʋegbe','Ewe','ee_GH','inactive'),(27,'Ελληνικά','Greek','el_GR','inactive'),(28,'English (UK)','English (UK)','en_GB','inactive'),(29,'English (US)','English (US)','en_US','active'),(30,'Esperanto','Esperanto','eo_EO','inactive'),(31,'Español','Spanish','es_ES','inactive'),(32,'Eesti','Estonian','et_EE','inactive'),(33,'Euskara','Basque','eu_ES','inactive'),(34,'‎فارسی‎','Persian','fa_IR','inactive'),(35,'Pulaar','Fulah','ff_SN','inactive'),(36,'Suomi','Finnish','fi_FI','inactive'),(37,'Filipino','Filipino','fil_PH','inactive'),(38,'Føroyskt','Faroese','fo_FO','inactive'),(39,'Français','French','fr_FR','inactive'),(40,'Gaeilge','Irish','ga_IE','inactive'),(41,'Galego','Galician','gl_ES','inactive'),(42,'ગુજરાતી','Gujarati','gu_IN','inactive'),(43,'Ekegusii','Gusii','guz_KE','inactive'),(44,'Gaelg','Manx','gv_GB','inactive'),(45,'Hausa','Hausa','ha_GH','inactive'),(46,'ʻōlelo Hawaiʻi','Hawaiian','haw_US','inactive'),(47,'‎עברית','Hebrew','he_IL','inactive'),(48,'हिन्दी','Hindi','hi_IN','inactive'),(49,'Hrvatski','Croatian','hr_HR','inactive'),(50,'Magyar','Hungarian','hu_HU','inactive'),(51,'Հայերէն','Armenian','hy_AM','inactive'),(52,'Bahasa Indonesia','Indonesian','id_ID','inactive'),(53,'Igbo','Igbo','ig_NG','inactive'),(54,'ꆈꌠꉙ','Sichuan Yi','ii_CN','inactive'),(55,'íslenska','Icelandic','is_IS','inactive'),(56,'Italiano','Italian','it_IT','inactive'),(57,'日本語','Japanese','ja_JP','inactive'),(58,'Kimachame','Machame','jmc_TZ','inactive'),(59,'Taqbaylit','Kabyle','kab_DZ','inactive'),(60,'ქართული','Georgian','ka_GE','inactive'),(61,'Kikamba','Kamba','kam_KE','inactive'),(62,'Chimakonde','Makonde','kde_TZ','inactive'),(63,'Kabuverdianu','Kabuverdianu','kea_CV','inactive'),(64,'Koyra ciini','Koyra Chiini','khq_ML','inactive'),(65,'Gikuyu','Kikuyu','ki_KE','inactive'),(66,'Қазақ','Kazakh','kk_KZ','inactive'),(67,'Kalaallisut','Kalaallisut','kl_GL','inactive'),(68,'Kalenjin','Kalenjin','kln_KE','inactive'),(69,'ភាសាខ្មែរ','Khmer','km_KH','inactive'),(70,'ಕನ್ನಡ','Kannada','kn_IN','inactive'),(71,'कोंकणी','Konkani','kok_IN','inactive'),(72,'한국어','Korean','ko_KR','inactive'),(73,'Kishambaa','Shambala','ksb_TZ','inactive'),(74,'Кыргыз','Kyrgyz','ky_KG','inactive'),(75,'kernewek','Cornish','kw_GB','inactive'),(76,'Kɨlaangi','Langi','lag_TZ','inactive'),(77,'Luganda','Ganda','lg_UG','inactive'),(78,'ລາວ','Lao','lo_LA','inactive'),(79,'Lietuvių','Lithuanian','lt_LT','inactive'),(80,'Dholuo','Luo','luo_KE','inactive'),(81,'Luluhia','Luyia','luy_KE','inactive'),(82,'Latviešu','Latvian','lv_LV','inactive'),(83,'Maa','Masai','mas_TZ','inactive'),(84,'Kĩmĩrũ','Meru','mer_KE','inactive'),(85,'kreol morisien','Morisyen','mfe_MU','inactive'),(86,'Malagasy','Malagasy','mg_MG','inactive'),(87,'Македонски','Macedonian','mk_MK','inactive'),(88,'Монгол','Mongolian','mn_MN','inactive'),(89,'മലയാളം','Malayalam','ml_IN','inactive'),(90,'मराठी','Marathi','mr_IN','inactive'),(91,'Bahasa Melayu','Malay','ms_MY','inactive'),(92,'Malti','Maltese','mt_MT','inactive'),(93,'ဗမာ','Burmese','my_MM','inactive'),(94,'Khoekhoegowab','Nama','naq_NA','inactive'),(95,'Norsk bokmål','Norwegian Bokmål','nb_NO','inactive'),(96,'isiNdebele','North Ndebele','nd_ZW','inactive'),(97,'नेपाली','Nepali','ne_NP','inactive'),(98,'Nederlands','Dutch','nl_NL','inactive'),(99,'Nynorsk','Norwegian Nynorsk','nn_NO','inactive'),(100,'Runyankore','Nyankole','nyn_UG','inactive'),(101,'Oromoo','Oromo','om_ET','inactive'),(102,'ଓଡ଼ିଆ','Oriya','or_IN','inactive'),(103,'ਪੰਜਾਬੀ ','Punjabi','pa_PK','inactive'),(104,'Polski','Polish','pl_PL','inactive'),(105,'‎پښتو','Pashto','ps_AF','inactive'),(106,'Português','Portuguese','pt_PT','inactive'),(107,'Rumantsch','Romansh','rm_CH','inactive'),(108,'Kihorombo','Rombo','rof_TZ','inactive'),(109,'Română','Romanian','ro_RO','inactive'),(110,'Русский','Russian','ru_RU','inactive'),(111,'Kinyarwanda','Kinyarwanda','rw_RW','inactive'),(112,'Kiruwa','Rwa','rwk_TZ','inactive'),(113,'Kisampur','Samburu','saq_KE','inactive'),(114,'Sena','Sena','seh_MZ','inactive'),(115,'Koyraboro Senni','Koyraboro Senni','ses_ML','inactive'),(116,'Sängö','Sango','sg_CF','inactive'),(117,'ⵜⴰⵎⴰⵣⵉⵖⵜ','Tachelhit','shi_MA','inactive'),(118,'සිංහල','Sinhala','si_LK','inactive'),(119,'Slovenčina','Slovak','sk_SK','inactive'),(120,'Slovenščina','Slovenian','sl_SI','inactive'),(121,'chiShona','Shona','sn_ZW','inactive'),(122,'Soomaali','Somali','so_SO','inactive'),(123,'Shqipe','Albanian','sq_AL','inactive'),(124,'Српски','Serbian','sr_RS','inactive'),(125,'Яvenska','Swedish','sv_SE','inactive'),(126,'Kenya','Swahili','sw_KE','inactive'),(127,'தமிழ்','Tamil','ta_LK','inactive'),(128,'తెలుగు','Telugu','te_IN','inactive'),(129,'Kiteso','Teso','teo_UG','inactive'),(130,'ไทย','Thai','th_TH','inactive'),(131,'ትግርኛ','Tigrinya','ti_ET','inactive'),(132,'lea fakatonga','Tonga','to_TO','inactive'),(133,'Türkçe','Turkish','tr_TR','inactive'),(134,'Tamaziɣt','Tamazight','tzm_MA','inactive'),(135,'Uyghur','Uyghur','ug_CN','inactive'),(136,'Українська','Ukrainian','uk_UA','inactive'),(137,'‎اردو','Urdu','ur_PK','inactive'),(138,'O\'zbekcha','Uzbek','uz_UZ','inactive'),(139,'Tiếng Việt','Vietnamese','vi_VN','inactive'),(140,'Kyivunjo','Vunjo','vun_TZ','inactive'),(141,'Olusoga','Soga','xog_UG','inactive'),(142,'Èdè Yorùbá','Yoruba','yo_NG','inactive'),(143,'中文','Chinese (Simplified)','zh_CN','inactive'),(144,'繁體中文','Chinese (Traditional)','zh_TW','inactive'),(145,'isiZulu','Zulu','zu_ZA','inactive');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,0,0,'Top Level','active',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,1,'cad84d47-b737-499c-80fd-b4af3054a716','2016-05-07 21:26:37',NULL);
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

-- Dump completed on 2016-05-07 22:15:27
