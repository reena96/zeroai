# Deployment Guide

**zeroai AI Math Tutor - Production Deployment**

This guide provides step-by-step instructions for deploying zeroai to production using Vercel (recommended) or alternative platforms.

---

## Table of Contents

1. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
2. [Alternative: Netlify](#alternative-netlify)
3. [Alternative: Self-Hosted (Docker)](#alternative-self-hosted-docker)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Validation](#post-deployment-validation)
6. [Performance Optimization](#performance-optimization)
7. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

**Why Vercel?**
- Next.js optimized (created by Vercel team)
- One-command deployment
- Automatic HTTPS + CDN
- Edge functions for fast global performance
- GitHub integration (auto-deploys on push)
- Free tier suitable for demo/evaluation
- Zero configuration required

### Prerequisites

- GitHub account
- Vercel account (free) - [Sign up](https://vercel.com/signup)
- Git repository pushed to GitHub

### Step-by-Step Deployment

#### 1. Prepare Your Code

```bash
# Ensure all changes are committed
git status

# If you have uncommitted changes:
git add .
git commit -m "Prepare for production deployment"

# Push to GitHub
git push origin main
```

#### 2. Connect to Vercel

**Option A: Via Vercel Dashboard (Easiest)**

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select "Import Git Repository"
4. Choose your `zeroai` repository from GitHub
5. Vercel will auto-detect Next.js and configure build settings

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /path/to/zeroai
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No** (first deployment)
- What's your project's name? **zeroai** (or custom name)
- In which directory is your code located? **./** (root)
- Want to override the settings? **No**

#### 3. Configure Environment Variables

**CRITICAL:** You must add your OpenAI API key before the app will work.

1. In Vercel dashboard, go to your project
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` (your key) | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

**Important:**
- Never commit API keys to git
- Use Vercel's encrypted environment variable storage
- Apply to all environments (Production, Preview, Development) for consistency

#### 4. Deploy

If using dashboard:
- Click "Deployments" tab
- Click "Redeploy" (to pick up environment variables)

If using CLI:
```bash
vercel --prod
```

#### 5. Verify Deployment

Your app will be live at: `https://zeroai-[random].vercel.app`

Or with custom domain: `https://zeroai-tutor.vercel.app`

Test checklist:
- [ ] Homepage loads
- [ ] Can select mode (Homework/Exam/Exploration)
- [ ] Can send chat message
- [ ] AI responds (verifies OpenAI API key works)
- [ ] Math rendering displays correctly
- [ ] Image upload button visible
- [ ] No console errors (check browser DevTools)

---

## Alternative: Netlify

### Prerequisites

- GitHub account
- Netlify account (free) - [Sign up](https://app.netlify.com/signup)

### Deployment Steps

#### 1. Build Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 2. Deploy via Netlify Dashboard

1. Go to [https://app.netlify.com/start](https://app.netlify.com/start)
2. Click "Import from Git"
3. Choose GitHub and select `zeroai` repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables:
   - `OPENAI_API_KEY`: `sk-...`
   - `NODE_ENV`: `production`
6. Click "Deploy site"

#### 3. Verify

Your app will be live at: `https://[random-name].netlify.app`

---

## Alternative: Self-Hosted (Docker)

### Prerequisites

- Docker installed
- Server with public IP (AWS EC2, DigitalOcean Droplet, etc.)

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build Docker image
docker build -t zeroai .

# Run container
docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=sk-your-key-here \
  -e NODE_ENV=production \
  --name zeroai-app \
  zeroai

# Check logs
docker logs zeroai-app

# Access at http://your-server-ip:3000
```

### Production Setup with Nginx

```nginx
# /etc/nginx/sites-available/zeroai
server {
    listen 80;
    server_name zeroai-tutor.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/zeroai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | `sk-proj-...` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment | `development` | `production` |
| `PORT` | Server port | `3000` | `8080` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` | `https://zeroai-tutor.vercel.app` |

### Setting Environment Variables

**Vercel:**
1. Dashboard → Settings → Environment Variables
2. Add variable → Apply to all environments

**Netlify:**
1. Site settings → Build & deploy → Environment
2. Add variable

**Docker:**
```bash
docker run -e OPENAI_API_KEY=sk-... -e NODE_ENV=production zeroai
```

**Local Development:**
Create `.env.local`:
```env
OPENAI_API_KEY=sk-...
NODE_ENV=development
```

---

## Post-Deployment Validation

### Automated Validation Checklist

After deployment, run through this checklist:

#### 1. Smoke Test (30 seconds)

- [ ] Visit deployed URL
- [ ] Homepage loads within 2 seconds
- [ ] No console errors (F12 → Console tab)
- [ ] Select a mode (Homework/Exam/Exploration)
- [ ] Send test message: "Solve for x: 2x + 5 = 13"
- [ ] AI responds within 3 seconds
- [ ] Math rendering displays: $2x + 5 = 13$

#### 2. Feature Validation (5 minutes)

- [ ] **Text Input:** Enter problem, AI confirms and begins Socratic dialogue
- [ ] **Mode Selection:** All 3 modes selectable (Homework, Exam, Exploration)
- [ ] **Math Rendering:** LaTeX displays correctly (inline $x$ and display $$x^2$$)
- [ ] **Confused Button:** Appears when student struggles, triggers worked example
- [ ] **Message History:** Previous messages persist in UI
- [ ] **Mobile Responsive:** Test on phone/tablet (or resize browser to <768px)

#### 3. Performance Validation (2 minutes)

Run [PageSpeed Insights](https://pagespeed.web.dev/):
- [ ] Performance score > 80
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

Test LLM response time:
- [ ] Send 3 different problems, measure time to first token
- [ ] Average < 3 seconds (target: < 2s)

#### 4. Error Handling (2 minutes)

- [ ] Send empty message → Should show validation error
- [ ] Disconnect internet → Should show connection error
- [ ] Invalid API key (temporarily) → Should show API error with clear message

#### 5. Cross-Browser Testing (5 minutes)

Test on:
- [ ] Chrome (latest)
- [ ] Safari (latest) - macOS/iOS
- [ ] Firefox (latest)
- [ ] Edge (latest)

#### 6. Security Validation

- [ ] HTTPS enabled (check for lock icon in browser)
- [ ] No API keys exposed in client-side code (check Network tab)
- [ ] No CORS errors in console
- [ ] CSP headers configured (check Response Headers)

---

## Performance Optimization

### Build Optimization

**Already configured in Next.js 15:**
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization (if using next/font)
- ✅ Minification and tree shaking

### API Route Optimization

**Current implementation:**
```typescript
// app/api/chat/route.ts
const contextMessages = messages.slice(-10); // Limit context to 10 messages
```

This prevents token overflow and reduces latency.

### Edge Functions (Vercel)

Deploy API routes to edge for faster global performance:

```typescript
// app/api/chat/route.ts
export const runtime = 'edge'; // Add this line
```

**Benefits:**
- Lower latency (runs closer to user)
- Faster cold starts
- Global distribution

**Limitations:**
- Some Node.js APIs not available
- Must use Web APIs only

### Caching Strategy

**Static Assets:** Automatic caching by Vercel/Netlify CDN

**API Responses:** No caching (chat is dynamic), but consider:
```typescript
// For static prompt templates
export const revalidate = 3600; // Cache for 1 hour
```

---

## Troubleshooting

### Issue: "OpenAI API key not configured"

**Symptom:** Error message in chat UI, no AI responses

**Solution:**
1. Verify environment variable is set: `OPENAI_API_KEY`
2. Check spelling (case-sensitive)
3. Redeploy after adding variables (Vercel: Deployments → Redeploy)
4. Verify key is valid: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Issue: Math not rendering (shows LaTeX code instead)

**Symptom:** See `$x^2 + 5$` instead of rendered math

**Solution:**
1. Check browser console for KaTeX errors
2. Verify KaTeX CSS is loaded (check Network tab)
3. Clear browser cache and reload
4. Verify `katex` package installed: `npm list katex`

### Issue: Slow AI responses (> 5 seconds)

**Symptom:** Long delay between sending message and receiving response

**Solution:**
1. Check OpenAI API status: [status.openai.com](https://status.openai.com)
2. Verify using streaming mode (should be enabled by default)
3. Reduce context window (currently 10 messages, reduce to 5 if needed)
4. Check server location (use edge functions for lower latency)

### Issue: Build fails on Vercel

**Symptom:** Deployment fails during build step

**Common Causes:**
- TypeScript errors: Run `npm run build` locally to identify
- Missing dependencies: Verify `package.json` has all deps
- Node version mismatch: Set in `package.json`:
  ```json
  "engines": {
    "node": ">=18.0.0"
  }
  ```

**Solution:**
1. Check build logs in Vercel dashboard
2. Fix errors locally first
3. Test build: `npm run build`
4. Push fix and redeploy

### Issue: Image upload not working

**Symptom:** Upload button doesn't respond or OCR fails

**Solution:**
1. Verify GPT-4 Vision access in OpenAI account
2. Check file size (< 20MB)
3. Check file format (JPEG, PNG supported)
4. Check browser console for errors
5. Verify `/api/ocr` route is deployed

### Issue: "Too many requests" error

**Symptom:** API returns 429 error

**Solution:**
1. Check OpenAI usage limits: [platform.openai.com/usage](https://platform.openai.com/usage)
2. Implement rate limiting on client side
3. Upgrade OpenAI plan if needed
4. Add retry logic with exponential backoff

---

## Monitoring & Analytics

### Vercel Analytics (Recommended)

Enable in Vercel dashboard:
1. Project Settings → Analytics
2. Enable Web Analytics (free)

Tracks:
- Page views
- Performance metrics (Core Web Vitals)
- Geographic distribution
- Device types

### Error Monitoring

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    // Your Next.js config
  },
  {
    // Sentry webpack plugin options
    silent: true,
  }
);
```

### API Usage Monitoring

Track OpenAI usage:
1. OpenAI Dashboard: [platform.openai.com/usage](https://platform.openai.com/usage)
2. Set up alerts for usage thresholds
3. Monitor costs daily

---

## Custom Domain Setup

### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `zeroai-tutor.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

**DNS Records:**
- A record: `76.76.21.21` (Vercel IP)
- CNAME: `cname.vercel-dns.com`

### Netlify Custom Domain

1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS with Netlify nameservers

---

## Rollback Procedure

### Vercel Rollback

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"
4. Confirm rollback

### Git Rollback

```bash
# Revert to previous commit
git revert HEAD

# Or rollback to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## Security Checklist

- [ ] HTTPS enforced (Vercel handles automatically)
- [ ] Environment variables not committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] API keys rotated regularly (monthly recommended)
- [ ] CORS configured (default: same-origin)
- [ ] Rate limiting implemented (OpenAI enforces by default)
- [ ] Input validation on API routes
- [ ] No sensitive data in client-side code

---

## Deployment URLs

### Production

**URL:** https://zeroai-tutor.vercel.app *(update after deployment)*

**Status:** 🟢 Live

**Last Deployed:** November 8, 2025

**Deployment Method:** Vercel (GitHub integration)

### Staging/Preview

**URL:** https://zeroai-git-dev.vercel.app *(if using preview branches)*

**Status:** 🟡 Preview

**Purpose:** Testing before production deploy

---

## Support & Resources

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

### Getting Help

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **OpenAI Support:** [help.openai.com](https://help.openai.com)
- **Project Issues:** [GitHub Issues](https://github.com/yourusername/zeroai/issues)

---

## Deployment Checklist Summary

Before marking deployment complete:

- [ ] Code pushed to GitHub (main branch)
- [ ] Vercel project connected to GitHub repo
- [ ] Environment variable `OPENAI_API_KEY` configured
- [ ] Deployment successful (green check in Vercel dashboard)
- [ ] Public URL accessible: https://zeroai-tutor.vercel.app
- [ ] Smoke test passed (send message, get AI response)
- [ ] All 3 modes selectable and functional
- [ ] Math rendering working ($x^2$ displays correctly)
- [ ] No console errors in browser DevTools
- [ ] Performance validated (LLM < 3s, page load < 2s)
- [ ] Mobile responsive (tested on phone or resized browser)
- [ ] README updated with deployed URL
- [ ] Demo video uploaded (if applicable)
- [ ] Deployment guide reviewed

---

**Deployment Complete!** 🎉

Your zeroai AI Math Tutor is now live and ready for Gauntlet evaluation.

---

**Last Updated:** November 8, 2025
**Author:** Reena
**Version:** 1.0
