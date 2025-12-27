ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "no_of_staff" integer;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "lead_guest_name" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "pickup_point" text;