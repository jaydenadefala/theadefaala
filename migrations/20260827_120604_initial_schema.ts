import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_writing_category" AS ENUM('Essay', 'Reflection', 'Poem');
  CREATE TYPE "public"."enum_writing_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__writing_v_version_category" AS ENUM('Essay', 'Reflection', 'Poem');
  CREATE TYPE "public"."enum__writing_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_poems_mood" AS ENUM('melancholic', 'hopeful', 'romantic', 'reflective', 'restless');
  CREATE TYPE "public"."enum_poems_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__poems_v_version_mood" AS ENUM('melancholic', 'hopeful', 'romantic', 'reflective', 'restless');
  CREATE TYPE "public"."enum__poems_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_development_projects_category" AS ENUM('Web', 'Business');
  CREATE TYPE "public"."enum_development_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__development_projects_v_version_category" AS ENUM('Web', 'Business');
  CREATE TYPE "public"."enum__development_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_preacher_messages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__preacher_messages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "writing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"subtitle" varchar,
  	"excerpt" varchar,
  	"category" "enum_writing_category",
  	"accent" varchar DEFAULT '#c9a24b',
  	"cover_image_id" integer,
  	"body" jsonb,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_writing_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_writing_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_subtitle" varchar,
  	"version_excerpt" varchar,
  	"version_category" "enum__writing_v_version_category",
  	"version_accent" varchar DEFAULT '#c9a24b',
  	"version_cover_image_id" integer,
  	"version_body" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__writing_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "poems_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "poems" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"mood" "enum_poems_mood",
  	"cover_image_id" integer,
  	"background_image_id" integer,
  	"audio_id" integer,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_poems_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_poems_v_version_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_poems_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_mood" "enum__poems_v_version_mood",
  	"version_cover_image_id" integer,
  	"version_background_image_id" integer,
  	"version_audio_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__poems_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "development_projects_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "development_projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "development_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"category" "enum_development_projects_category",
  	"short_description" varchar,
  	"cover_image_id" integer,
  	"full_description" jsonb,
  	"role" varchar,
  	"external_url" varchar,
  	"github_url" varchar,
  	"business_context" varchar,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_development_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_development_projects_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_development_projects_v_version_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_development_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__development_projects_v_version_category",
  	"version_short_description" varchar,
  	"version_cover_image_id" integer,
  	"version_full_description" jsonb,
  	"version_role" varchar,
  	"version_external_url" varchar,
  	"version_github_url" varchar,
  	"version_business_context" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__development_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "preacher_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"body" jsonb,
  	"scripture" varchar,
  	"category" varchar DEFAULT 'Message',
  	"date" timestamp(3) with time zone,
  	"audio_id" integer,
  	"video_url" varchar,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_preacher_messages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_preacher_messages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_body" jsonb,
  	"version_scripture" varchar,
  	"version_category" varchar DEFAULT 'Message',
  	"version_date" timestamp(3) with time zone,
  	"version_audio_id" integer,
  	"version_video_url" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__preacher_messages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"writing_id" integer,
  	"poems_id" integer,
  	"development_projects_id" integer,
  	"preacher_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_title" varchar DEFAULT 'theAdefala' NOT NULL,
  	"site_description" varchar DEFAULT 'The personal universe of theAdefala: developer, writer, poet, and preacher.' NOT NULL,
  	"email" varchar DEFAULT 'jaydenadefala@gmail.com' NOT NULL,
  	"profile_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_settings_identity_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_headline" varchar DEFAULT 'If any of this resonated, let''s talk.' NOT NULL,
  	"cta_button_text" varchar DEFAULT 'Say hello' NOT NULL,
  	"cta_secondary_text" varchar DEFAULT 'or email directly' NOT NULL,
  	"copyright_name" varchar DEFAULT 'theAdefala' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "writing" ADD CONSTRAINT "writing_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writing_v" ADD CONSTRAINT "_writing_v_parent_id_writing_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."writing"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_writing_v" ADD CONSTRAINT "_writing_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "poems_lines" ADD CONSTRAINT "poems_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."poems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "poems" ADD CONSTRAINT "poems_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "poems" ADD CONSTRAINT "poems_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "poems" ADD CONSTRAINT "poems_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_poems_v_version_lines" ADD CONSTRAINT "_poems_v_version_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_poems_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_poems_v" ADD CONSTRAINT "_poems_v_parent_id_poems_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."poems"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_poems_v" ADD CONSTRAINT "_poems_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_poems_v" ADD CONSTRAINT "_poems_v_version_background_image_id_media_id_fk" FOREIGN KEY ("version_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_poems_v" ADD CONSTRAINT "_poems_v_version_audio_id_media_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "development_projects_images" ADD CONSTRAINT "development_projects_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "development_projects_images" ADD CONSTRAINT "development_projects_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."development_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "development_projects_technologies" ADD CONSTRAINT "development_projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."development_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "development_projects" ADD CONSTRAINT "development_projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_development_projects_v_version_images" ADD CONSTRAINT "_development_projects_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_development_projects_v_version_images" ADD CONSTRAINT "_development_projects_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_development_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_development_projects_v_version_technologies" ADD CONSTRAINT "_development_projects_v_version_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_development_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_development_projects_v" ADD CONSTRAINT "_development_projects_v_parent_id_development_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."development_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_development_projects_v" ADD CONSTRAINT "_development_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "preacher_messages" ADD CONSTRAINT "preacher_messages_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "preacher_messages" ADD CONSTRAINT "preacher_messages_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_preacher_messages_v" ADD CONSTRAINT "_preacher_messages_v_parent_id_preacher_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."preacher_messages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_preacher_messages_v" ADD CONSTRAINT "_preacher_messages_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_preacher_messages_v" ADD CONSTRAINT "_preacher_messages_v_version_audio_id_media_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_writing_fk" FOREIGN KEY ("writing_id") REFERENCES "public"."writing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_poems_fk" FOREIGN KEY ("poems_id") REFERENCES "public"."poems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_development_projects_fk" FOREIGN KEY ("development_projects_id") REFERENCES "public"."development_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_preacher_messages_fk" FOREIGN KEY ("preacher_messages_id") REFERENCES "public"."preacher_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_settings_identity_roles" ADD CONSTRAINT "homepage_settings_identity_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE UNIQUE INDEX "writing_slug_idx" ON "writing" USING btree ("slug");
  CREATE INDEX "writing_cover_image_idx" ON "writing" USING btree ("cover_image_id");
  CREATE INDEX "writing_updated_at_idx" ON "writing" USING btree ("updated_at");
  CREATE INDEX "writing_created_at_idx" ON "writing" USING btree ("created_at");
  CREATE INDEX "writing__status_idx" ON "writing" USING btree ("_status");
  CREATE INDEX "_writing_v_parent_idx" ON "_writing_v" USING btree ("parent_id");
  CREATE INDEX "_writing_v_version_version_slug_idx" ON "_writing_v" USING btree ("version_slug");
  CREATE INDEX "_writing_v_version_version_cover_image_idx" ON "_writing_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_writing_v_version_version_updated_at_idx" ON "_writing_v" USING btree ("version_updated_at");
  CREATE INDEX "_writing_v_version_version_created_at_idx" ON "_writing_v" USING btree ("version_created_at");
  CREATE INDEX "_writing_v_version_version__status_idx" ON "_writing_v" USING btree ("version__status");
  CREATE INDEX "_writing_v_created_at_idx" ON "_writing_v" USING btree ("created_at");
  CREATE INDEX "_writing_v_updated_at_idx" ON "_writing_v" USING btree ("updated_at");
  CREATE INDEX "_writing_v_latest_idx" ON "_writing_v" USING btree ("latest");
  CREATE INDEX "poems_lines_order_idx" ON "poems_lines" USING btree ("_order");
  CREATE INDEX "poems_lines_parent_id_idx" ON "poems_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "poems_slug_idx" ON "poems" USING btree ("slug");
  CREATE INDEX "poems_cover_image_idx" ON "poems" USING btree ("cover_image_id");
  CREATE INDEX "poems_background_image_idx" ON "poems" USING btree ("background_image_id");
  CREATE INDEX "poems_audio_idx" ON "poems" USING btree ("audio_id");
  CREATE INDEX "poems_updated_at_idx" ON "poems" USING btree ("updated_at");
  CREATE INDEX "poems_created_at_idx" ON "poems" USING btree ("created_at");
  CREATE INDEX "poems__status_idx" ON "poems" USING btree ("_status");
  CREATE INDEX "_poems_v_version_lines_order_idx" ON "_poems_v_version_lines" USING btree ("_order");
  CREATE INDEX "_poems_v_version_lines_parent_id_idx" ON "_poems_v_version_lines" USING btree ("_parent_id");
  CREATE INDEX "_poems_v_parent_idx" ON "_poems_v" USING btree ("parent_id");
  CREATE INDEX "_poems_v_version_version_slug_idx" ON "_poems_v" USING btree ("version_slug");
  CREATE INDEX "_poems_v_version_version_cover_image_idx" ON "_poems_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_poems_v_version_version_background_image_idx" ON "_poems_v" USING btree ("version_background_image_id");
  CREATE INDEX "_poems_v_version_version_audio_idx" ON "_poems_v" USING btree ("version_audio_id");
  CREATE INDEX "_poems_v_version_version_updated_at_idx" ON "_poems_v" USING btree ("version_updated_at");
  CREATE INDEX "_poems_v_version_version_created_at_idx" ON "_poems_v" USING btree ("version_created_at");
  CREATE INDEX "_poems_v_version_version__status_idx" ON "_poems_v" USING btree ("version__status");
  CREATE INDEX "_poems_v_created_at_idx" ON "_poems_v" USING btree ("created_at");
  CREATE INDEX "_poems_v_updated_at_idx" ON "_poems_v" USING btree ("updated_at");
  CREATE INDEX "_poems_v_latest_idx" ON "_poems_v" USING btree ("latest");
  CREATE INDEX "development_projects_images_order_idx" ON "development_projects_images" USING btree ("_order");
  CREATE INDEX "development_projects_images_parent_id_idx" ON "development_projects_images" USING btree ("_parent_id");
  CREATE INDEX "development_projects_images_image_idx" ON "development_projects_images" USING btree ("image_id");
  CREATE INDEX "development_projects_technologies_order_idx" ON "development_projects_technologies" USING btree ("_order");
  CREATE INDEX "development_projects_technologies_parent_id_idx" ON "development_projects_technologies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "development_projects_slug_idx" ON "development_projects" USING btree ("slug");
  CREATE INDEX "development_projects_cover_image_idx" ON "development_projects" USING btree ("cover_image_id");
  CREATE INDEX "development_projects_updated_at_idx" ON "development_projects" USING btree ("updated_at");
  CREATE INDEX "development_projects_created_at_idx" ON "development_projects" USING btree ("created_at");
  CREATE INDEX "development_projects__status_idx" ON "development_projects" USING btree ("_status");
  CREATE INDEX "_development_projects_v_version_images_order_idx" ON "_development_projects_v_version_images" USING btree ("_order");
  CREATE INDEX "_development_projects_v_version_images_parent_id_idx" ON "_development_projects_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_development_projects_v_version_images_image_idx" ON "_development_projects_v_version_images" USING btree ("image_id");
  CREATE INDEX "_development_projects_v_version_technologies_order_idx" ON "_development_projects_v_version_technologies" USING btree ("_order");
  CREATE INDEX "_development_projects_v_version_technologies_parent_id_idx" ON "_development_projects_v_version_technologies" USING btree ("_parent_id");
  CREATE INDEX "_development_projects_v_parent_idx" ON "_development_projects_v" USING btree ("parent_id");
  CREATE INDEX "_development_projects_v_version_version_slug_idx" ON "_development_projects_v" USING btree ("version_slug");
  CREATE INDEX "_development_projects_v_version_version_cover_image_idx" ON "_development_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_development_projects_v_version_version_updated_at_idx" ON "_development_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_development_projects_v_version_version_created_at_idx" ON "_development_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_development_projects_v_version_version__status_idx" ON "_development_projects_v" USING btree ("version__status");
  CREATE INDEX "_development_projects_v_created_at_idx" ON "_development_projects_v" USING btree ("created_at");
  CREATE INDEX "_development_projects_v_updated_at_idx" ON "_development_projects_v" USING btree ("updated_at");
  CREATE INDEX "_development_projects_v_latest_idx" ON "_development_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "preacher_messages_slug_idx" ON "preacher_messages" USING btree ("slug");
  CREATE INDEX "preacher_messages_cover_image_idx" ON "preacher_messages" USING btree ("cover_image_id");
  CREATE INDEX "preacher_messages_audio_idx" ON "preacher_messages" USING btree ("audio_id");
  CREATE INDEX "preacher_messages_updated_at_idx" ON "preacher_messages" USING btree ("updated_at");
  CREATE INDEX "preacher_messages_created_at_idx" ON "preacher_messages" USING btree ("created_at");
  CREATE INDEX "preacher_messages__status_idx" ON "preacher_messages" USING btree ("_status");
  CREATE INDEX "_preacher_messages_v_parent_idx" ON "_preacher_messages_v" USING btree ("parent_id");
  CREATE INDEX "_preacher_messages_v_version_version_slug_idx" ON "_preacher_messages_v" USING btree ("version_slug");
  CREATE INDEX "_preacher_messages_v_version_version_cover_image_idx" ON "_preacher_messages_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_preacher_messages_v_version_version_audio_idx" ON "_preacher_messages_v" USING btree ("version_audio_id");
  CREATE INDEX "_preacher_messages_v_version_version_updated_at_idx" ON "_preacher_messages_v" USING btree ("version_updated_at");
  CREATE INDEX "_preacher_messages_v_version_version_created_at_idx" ON "_preacher_messages_v" USING btree ("version_created_at");
  CREATE INDEX "_preacher_messages_v_version_version__status_idx" ON "_preacher_messages_v" USING btree ("version__status");
  CREATE INDEX "_preacher_messages_v_created_at_idx" ON "_preacher_messages_v" USING btree ("created_at");
  CREATE INDEX "_preacher_messages_v_updated_at_idx" ON "_preacher_messages_v" USING btree ("updated_at");
  CREATE INDEX "_preacher_messages_v_latest_idx" ON "_preacher_messages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_writing_id_idx" ON "payload_locked_documents_rels" USING btree ("writing_id");
  CREATE INDEX "payload_locked_documents_rels_poems_id_idx" ON "payload_locked_documents_rels" USING btree ("poems_id");
  CREATE INDEX "payload_locked_documents_rels_development_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("development_projects_id");
  CREATE INDEX "payload_locked_documents_rels_preacher_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("preacher_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_profile_image_idx" ON "site_settings" USING btree ("profile_image_id");
  CREATE INDEX "homepage_settings_identity_roles_order_idx" ON "homepage_settings_identity_roles" USING btree ("_order");
  CREATE INDEX "homepage_settings_identity_roles_parent_id_idx" ON "homepage_settings_identity_roles" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "writing" CASCADE;
  DROP TABLE "_writing_v" CASCADE;
  DROP TABLE "poems_lines" CASCADE;
  DROP TABLE "poems" CASCADE;
  DROP TABLE "_poems_v_version_lines" CASCADE;
  DROP TABLE "_poems_v" CASCADE;
  DROP TABLE "development_projects_images" CASCADE;
  DROP TABLE "development_projects_technologies" CASCADE;
  DROP TABLE "development_projects" CASCADE;
  DROP TABLE "_development_projects_v_version_images" CASCADE;
  DROP TABLE "_development_projects_v_version_technologies" CASCADE;
  DROP TABLE "_development_projects_v" CASCADE;
  DROP TABLE "preacher_messages" CASCADE;
  DROP TABLE "_preacher_messages_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "homepage_settings_identity_roles" CASCADE;
  DROP TABLE "homepage_settings" CASCADE;
  DROP TYPE "public"."enum_writing_category";
  DROP TYPE "public"."enum_writing_status";
  DROP TYPE "public"."enum__writing_v_version_category";
  DROP TYPE "public"."enum__writing_v_version_status";
  DROP TYPE "public"."enum_poems_mood";
  DROP TYPE "public"."enum_poems_status";
  DROP TYPE "public"."enum__poems_v_version_mood";
  DROP TYPE "public"."enum__poems_v_version_status";
  DROP TYPE "public"."enum_development_projects_category";
  DROP TYPE "public"."enum_development_projects_status";
  DROP TYPE "public"."enum__development_projects_v_version_category";
  DROP TYPE "public"."enum__development_projects_v_version_status";
  DROP TYPE "public"."enum_preacher_messages_status";
  DROP TYPE "public"."enum__preacher_messages_v_version_status";`)
}
