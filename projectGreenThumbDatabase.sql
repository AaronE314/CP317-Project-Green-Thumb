-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.3-rc-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- Author :                      Austin Bursey
-- HeidiSQL Version:             9.5.0.5261
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for projectgreenthumb
CREATE DATABASE IF NOT EXISTS `projectgreenthumb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `projectgreenthumb`;

-- Dumping structure for table projectgreenthumb.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` smallint(6) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`admin_id`),
  CONSTRAINT `FK_a_user` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.admin: ~0 rows (approximately)
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.admin_action
CREATE TABLE IF NOT EXISTS `admin_action` (
  `admin_action` enum('handled','Under Review','Not processed') NOT NULL DEFAULT 'Not processed',
  `date_handled` date DEFAULT NULL,
  PRIMARY KEY (`admin_action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.admin_action: ~0 rows (approximately)
/*!40000 ALTER TABLE `admin_action` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_action` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.admin_report
CREATE TABLE IF NOT EXISTS `admin_report` (
  `report_id` smallint(5) NOT NULL,
  `admin_id` smallint(5) NOT NULL,
  `admin_action` enum('handled','Under Review','Not processed') NOT NULL DEFAULT 'Not processed',
  PRIMARY KEY (`report_id`,`admin_id`),
  KEY `FK_admin_report_admin` (`admin_id`),
  KEY `FK_admin_report_admin_action` (`admin_action`),
  CONSTRAINT `FK_admin_report_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `FK_admin_report_admin_action` FOREIGN KEY (`admin_action`) REFERENCES `admin_action` (`admin_action`),
  CONSTRAINT `FK_admin_report_report` FOREIGN KEY (`report_id`) REFERENCES `report` (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.admin_report: ~0 rows (approximately)
/*!40000 ALTER TABLE `admin_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_report` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.banned
CREATE TABLE IF NOT EXISTS `banned` (
  `banned_id` smallint(6) NOT NULL,
  `user_id` smallint(6) NOT NULL,
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`banned_id`,`user_id`),
  KEY `FK_banned_user` (`user_id`),
  CONSTRAINT `FK_banned_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.banned: ~0 rows (approximately)
/*!40000 ALTER TABLE `banned` DISABLE KEYS */;
/*!40000 ALTER TABLE `banned` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.photo
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` smallint(6) NOT NULL,
  `plant_id` smallint(6) NOT NULL,
  `image` binary(100) NOT NULL,
  `tf_record` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `FK_photo_plant` (`plant_id`),
  CONSTRAINT `FK_photo_plant` FOREIGN KEY (`plant_id`) REFERENCES `plant` (`plant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.photo: ~0 rows (approximately)
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.plant
CREATE TABLE IF NOT EXISTS `plant` (
  `plant_id` smallint(6) NOT NULL,
  `plant_name` varchar(90) NOT NULL,
  `plant_bio` mediumtext NOT NULL,
  PRIMARY KEY (`plant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.plant: ~0 rows (approximately)
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
/*!40000 ALTER TABLE `plant` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.post
CREATE TABLE IF NOT EXISTS `post` (
  `post_id` smallint(5) NOT NULL,
  `user_id` smallint(5) NOT NULL,
  `photo_id` smallint(5) NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FK_post_user` (`user_id`),
  KEY `FK_post_photo` (`photo_id`),
  CONSTRAINT `FK_post_photo` FOREIGN KEY (`photo_id`) REFERENCES `photo` (`photo_id`),
  CONSTRAINT `FK_post_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.post: ~0 rows (approximately)
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.report
CREATE TABLE IF NOT EXISTS `report` (
  `report_id` smallint(5) NOT NULL,
  `post_id` smallint(5) NOT NULL,
  `report_date` date NOT NULL,
  `report_details` mediumtext NOT NULL,
  PRIMARY KEY (`report_id`),
  KEY `FK_report_post` (`post_id`),
  CONSTRAINT `FK_report_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.report: ~0 rows (approximately)
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` smallint(6) NOT NULL,
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.user: ~0 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Dumping structure for table projectgreenthumb.voting
CREATE TABLE IF NOT EXISTS `voting` (
  `user_id` smallint(5) NOT NULL,
  `photo_id` smallint(5) NOT NULL,
  `vote` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`photo_id`),
  CONSTRAINT `FK_voting_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table projectgreenthumb.voting: ~0 rows (approximately)
/*!40000 ALTER TABLE `voting` DISABLE KEYS */;
/*!40000 ALTER TABLE `voting` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
