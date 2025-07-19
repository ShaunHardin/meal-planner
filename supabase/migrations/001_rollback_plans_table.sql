-- Rollback migration for plans table
-- Run this script to undo the changes made in 001_create_plans_table.sql

-- Drop the trigger
DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;

-- Drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop the policies
DROP POLICY IF EXISTS "Users can view own plans" ON plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON plans;
DROP POLICY IF EXISTS "Users can update own plans" ON plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON plans;

-- Drop the indexes
DROP INDEX IF EXISTS idx_plans_user_id;
DROP INDEX IF EXISTS idx_plans_week_start;
DROP INDEX IF EXISTS idx_plans_user_week;

-- Drop the table
DROP TABLE IF EXISTS plans;

-- Note: We don't drop the uuid-ossp extension as it might be used by other tables