-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: employee_task_management
-- ------------------------------------------------------
-- Server version	8.0.40

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

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Employee') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rima Pawar','rima@gmail.com','$2b$10$4i4ThwZin.QKxPOPZu.x..d2GUusAczOp1/Feaw.v4RVLejvPpl5W','Admin','2026-07-03 16:15:31'),(2,'Suraj Pawar','suraj@gmail.com','$2b$10$JNHvk0d6IhbJi0mYqU8Oqekxcoppva/tKhBV0hWun2PuiI9APrlMe','Employee','2026-07-04 18:09:29'),(3,'aarya','aarya@gmail.com','$2b$10$JNHvk0d6IhbJi0mYqU8Oqekxcoppva/tKhBV0hWun2PuiI9APrlMe','Employee','2026-07-04 18:09:29'),(4,'Isha','Isha@gmail.com','$2b$10$JNHvk0d6IhbJi0mYqU8Oqekxcoppva/tKhBV0hWun2PuiI9APrlMe','Employee','2026-07-04 18:09:29'),(5,'Tushar','Tushar@gmail.com','$2b$10$JNHvk0d6IhbJi0mYqU8Oqekxcoppva/tKhBV0hWun2PuiI9APrlMe','Employee','2026-07-04 18:09:29'),(6,'Shivani','Shivani@gmail.com','$2b$10$JNHvk0d6IhbJi0mYqU8Oqekxcoppva/tKhBV0hWun2PuiI9APrlMe','Employee','2026-07-04 18:09:29'),(7,'Aditee','Aditee@gmail.com','$2b$10$JNHvk0d6IhbJi0mYqU8Oqekxcoppva/tKhBV0hWun2PuiI9APrlMe','Employee','2026-07-04 18:09:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-05 15:16:42
