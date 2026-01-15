# Database Migrations

This folder contains SQL migration scripts for the Makana database schema.

## Files

- `001_initial_schema.sql` - Initial database schema with all tables, indexes, and RLS policies

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of the migration file
4. Execute the SQL

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Option 3: Docker (Local Development)

The migration files are automatically executed when the PostgreSQL container starts (see `docker-compose.yml`).

```bash
# Start services (migrations run automatically)
docker-compose up

# Or rebuild if schema changed
docker-compose down -v
docker-compose up --build
```

### Option 4: psql (Direct Connection)

```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/makana_dev

# Run migration
\i migrations/001_initial_schema.sql
```

## Migration Contents

### Tables Created

1. **user_profiles** - User account information
2. **setups** - Preset configurations (Calm, Reduced, Vitality)
3. **user_setups** - Active setup per user
4. **daily_checks** - Daily check-in records
5. **sessions** - Session records (Ignition/Braking)
6. **weekly_checks** - Weekly reflection records
7. **reduced_mode_states** - Reduced mode state per user

### Indexes

Performance indexes are created for:
- User lookups (user_id)
- Date-based queries (check_date, week_start_date)
- Status queries (session status)
- Recent records (created_at DESC)

### Row-Level Security (RLS)

All tables have RLS policies that ensure:
- Users can only access their own data
- Setups are read-only for all authenticated users
- Database enforces isolation at row level

### Seed Data

Three preset setups are seeded:
- **Calm**: 25 minutes, emphasis on rest
- **Reduced**: 15 minutes, emphasis on continuity
- **Vitality**: 30 minutes, emphasis on health

## Verification

After running migrations, verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- Check preset setups
SELECT * FROM setups WHERE is_preset = true;
```

## Rollback

To rollback (development only):

```bash
# Drop all tables
docker-compose down -v

# Restart with fresh database
docker-compose up
```

For production, create a rollback migration file.

## Future Migrations

When adding new migrations:
1. Name files sequentially: `002_description.sql`, `003_description.sql`, etc.
2. Include both UP (apply) and DOWN (rollback) sections
3. Test locally before applying to production
4. Document changes in this README
