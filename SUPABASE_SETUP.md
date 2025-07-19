# Supabase Setup Guide

This guide walks you through setting up Supabase for the Meal Planner application to enable meal plan persistence.

## Prerequisites

- A [Supabase](https://supabase.com) account
- Railway deployment for the meal planner app
- Access to Railway environment variables

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/sign up
2. Click "Start your project" or "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `meal-planner` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://[project-id].supabase.co`)
   - **anon public** API key (starts with `eyJhbG...`)

## Step 3: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/001_create_plans_table.sql`
3. Click "Run" to execute the migration
4. Verify the migration succeeded - you should see:
   - ✅ Extension "uuid-ossp" enabled
   - ✅ Table "plans" created
   - ✅ Indexes created
   - ✅ RLS policies created
   - ✅ Trigger function created

## Step 4: Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see a `plans` table with the following columns:
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to auth.users)
   - `week_start` (date)
   - `meals` (jsonb)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under **General settings**:
   - Set **Site URL** to your Railway app URL (e.g., `https://meal-planner-production.up.railway.app`)
   - Add your Railway app URL to **Redirect URLs**
3. Under **Auth Providers**:
   - Enable **Email** provider (enabled by default)
   - Configure other providers as needed (Google, GitHub, etc.)

## Step 6: Set Railway Environment Variables

1. Go to your Railway project dashboard
2. Select your meal planner service
3. Go to the **Variables** tab
4. Add the following environment variables:
   ```
   VITE_SUPABASE_URL=https://[your-project-id].supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG... (your anon public key)
   ```
5. Click "Deploy" to apply the changes

## Step 7: Test the Integration

1. Deploy your application to Railway with the new environment variables
2. Open your application in a browser
3. Generate some meal suggestions
4. Try saving the week plan
5. Refresh the page - your saved plan should load automatically

## Troubleshooting

### Environment Variables Not Working

- Ensure variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check that the Railway deployment included the new variables
- Variables should not have quotes around them in Railway

### Authentication Issues

- Check that your Railway app URL is added to Supabase Auth settings
- Verify RLS policies are created and active
- Check browser console for authentication errors

### Database Connection Issues

- Verify your Supabase project URL is correct
- Check that the anon API key is valid and hasn't expired
- Ensure the plans table was created successfully

### Permission Errors

- Verify RLS (Row Level Security) is enabled on the plans table
- Check that all RLS policies are created correctly
- Make sure user is authenticated before trying to save/load plans

### Migration Errors

If the migration fails:
1. Run the rollback script from `supabase/migrations/001_rollback_plans_table.sql`
2. Check for any conflicting table names or permissions
3. Try running the migration again

### Testing Without Authentication

For development/testing, you can temporarily disable RLS:
```sql
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
```

**⚠️ Never disable RLS in production!**

## Security Notes

- The anon API key is safe to expose in client-side code
- Never expose your service role key in client-side code
- RLS policies ensure users can only access their own data
- All API requests are automatically filtered by user authentication

## Database Schema Reference

```sql
CREATE TABLE plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start  DATE NOT NULL,              -- Monday of ISO week
  meals       JSONB NOT NULL,             -- Array of Meal objects
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_plans_user_id` - Fast user queries
- `idx_plans_week_start` - Fast date-based queries  
- `idx_plans_user_week` - Unique constraint on user + week

**RLS Policies:**
- Users can only view/insert/update/delete their own plans
- All operations require authentication (`auth.uid()`)

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test the Supabase connection in your browser's network tab
4. Check the [Supabase documentation](https://supabase.com/docs)
5. Review the application logs in Railway