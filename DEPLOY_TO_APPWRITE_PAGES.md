# Deploy to Appwrite Pages - Complete Guide

## 📋 Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **GitHub Repository**: Your code should be in a GitHub repo
3. **Project Setup**: Appwrite project with auth and database configured

## 🚀 Deployment Steps

### Method 1: Git Integration (Recommended)

#### 1. Connect GitHub Repository
1. Go to **Appwrite Console** → **Hosting** → **Pages**
2. Click **"Create Page"**
3. Connect your **GitHub account**
4. Select your **nextjs-appwrite-todo** repository
5. Choose **master** branch

#### 2. Configure Build Settings
```bash
# Build Command
npm run build

# Output Directory
out

# Install Command (optional)
npm install

# Root Directory
/ (or leave empty)
```

#### 3. Environment Variables
Add these in Appwrite Pages settings:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID=todos
NEXT_PUBLIC_APPWRITE_REMINDERS_COLLECTION_ID=reminders
```

#### 4. Deploy
1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Get your live URL: `https://your-project-id.pages.cloud.appwrite.io`

### Method 2: Manual Upload

#### 1. Build Locally
```bash
# Install dependencies
npm install

# Build for production
npm run build

# This creates an 'out' folder with static files
```

#### 2. Upload to Appwrite Pages
1. Go to **Appwrite Console** → **Hosting** → **Pages**
2. Click **"Create Page"**
3. Choose **"Manual Upload"**
4. Upload the entire **out/** folder
5. Configure custom domain (optional)

## 🔧 Advanced Configuration

### Custom Domain Setup
1. In Appwrite Pages → **Settings** → **Domains**
2. Add your custom domain: `yourdomain.com`
3. Update DNS records as shown
4. Enable SSL (automatic)

### Build Optimization
```javascript
// next.config.mjs - Additional optimizations
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Optimize bundle
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },
  
  // Compression
  compress: true,
  
  // PWA support (optional)
  // Add next-pwa if needed
};
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. **Build Fails - "export" not recognized**
```bash
# Solution: Update Next.js
npm update next

# Or use alternative build command
npm run build && npx next export
```

#### 2. **Environment Variables Not Working**
- Ensure all env vars start with `NEXT_PUBLIC_`
- Check they're added in Appwrite Pages settings
- Restart deployment after adding env vars

#### 3. **404 on Direct URL Access**
```javascript
// Add to next.config.mjs
const nextConfig = {
  output: 'export',
  trailingSlash: true, // This fixes routing
  // ...
};
```

#### 4. **Appwrite Connection Issues**
- Verify project ID in env vars
- Check Appwrite project settings → Platforms
- Add your Pages domain to allowed domains

### Build Commands Cheatsheet:
```bash
# Development
npm run dev

# Production build
npm run build

# Deploy build
npm run deploy

# Check build output
ls -la out/
```

## 📊 Performance Tips

### 1. **Optimize Images**
```javascript
// For static export, use regular img tags or next/image with unoptimized
import Image from 'next/image'

<Image 
  src="/image.jpg" 
  alt="Description"
  width={500}
  height={300}
  unoptimized // Required for static export
/>
```

### 2. **Code Splitting**
```javascript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const ReminderManager = dynamic(() => import('./reminder-manager'), {
  loading: () => <p>Loading reminders...</p>
})
```

### 3. **Bundle Analysis**
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

## 🌍 Production Checklist

- [ ] ✅ Environment variables configured
- [ ] ✅ Custom domain setup (optional)
- [ ] ✅ SSL certificate active
- [ ] ✅ Appwrite project platforms updated
- [ ] ✅ Database permissions configured
- [ ] ✅ Email SMTP configured (for reminders)
- [ ] ✅ Appwrite Functions deployed
- [ ] ✅ Test all features in production
- [ ] ✅ Monitor deployment logs

## 📈 Monitoring & Analytics

### Deployment Logs
- View in Appwrite Console → Pages → Deployments
- Check build logs for errors
- Monitor performance metrics

### Application Monitoring
```javascript
// Add error tracking (optional)
// Consider Sentry, LogRocket, or similar

// Basic error logging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});
```

Your app will be live at: `https://your-project-id.pages.cloud.appwrite.io` 🚀
