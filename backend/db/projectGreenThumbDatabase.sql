-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.3-rc-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- Author :                      Austin Bursey, Luke Turnbull, Saad Ansari
-- HeidiSQL Version:             9.5.0.5261
-- --------------------------------------------------------
USE projectgreenthumb
GO


-- Dumping structure for table projectgreenthumb.plant
CREATE TABLE [plant] (
  [plant_id] smallint NOT NULL IDENTITY(1,1),
  [plant_name] varchar(90) NOT NULL,
  [plant_bio] varchar(1000) NOT NULL,
  PRIMARY KEY (plant_id)
)

-- Dumping structure for table projectgreenthumb.photo
CREATE TABLE [photo] (
  [photo_id] smallint NOT NULL IDENTITY(1,1),
  [plant_id] smallint NOT NULL,
  [image] varbinary(max) NOT NULL,
  [tf_record] varchar(100) DEFAULT NULL,
  PRIMARY KEY (photo_id),
  CONSTRAINT FK_photo_plant FOREIGN KEY (plant_id) REFERENCES [plant] (plant_id)
)

-- Dumping structure for table projectgreenthumb.user
CREATE TABLE [user] (
  [user_id] smallint NOT NULL IDENTITY(1,1),
  [password] varchar(64) NOT NULL,
  PRIMARY KEY (user_id)
)

-- Dumping structure for table projectgreenthumb.post
CREATE TABLE [post] (
  [post_id] smallint NOT NULL IDENTITY(1,1),
  [user_id] smallint NOT NULL,
  [photo_id] smallint NOT NULL,
  PRIMARY KEY (post_id),
  CONSTRAINT FK_post_photo FOREIGN KEY (photo_id) REFERENCES [photo] (photo_id),
  CONSTRAINT FK_post_user FOREIGN KEY (user_id) REFERENCES [user] (user_id)
)

-- Dumping structure for table projectgreenthumb.report
CREATE TABLE [report] (
  [report_id] smallint NOT NULL IDENTITY(1,1),
  [post_id] smallint NOT NULL,
  [report_date] date NOT NULL,
  [report_details] varchar(1000) NOT NULL,
  PRIMARY KEY (report_id),
  CONSTRAINT FK_report_post FOREIGN KEY (post_id) REFERENCES [post] (post_id)
)

-- Dumping structure for table projectgreenthumb.admin
CREATE TABLE [admin] (
  [admin_id] smallint NOT NULL IDENTITY(1,1),
  [first_name] varchar(25) NOT NULL,
  [last_name] varchar(25) NOT NULL,
  [email] varchar(50) NOT NULL,
  PRIMARY KEY (admin_id),
  CONSTRAINT FK_a_user FOREIGN KEY (admin_id) REFERENCES [user] (user_id)
)

-- Dumping structure for table projectgreenthumb.admin_action
CREATE TABLE [admin_action] (
  [action_id] smallint NOT NULL identity(1,1),
  [admin_action] varchar(13) CHECK (admin_action IN('handled', 'Under Review', 'Not processed')),
  [date_handled] date DEFAULT NULL,
  PRIMARY KEY (admin_action)
) 

-- Dumping structure for table projectgreenthumb.admin_report
CREATE TABLE [admin_report] (
  [report_id] smallint NOT NULL IDENTITY(1,1),
  [admin_id] smallint NOT NULL,
  [admin_action] varchar(13) CHECK (admin_action IN('handled', 'Under Review', 'Not processed')),
  PRIMARY KEY (report_id,admin_id),
  CONSTRAINT  FK_admin_report_admin FOREIGN KEY (admin_id) REFERENCES [admin] (admin_id),
  CONSTRAINT FK_admin_report_admin_action FOREIGN KEY (admin_action) REFERENCES [admin_action] (admin_action),
  CONSTRAINT FK_admin_report_report FOREIGN KEY (report_id) REFERENCES [report] (report_id)
)

-- Dumping structure for table projectgreenthumb.ban
CREATE TABLE [ban] (
  [ban_id] smallint NOT NULL IDENTITY(1,1),
  [user_id] smallint NOT NULL,
  [admin_id] smallint NOT NULL,
  [expiration_date] date DEFAULT NULL,
  PRIMARY KEY (ban_id,user_id),
  CONSTRAINT FK_banned_user FOREIGN KEY (user_id) REFERENCES [user] (user_id)
)


-- Dumping structure for table projectgreenthumb.voting
CREATE TABLE [voting] (
  [vote_id] smallint NOT NULL IDENTITY(1,1),
  [user_id] smallint NOT NULL,
  [photo_id] smallint NOT NULL,
  [vote] tinyint DEFAULT NULL,
  PRIMARY KEY ([vote_id]),
  CONSTRAINT FK_voting_user FOREIGN KEY ([user_id]) REFERENCES [user] ([user_id])
)
