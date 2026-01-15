# Deployment Guide

## Web App (Netlify)

### Quick Start
1. Connect GitHub repository to Netlify
2. Set base directory to `web`
3. Build command: `npm run build`
4. Publish directory: `web/.next`
5. Add environment variables (see below)

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://akactqbqjbcoqnbeavhl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### Build Verification
- ✅ TypeScript compilation passes
- ✅ All components build without errors
- ✅ `web/lib/` folder properly included
- ✅ Build tested locally and succeeds

## OAuth Setup (Optional)

Social authentication requires configuring providers in Supabase Dashboard → Authentication → Providers.

### Google OAuth
1. Create OAuth credentials in Google Cloud Console
2. Add redirect URI: `https://akactqbqjbcoqnbeavhl.supabase.co/auth/v1/callback`
3. Add Client ID and Secret to Supabase

### Apple OAuth
1. Create Services ID in Apple Developer Portal
2. Configure Sign in with Apple
3. Add Services ID, Team ID, Key ID, and Private Key to Supabase

### Facebook OAuth
1. Create app in Facebook Developers
2. Add redirect URI: `https://akactqbqjbcoqnbeavhl.supabase.co/auth/v1/callback`
3. Add App ID and Secret to Supabase

### GitHub OAuth
1. Create OAuth App in GitHub Settings
2. Add callback URL: `https://akactqbqjbcoqnbeavhl.supabase.co/auth/v1/callback`
3. Add Client ID and Secret to Supabase

## Backend API

### Docker Deployment
```bash
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_JWT_SECRET` - JWT secret from Supabase
- `SUPABASE_SERVICE_KEY` - Service role key from Supabase

### Health Check
```bash
curl http://your-api-url/health
```

## Mobile App (Expo)

### Build for iOS
```bash
cd mobile
eas build --platform ios
```

### Build for Android
```bash
cd mobile
eas build --platform android
```

### Environment Variables
Create `mobile/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://akactqbqjbcoqnbeavhl.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=your_backend_api_url
```

## Post-Deployment Checklist

- [ ] Web app accessible at production URL
- [ ] Backend API health check passing
- [ ] Supabase authentication working
- [ ] OAuth providers configured (if using)
- [ ] Mobile apps submitted to app stores
- [ ] Environment variables set correctly
- [ ] CORS configured on backend
- [ ] SSL certificates active

## Troubleshooting

**Build fails**: Check Node version (20), verify environment variables
**OAuth not working**: Verify redirect URIs match Supabase callback URL
**API connection issues**: Check CORS settings, verify API URL is accessible
**Mobile deep linking**: Configure app.json with proper scheme and bundle IDs
