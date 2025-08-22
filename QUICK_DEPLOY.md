# 🚀 Quick Deploy to Vercel - Inc11 Project

## ⚡ Super Quick Start (5 minutes)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy (from your project directory)
```bash
vercel --prod
```

**That's it!** Your app will be live in minutes.

---

## 🔧 If You Need More Control

### Option A: Use the Dashboard (Recommended for beginners)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Select "Vite" as framework
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click Deploy

### Option B: Use the Scripts
- **Windows**: Run `deploy.ps1` in PowerShell
- **Mac/Linux**: Run `./deploy.sh` in terminal

---

## ⚠️ Important Notes

1. **Environment Variables**: Make sure to set your Supabase credentials in Vercel
2. **Git Repository**: Your code must be in a Git repo (GitHub, GitLab, etc.)
3. **Build Command**: Should be `npm run build`
4. **Output Directory**: Should be `dist`

---

## 🆘 Need Help?

- Check the full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Common issues: Check the troubleshooting section in the full guide

---

**Your app will be live at:** `https://your-project-name.vercel.app`
