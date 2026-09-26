# Deploy Guide — ComprimirPDF → comprimirpdf.dev

Everything is built and tested. You need to do 3 things: push the code to
GitHub, deploy the backend on Render, deploy the frontend on Netlify, then
point your domain. About 20 minutes.

## What's in this folder

- `backend/` — your FastAPI compression API, FIXED:
  - Compression and download now work WITHOUT login (your frontend never
    had a login screen, so the old code rejected every upload)
  - CORS now allows https://comprimirpdf.dev (old code blocked it)
  - Login/history endpoints still exist for later (pro accounts)
- `frontend/` — your polished React site, with:
  - Brazilian Portuguese SEO (title, description, FAQ schema for Google)
  - Dead menu buttons now show "Em breve" instead of going nowhere
  - `frontend/dist/` — already built, ready to upload
- `render.yaml` — one-click Render deploy blueprint

## Step 1 — Push to GitHub (5 min)

Your current repo has a `venv/` folder committed (thousands of useless
files). Replace the repo contents with this folder:

```bash
cd comprimirpdf-site
git init
git add .
git commit -m "Merged site: fixed backend + polished frontend"
git branch -M main
git remote add origin https://github.com/Ayan67131/comprimirpdf.git
git push -u origin main --force
```

(The `--force` replaces the old messy repo. The new `.gitignore`
keeps `venv/` out forever.)

## Step 2 — Backend on Render (5 min)

You already have comprimirpdf.onrender.com. Two options:

**Option A — reconnect (recommended):** In Render dashboard, open your web
service → Settings → Build & Deploy → connect it to your GitHub repo.
Set **Root Directory** to `backend`. Every `git push` will redeploy
automatically with the fixed code. Your API URL stays
`https://comprimirpdf.onrender.com` — no frontend changes needed.

**Option B — blueprint:** Render → New → Blueprint → select your repo.
It reads `render.yaml` and creates everything.

Free Render sleeps after 15 min idle → first visitor waits ~30-60s.
That's the only downside of free. $7/month fixes it (optional, later).

## Step 3 — Frontend on Netlify + your domain (10 min)

1. Go to app.netlify.com/drop — drag the `frontend/dist` folder in.
   You get a live link instantly.
2. Site settings → Domain management → Add custom domain →
   enter `comprimirpdf.dev`. Netlify shows you DNS records.
3. Go where you bought the domain → add the DNS records Netlify gave you
   (one for `@`, one for `www`). Wait 5-60 min for it to work.
4. In Netlify: Build & deploy → Environment → add variable
   `VITE_API_URL` = `https://comprimirpdf.onrender.com`
   (then redeploy once so it bakes in — or skip this, the code already
   defaults to that URL).

Done. https://comprimirpdf.dev serves your site, compression runs on
Render. No login needed for users.

## After launch

1. Submit the site to Google Search Console (free) — this is how you see
   real Brazilian search traffic.
2. Test one PDF + one image yourself on the live domain.
3. Later: AdSense for revenue, and build the "Em breve" tools one by one.
