# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (you can use Vercel Postgres, Supabase, or any other provider)

## Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Set Up Environment Variables in Vercel
Before deploying, you need to add your environment variables in Vercel:

1. Go to your project settings on Vercel Dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: Set to `production`

### 3. Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository: `SDeath-Scythe/AonGitTask5ClinicApp`
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### 4. Deploy via Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Important Notes

### Database Setup
- Make sure your PostgreSQL database is accessible from Vercel's servers
- The `vercel-build` script will run `prisma generate` and `prisma db push` automatically
- Ensure your `DATABASE_URL` is properly set in Vercel environment variables

### Prisma Configuration
The deployment process will:
1. Generate Prisma Client (`prisma generate`)
2. Push database schema (`prisma db push`)

### Local Development
To run locally:
```bash
npm install
npx prisma generate
npx prisma db push
npm start
```

### Testing Deployment
After deployment, your API will be available at:
```
https://your-project-name.vercel.app
```

Test endpoints:
- `GET https://your-project-name.vercel.app/` - Health check
- `GET https://your-project-name.vercel.app/admin/getAll` - Get all admins
- `GET https://your-project-name.vercel.app/drugs/getAll` - Get all drugs
- etc.

## Troubleshooting

### Issue: Prisma Client not generated
**Solution**: Ensure the `vercel-build` script runs. Check Vercel build logs.

### Issue: Database connection fails
**Solution**: 
- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Ensure database allows connections from Vercel IPs (0.0.0.0/0 for public access)
- Check if database requires SSL connection (add `?sslmode=require` to connection string)

### Issue: 404 on all routes
**Solution**: Check that `vercel.json` routing is correct and `index.js` exports the app properly.

## Configuration Files

### vercel.json
Configures Vercel to:
- Build using Node.js runtime
- Route all requests to `index.js`
- Load environment variables

### .vercelignore
Excludes unnecessary files from deployment to reduce bundle size.

## Support
For more information, visit:
- Vercel Docs: https://vercel.com/docs
- Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
