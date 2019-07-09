-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: recycling
-- ------------------------------------------------------
-- Server version	5.6.44

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
-- Table structure for table `alarms`
--

DROP TABLE IF EXISTS `alarms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alarms` (
  `alarms_index` int(11) NOT NULL,
  `ticket_id` varchar(100) DEFAULT NULL,
  `is_complete` tinyint(4) DEFAULT '0',
  `last_date` datetime DEFAULT NULL,
  PRIMARY KEY (`alarms_index`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarms`
--

LOCK TABLES `alarms` WRITE;
/*!40000 ALTER TABLE `alarms` DISABLE KEYS */;
/*!40000 ALTER TABLE `alarms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `company_name` varchar(400) NOT NULL,
  `company_addr` varchar(400) NOT NULL,
  `company_contact` int(11) NOT NULL,
  `company_type` varchar(300) NOT NULL,
  `company_material_type` varchar(300) NOT NULL,
  PRIMARY KEY (`company_id`),
  UNIQUE KEY `companies_contact_UNIQUE` (`company_contact`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'allbaro','seoul',10,'emitter','plastic'),(2,'fds','seoul',12312,'handler','plastic'),(3,'q','seoul',123124,'conveyancer','');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` varchar(100) NOT NULL,
  `user_pw` varchar(300) NOT NULL,
  `user_type` varchar(100) NOT NULL,
  `companies_id` int(11) NOT NULL,
  `user_contact` int(11) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `companies_id_idx` (`companies_id`),
  CONSTRAINT `companies_id` FOREIGN KEY (`companies_id`) REFERENCES `companies` (`company_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('user','2d6aa48bb2c481c28357ffdb48166424','emitter',1,10123,'user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wastes`
--

DROP TABLE IF EXISTS `wastes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wastes` (
  `waste_code` varchar(100) NOT NULL,
  `waste_type` varchar(300) NOT NULL,
  `waste_state` varchar(45) NOT NULL,
  `waste_classify` varchar(45) DEFAULT NULL,
  `waste_handler` varchar(400) NOT NULL,
  `waste_handler_condition` varchar(45) NOT NULL,
  `waste_handle_method` varchar(400) NOT NULL,
  `waste_conveyancer` varchar(400) NOT NULL,
  `waste_conveyancer_condition` varchar(45) NOT NULL,
  `eform_type` varchar(100) NOT NULL,
  PRIMARY KEY (`waste_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wastes`
--

LOCK TABLES `wastes` WRITE;
/*!40000 ALTER TABLE `wastes` DISABLE KEYS */;
INSERT INTO `wastes` VALUES ('1','plastic','solid',NULL,'fds','fine','melting','q','fine','electronic');
/*!40000 ALTER TABLE `wastes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-09 18:26:42
