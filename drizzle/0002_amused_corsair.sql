CREATE TABLE `ai_agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`role` text NOT NULL,
	`instructions` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `ai_agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_agents_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `ai_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int,
	`action` varchar(255),
	`input` text,
	`output` text,
	`tokensUsed` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`entityType` varchar(64),
	`entityId` int,
	`oldData` json,
	`newData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('email','whatsapp','social','ads') NOT NULL,
	`status` enum('draft','active','completed','paused') NOT NULL DEFAULT 'draft',
	`startDate` timestamp,
	`endDate` timestamp,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`leadId` int,
	`type` enum('privacy_policy','terms_conditions','marketing') NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('blog','social_post','ad_copy','email_template') NOT NULL,
	`body` text NOT NULL,
	`metadata` json,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`customerId` int,
	`platform` enum('whatsapp','in_app','email') NOT NULL,
	`status` enum('open','closed','archived') NOT NULL DEFAULT 'open',
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`phone` varchar(32),
	`email` varchar(255),
	`totalSpending` decimal(15,2) NOT NULL DEFAULT '0',
	`loyaltyPoints` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region` varchar(255),
	`rules` text,
	`safetyInfo` text,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(64),
	`stockTotal` int NOT NULL DEFAULT 0,
	`stockAvailable` int NOT NULL DEFAULT 0,
	`pricePerDay` decimal(10,2),
	CONSTRAINT `equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`bio` text,
	`specialties` json,
	`isVerified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `guides_id` PRIMARY KEY(`id`),
	CONSTRAINT `guides_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_base` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(64) NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`isVerified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `knowledge_base_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderRole` enum('user','admin','ai') NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`idNumber` varchar(64),
	`phone` varchar(32),
	`emergencyContact` varchar(255),
	CONSTRAINT `participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255),
	`type` enum('agency','affiliate','vendor') NOT NULL,
	`status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`method` varchar(64) NOT NULL,
	`transactionId` varchar(255),
	`status` enum('pending','verified','failed','refunded') NOT NULL DEFAULT 'pending',
	`verifiedAt` timestamp,
	`verifiedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` text,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredId` int,
	`code` varchar(32) NOT NULL,
	`status` enum('pending','converted','rewarded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`customerId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role` enum('user','admin','superadmin','guide','partner') NOT NULL,
	`permissionId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(64),
	`content` text NOT NULL,
	`avatarUrl` text,
	`isFeatured` boolean NOT NULL DEFAULT false,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waitlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`departureId` int,
	`leadId` int NOT NULL,
	`priority` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `status` enum('pending','under_review','approved','rejected','cancelled','refunded') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `leads` MODIFY COLUMN `status` enum('NEW','CONTACTED','QUALIFIED','WARM','HOT','VERY_HOT','BOOKED','LOST','NURTURE') NOT NULL DEFAULT 'NEW';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','superadmin','guide','partner') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `bookings` ADD `customerId` int;--> statement-breakpoint
ALTER TABLE `leads` ADD `customerId` int;--> statement-breakpoint
ALTER TABLE `leads` ADD `nextAction` text;--> statement-breakpoint
ALTER TABLE `trip_departures` ADD `status` enum('scheduled','confirmed','completed','cancelled') DEFAULT 'scheduled' NOT NULL;--> statement-breakpoint
ALTER TABLE `trips` ADD `destinationId` int;--> statement-breakpoint
ALTER TABLE `trips` ADD `itinerary` json;--> statement-breakpoint
ALTER TABLE `trips` ADD `facilities` json;--> statement-breakpoint
ALTER TABLE `trips` ADD `requirements` text;--> statement-breakpoint
ALTER TABLE `trips` DROP COLUMN `location`;