CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_number" text NOT NULL,
	"trip_id" uuid,
	"vendor_id" uuid,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"amount" numeric NOT NULL,
	"expense_date" date NOT NULL,
	"payment_mode" text,
	"payment_status" text DEFAULT 'pending',
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "expenses_expense_number_unique" UNIQUE("expense_number")
);
--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"follow_up_date" date NOT NULL,
	"follow_up_time" time,
	"notes" text,
	"status" text DEFAULT 'pending',
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "international" (
	"2" integer,
	"3" integer,
	"4" integer,
	"5" integer,
	"6" integer,
	"7" integer,
	"8" integer,
	"9" integer,
	"10" integer,
	"11" integer,
	"12" integer,
	"13" integer,
	"14" integer,
	"15" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"sl_code" text NOT NULL,
	"trip_code" text NOT NULL,
	"details" text NOT NULL,
	"itinerary" text,
	"20+2" integer,
	"25+2" integer,
	"30+2" integer,
	"35+2" integer,
	"40+2" integer,
	"45+2" integer,
	"50+2" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kashmir" (
	"id" serial PRIMARY KEY NOT NULL,
	"sl_code" text NOT NULL,
	"trip_code" text NOT NULL,
	"details" text NOT NULL,
	"itinerary" text,
	"pax_02_std" integer,
	"pax_02_dlx" integer,
	"pax_02_prm" integer,
	"pax_03_std" integer,
	"pax_03_dlx" integer,
	"pax_03_prm" integer,
	"pax_04_std" integer,
	"pax_04_dlx" integer,
	"pax_04_prm" integer,
	"pax_05_std" integer,
	"pax_05_dlx" integer,
	"pax_05_prm" integer,
	"pax_06_std" integer,
	"pax_06_dlx" integer,
	"pax_06_prm" integer,
	"pax_07_std" integer,
	"pax_07_dlx" integer,
	"pax_07_prm" integer,
	"pax_08_std" integer,
	"pax_08_dlx" integer,
	"pax_08_prm" integer,
	"pax_09_std" integer,
	"pax_09_dlx" integer,
	"pax_09_prm" integer,
	"pax_10_std" integer,
	"pax_10_dlx" integer,
	"pax_10_prm" integer,
	"pax_12_std" integer,
	"pax_12_dlx" integer,
	"pax_12_prm" integer,
	"pax_15_std" integer,
	"pax_15_dlx" integer,
	"pax_15_prm" integer,
	"seasonal_std" integer,
	"seasonal_dlx" integer,
	"seasonal_prm" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_source" text NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"destination" text,
	"travel_dates" text,
	"no_of_pax" integer,
	"budget" numeric,
	"special_requirements" text,
	"status" text DEFAULT 'new' NOT NULL,
	"assigned_to" uuid,
	"priority" text DEFAULT 'medium',
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "north" (
	"2" integer,
	"3" integer,
	"4" integer,
	"5" integer,
	"6" integer,
	"7" integer,
	"8" integer,
	"9" integer,
	"10" integer,
	"11" integer,
	"12" integer,
	"13" integer,
	"14" integer,
	"15" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"sl_code" text NOT NULL,
	"trip_code" text NOT NULL,
	"details" text NOT NULL,
	"itinerary" text,
	"20+2" integer,
	"25+2" integer,
	"30+2" integer,
	"35+2" integer,
	"40+2" integer,
	"45+2" integer,
	"50+2" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "northeast" (
	"2" integer,
	"3" integer,
	"4" integer,
	"5" integer,
	"6" integer,
	"7" integer,
	"8" integer,
	"9" integer,
	"10" integer,
	"11" integer,
	"12" integer,
	"13" integer,
	"14" integer,
	"15" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"sl_code" text NOT NULL,
	"trip_code" text NOT NULL,
	"details" text NOT NULL,
	"itinerary" text,
	"20+2" integer,
	"25+2" integer,
	"30+2" integer,
	"35+2" integer,
	"40+2" integer,
	"45+2" integer,
	"50+2" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_type" text NOT NULL,
	"trip_id" uuid,
	"customer_name" text,
	"amount" numeric NOT NULL,
	"payment_mode" text NOT NULL,
	"payment_date" date NOT NULL,
	"transaction_reference" text,
	"receipt_number" text,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"quotation_number" text NOT NULL,
	"destination" text NOT NULL,
	"travel_dates" text NOT NULL,
	"no_of_pax" integer NOT NULL,
	"no_of_days" integer NOT NULL,
	"package_details" jsonb,
	"per_head_rate" numeric NOT NULL,
	"total_amount" numeric NOT NULL,
	"gst_amount" numeric DEFAULT '0',
	"grand_total" numeric NOT NULL,
	"validity_date" date,
	"terms_conditions" text,
	"status" text DEFAULT 'draft',
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "quotations_quotation_number_unique" UNIQUE("quotation_number")
);
--> statement-breakpoint
CREATE TABLE "room_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"check_in_date" text,
	"check_out_date" text,
	"place" text,
	"no_of_adults" integer,
	"no_of_kids" integer,
	"property_name" text,
	"sales_by" text,
	"selling_rate" numeric,
	"b2b_rate" numeric,
	"profit" numeric,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "south" (
	"2" integer,
	"3" integer,
	"4" integer,
	"5" integer,
	"6" integer,
	"7" integer,
	"8" integer,
	"9" integer,
	"10" integer,
	"11" integer,
	"12" integer,
	"13" integer,
	"14" integer,
	"15" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"sl_code" text NOT NULL,
	"trip_code" text NOT NULL,
	"details" text NOT NULL,
	"itinerary" text,
	"20+2" integer,
	"25+2" integer,
	"30+2" integer,
	"35+2" integer,
	"40+2" integer,
	"45+2" integer,
	"50+2" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trip_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_name" text,
	"pickup_date" text,
	"dropoff_date" text,
	"pickup_point" text,
	"destination" text,
	"no_of_days" integer,
	"bus_details" text,
	"driver_name" text,
	"companion" text,
	"per_head" numeric,
	"no_of_pax" integer,
	"free_of_cost" integer,
	"total" numeric,
	"discount" numeric,
	"sales_by" text,
	"coordinator" text,
	"gst" numeric,
	"additional_income" numeric,
	"advance_paid" numeric,
	"lead_type" text,
	"companion_fund" numeric,
	"total_cash" numeric,
	"expenses" jsonb,
	"total_expenses" numeric,
	"balance" numeric,
	"incentive" numeric,
	"final_profit" numeric,
	"booking_type" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trip_vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid,
	"vendor_id" uuid,
	"service_type" text NOT NULL,
	"service_date" date,
	"amount" numeric NOT NULL,
	"payment_status" text DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_number" text NOT NULL,
	"lead_id" uuid,
	"quotation_id" uuid,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"destination" text NOT NULL,
	"pickup_point" text,
	"pickup_date" date NOT NULL,
	"dropoff_date" date NOT NULL,
	"no_of_days" integer NOT NULL,
	"no_of_pax" integer NOT NULL,
	"per_head_rate" numeric NOT NULL,
	"total_amount" numeric NOT NULL,
	"gst_amount" numeric DEFAULT '0',
	"grand_total" numeric NOT NULL,
	"trip_coordinator" uuid,
	"driver_name" text,
	"bus_details" text,
	"package_details" jsonb,
	"status" text DEFAULT 'confirmed',
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "trips_trip_number_unique" UNIQUE("trip_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text NOT NULL,
	"phone" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendor_price_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid,
	"item_name" text NOT NULL,
	"location" text,
	"season" text,
	"rate_type" text,
	"rate" numeric NOT NULL,
	"valid_from" date,
	"valid_to" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_name" text NOT NULL,
	"category" text NOT NULL,
	"contact_person" text,
	"phone" text NOT NULL,
	"email" text,
	"address" text,
	"gst_number" text,
	"bank_details" jsonb,
	"payment_terms" text,
	"rating" integer,
	"notes" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_vendors" ADD CONSTRAINT "trip_vendors_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_vendors" ADD CONSTRAINT "trip_vendors_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_trip_coordinator_users_id_fk" FOREIGN KEY ("trip_coordinator") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_price_lists" ADD CONSTRAINT "vendor_price_lists_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;