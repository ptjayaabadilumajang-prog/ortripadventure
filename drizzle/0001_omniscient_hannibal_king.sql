CREATE TABLE `app_settings` (
	`key` varchar(64) NOT NULL,
	`value` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingCode` varchar(16) NOT NULL,
	`leadId` int NOT NULL,
	`departureId` int NOT NULL,
	`packageId` varchar(64),
	`participantCount` int NOT NULL DEFAULT 1,
	`totalAmount` decimal(12,2) NOT NULL,
	`status` enum('pending','under_review','approved','rejected') NOT NULL DEFAULT 'pending',
	`paymentProofUrl` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_bookingCode_unique` UNIQUE(`bookingCode`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255),
	`phone` varchar(32),
	`email` varchar(255),
	`source` varchar(64),
	`productInterest` varchar(64),
	`score` int NOT NULL DEFAULT 0,
	`status` enum('NEW','CONTACTED','QUALIFIED','HOT','VERY_HOT','BOOKED','LOST','NURTURE') NOT NULL DEFAULT 'NEW',
	`lastActivity` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trip_departures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tripId` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`seatsTotal` int NOT NULL DEFAULT 12,
	`seatsAvailable` int NOT NULL DEFAULT 12,
	`isVerified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `trip_departures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`location` varchar(255),
	`type` enum('Open Trip','Private Trip') NOT NULL DEFAULT 'Open Trip',
	`description` text,
	`priceBase` decimal(12,2) NOT NULL,
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trips_id` PRIMARY KEY(`id`),
	CONSTRAINT `trips_slug_unique` UNIQUE(`slug`)
);
