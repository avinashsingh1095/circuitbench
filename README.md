# CircuitBench

CircuitBench is a static site made with HTML5, CSS3, and vanilla JavaScript. It has no build step, backend, database, API key, login, paid service, or third-party runtime dependency.

## File tree

```text
.
├── 404.html
├── README.md
├── about.html
├── assets/
│   ├── calculators.js
│   ├── site.js
│   └── styles.css
├── calculators/
│   ├── electrical-power.html
│   ├── led-resistor.html
│   ├── ohms-law.html
│   ├── resistor-color-code.html
│   └── voltage-divider.html
├── contact.html
├── disclaimer.html
├── index.html
├── privacy.html
├── robots.txt
├── sitemap.xml
└── tutorials/
    ├── arduino-analog-input.html
    ├── arduino-led-safely.html
    ├── esp32-input-voltage.html
    ├── esp32-pwm-basics.html
    ├── index.html
    ├── led-current-limiting.html
    ├── multimeter-troubleshooting.html
    ├── ohms-law-basics.html
    ├── resistor-color-bands.html
    ├── resistor-power-rating.html
    └── voltage-divider-basics.html
```

## Update notes

- Shared colors, layout, focus styles, and breakpoints are in `assets/styles.css`.
- The author footer markup is included in each HTML page; `assets/site.js` updates its copyright year automatically.
- The day/night toggle is in each page's main navigation. It follows the device preference by default and saves an explicit visitor selection in that browser's local storage; see `privacy.html`.
- Calculator code, formulas, validation, and result formatting are in `assets/calculators.js`. Keep each calculator's on-page formula and worked example in sync when changing its handler.
- Tutorial pages are drafts. Fact-check all safety and board-specific claims against current, named component/board documentation, and run every described example on the stated hardware before presenting them as final.
- The sitemap, robots file, and canonical links use the explicit `https://REPLACE-WITH-YOUR-DOMAIN` token because no production hostname was supplied. Replace every occurrence before sharing the production site.
- `404.html` is automatically used as the not-found page by Netlify and many static hosts. Verify this behavior on the selected provider.
- The Contact page deliberately does not pretend to send messages. Add a verified contact channel that you control before inviting visitors to contact the operator.

## Exact local test instructions (Windows)

1. Install Python 3 if `py` is not available. No Python package installation is needed.
2. Open PowerShell and change to the folder containing this `README.md`, for example:

   ```powershell
   cd "C:\Users\Hp\OneDrive\Desktop\circuitbench"
   ```

3. Start the static file server:

   ```powershell
   py -m http.server 8000
   ```

4. Open `http://localhost:8000/` in a browser. Keep the PowerShell window open while testing.
5. To stop the server, focus that PowerShell window and press `Ctrl+C`.

You can also open `index.html` directly, but testing through the local static server better matches hosted URL behavior.

## Beginner deployment to Netlify (manual static deploy)

1. Create or sign in to a Netlify account and choose **Add new site** → **Deploy manually** (wording may vary).
2. In PowerShell, enter the folder that contains this README and the `index.html`:

   ```powershell
   cd "C:\Users\Hp\OneDrive\Desktop\circuitbench"
   ```

3. Choose the site's permanent HTTPS hostname. If using Netlify's generated subdomain, create or name the site in Netlify first; if the final hostname only becomes available after an initial upload, treat that first upload as private setup and replace the token immediately before sharing the production URL. In VS Code, press `Ctrl+Shift+H`, search for `https://REPLACE-WITH-YOUR-DOMAIN`, replace it with the full origin (for example, `https://sample-name.netlify.app`, with no trailing slash), and set **files to include** to `*.html,*.xml,*.txt`. Choose **Replace All**. The token occurs in the indexable HTML canonical links, `sitemap.xml`, and `robots.txt`. Save all files.
4. In Netlify's manual deploy page, drag the **contents of the `circuitbench` folder** (including `index.html`, `assets`, `calculators`, and `tutorials`) into the upload area. Do not upload only `index.html`, and do not place the site one extra directory level down.
5. Wait for the deploy to finish. Open the provided HTTPS site URL and run the after-deployment checklist below.
6. If you attach a custom domain, repeat the replacement for the final custom HTTPS origin and redeploy. Confirm every canonical URL and sitemap URL uses that hostname.
7. Confirm a made-up URL such as `/this-page-does-not-exist` displays `404.html` and returns an HTTP 404 status. If the provider does not automatically serve `404.html`, configure its documented not-found-page setting; do not rewrite every URL to the homepage.

There is no build command: the publish directory is the folder containing this README and `index.html`.

## Complete local and deployed test checklist

- [ ] Homepage and all five calculator pages load without missing CSS or JavaScript.
- [ ] All header, breadcrumb, card, article, and footer links navigate to existing pages.
- [ ] Each calculator accepts valid inputs and displays correctly labeled units and results.
- [ ] Ohm's law: try 9 V and 0.02 A; confirm 450 Ω and 0.18 W.
- [ ] LED resistor: try 5 V, 2 V, and 10 mA; confirm 300 Ω ideal, 330 Ω selected, and about 9.09 mA with that value.
- [ ] Divider: try 5 V, 1,000 Ω, and 10,000 Ω; confirm about 4.545 V unloaded.
- [ ] Color bands: brown, black, red, gold; confirm 1 kΩ ±5% and 950–1,050 Ω range.
- [ ] Power: enter 12 V and 2 A, select power; confirm 24 W.
- [ ] Each calculator rejects missing, zero, negative, malformed, or impossible values with a visible error; clear/reset removes the old error/result.
- [ ] Ohm's law and power calculators reject anything other than exactly two known positive values.
- [ ] Every page is readable at narrow phone width and at desktop width; browser zoom to 200% and check for clipped controls/content.
- [ ] Use keyboard-only navigation; confirm visible focus, skip link, sensible tab order, and meaningful form labels.
- [ ] Confirm the day/night control switches the palette, follows the device theme initially, and remembers a selected mode after reload and when navigating to another page.
- [ ] Check that calculator result updates are announced by a screen reader or accessibility inspection through the live region.
- [ ] Turn JavaScript off: calculator controls should explain that calculations need JavaScript while formula text remains available.
- [ ] Confirm all ten tutorial pages are linked from the index and visibly identified as drafts requiring review/testing.
- [ ] Confirm About, Contact, Privacy, Disclaimer, and 404 pages are reachable and accurate for the actual deployment.
- [ ] Check page titles and meta descriptions in each HTML file; ensure no draft policy or contact detail misrepresents the deployed site.
- [ ] Validate `sitemap.xml` as XML, confirm every listed URL exists at the deployed host, and check `robots.txt` points to that sitemap.
- [ ] After a hostname is chosen, add and inspect absolute canonical links for all indexable pages.
- [ ] On the deployed site, directly open a nested calculator and tutorial URL, refresh each, and verify relative assets and links still work.
- [ ] Open an unknown route and confirm the host serves the custom 404 page with a 404 response (not a homepage with status 200).
- [ ] Review the hosting provider's privacy/logging behavior and update the Privacy page if deployment adds analytics, forms, cookies, or other services.
