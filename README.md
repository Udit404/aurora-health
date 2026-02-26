# RapidCraft

## Deploy without Node.js (no install needed)

You never need Node.js on your computer. Push to GitHub and the site builds in the cloud.

### Option 1: GitHub Pages (automatic from this repo)

1. **Push this folder to a GitHub repo**
   - Create a new repo at [github.com/new](https://github.com/new) (e.g. name: `rapidcraftrepo`).
   - In this folder, run:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
     git push -u origin master
     ```
     (Use Git from the command line or GitHub Desktop; no Node.js required.)

2. **Turn on GitHub Pages**
   - Repo → **Settings** → **Pages**.
   - Under **Source**, choose **GitHub Actions**.

3. **Get your URL**
   - After the first push, wait 1–2 minutes. Then open:
   - **https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/**

The workflow in `.github/workflows/deploy.yml` runs the build on GitHub’s servers, so you don’t need Node.js locally.

### Option 2: Vercel or Netlify (also no Node on your machine)

1. Push this repo to GitHub (same as above).
2. Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com) and sign in with GitHub.
3. **Import** this repository. They will build it in the cloud and give you a URL.

No Node.js install needed on your computer for either option.
