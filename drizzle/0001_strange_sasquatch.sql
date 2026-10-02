CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`visitor_hash` text NOT NULL,
	`referrer` text DEFAULT '' NOT NULL,
	`device` text NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`occurred_at` text NOT NULL,
	`last_seen` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_occurred` ON `analytics_events` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `analytics_last_seen` ON `analytics_events` (`last_seen`);