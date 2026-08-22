# Redefine your job as a leader — IMD card

A single-page site for the AI Leadership Sprint. Participants fill in the blanks on an IMD-branded card ("My job as a leader is not ___, but ___."), edit any of the text, then download the card as a PNG or share it on LinkedIn / X.

Everything lives in `index.html` — no build step, no dependencies to install. The IMD logo is inlined as SVG; Public Sans loads from Google Fonts; the PNG export uses `html-to-image` from a CDN.

## Brand

Follows IMD Brand Guidelines v1.0 (Feb 2026):

- Midnight `#000A56` (card background), Lac Léman Blue `#005DC4` (buttons), Mist `#D7EAF7`, Ecru `#F5F4EE` (page background)
- Public Sans, weights Light–Bold, large-type leading at ~110%
- Official IMD "Real learning / Real impact" lockup (white version, extracted from the IMD master template)

## Deploy on GitHub Pages

1. Create a new repository on github.com (e.g. `leader-card`), public, without a README.
2. From this folder:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/leader-card.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / (root) → Save**.
4. After a minute the page is live at `https://YOUR-USERNAME.github.io/leader-card/`.

## Test locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Notes on sharing

LinkedIn and X do not accept a pre-attached image via URL. The share buttons therefore open a pre-filled post with the participant's statement and download the card PNG at the same time, so they attach it in one step. On phones, a native **Share image…** button appears that shares the PNG directly into any app.
