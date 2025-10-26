CREATE TABLE `embeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`beforeImageUrl` text NOT NULL,
	`beforeImageKey` varchar(512) NOT NULL,
	`afterImageUrl` text NOT NULL,
	`afterImageKey` varchar(512) NOT NULL,
	`websiteUrl` text,
	`colors` json NOT NULL,
	`fonts` json NOT NULL,
	`toggleStyle` varchar(50) NOT NULL DEFAULT 'switch',
	`width` int NOT NULL DEFAULT 600,
	`height` int NOT NULL DEFAULT 400,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `embeds_id` PRIMARY KEY(`id`)
);
