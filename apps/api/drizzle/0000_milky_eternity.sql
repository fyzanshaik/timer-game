CREATE TABLE `scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`timer1_score` integer DEFAULT 0 NOT NULL,
	`timer5_score` integer DEFAULT 0 NOT NULL,
	`timer10_score` integer DEFAULT 0 NOT NULL,
	`timer15_score` integer DEFAULT 0 NOT NULL,
	`timer30_score` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);