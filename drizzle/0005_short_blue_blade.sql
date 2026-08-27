CREATE TABLE `legal_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(64) NOT NULL,
	`documentNumber` varchar(255),
	`fileUrl` text NOT NULL,
	`metadata` json,
	`isVerified` boolean NOT NULL DEFAULT false,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legal_documents_id` PRIMARY KEY(`id`)
);
