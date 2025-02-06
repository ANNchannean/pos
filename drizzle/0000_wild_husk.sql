CREATE TABLE `brand` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	CONSTRAINT `brand_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand_id` int,
	`category_id` int NOT NULL,
	`unit_id` int NOT NULL,
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`stock` int NOT NULL DEFAULT 0,
	`barcode` varchar(255),
	`description` text,
	CONSTRAINT `product_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_barcode_unique` UNIQUE(`barcode`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	CONSTRAINT `unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`age` int,
	`username` varchar(32) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_brand_id_brand_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brand`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_unit_id_unit_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;