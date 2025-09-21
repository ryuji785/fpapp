DO $$ BEGIN
   CREATE ROLE fpapp WITH LOGIN PASSWORD 'fpapp_dev';
EXCEPTION WHEN duplicate_object THEN
   RAISE NOTICE 'role fpapp exists, skipping';
END $$;

DO $$ BEGIN
   CREATE DATABASE fpapp OWNER fpapp ENCODING 'UTF8';
EXCEPTION WHEN duplicate_database THEN
   RAISE NOTICE 'database fpapp exists, skipping';
END $$;

GRANT ALL PRIVILEGES ON DATABASE fpapp TO fpapp;
