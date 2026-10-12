# CircuitBench

CircuitBench is a static site made with HTML5, CSS3, and vanilla JavaScript. It has no build step, backend, database, API key, login, paid service, or third-party runtime dependency.

## File tree

```text
.
â”œâ”€â”€ 404.html
â”œâ”€â”€ README.md
â”œâ”€â”€ about.html
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ calculators.js
â”‚   â”œâ”€â”€ circuitbench-logo.png
â”‚   â”œâ”€â”€ site.js
â”‚   â””â”€â”€ styles.css
â”œâ”€â”€ calculators/
â”‚   â”œâ”€â”€ electrical-power.html
â”‚   â”œâ”€â”€ led-resistor.html
â”‚   â”œâ”€â”€ ohms-law.html
â”‚   â”œâ”€â”€ resistor-color-code.html
â”‚   â””â”€â”€ voltage-divider.html
â”œâ”€â”€ contact.html
â”œâ”€â”€ disclaimer.html
â”œâ”€â”€ index.html
â”œâ”€â”€ privacy.html
â”œâ”€â”€ robots.txt
â”œâ”€â”€ sitemap.xml
â””â”€â”€ tutorials/
    â”œâ”€â”€ arduino-analog-input.html
    â”œâ”€â”€ arduino-led-safely.html
    â”œâ”€â”€ esp32-input-voltage.html
    â”œâ”€â”€ esp32-pwm-basics.html
    â”œâ”€â”€ index.html
    â”œâ”€â”€ led-current-limiting.html
    â”œâ”€â”€ multimeter-troubleshooting.html
    â”œâ”€â”€ ohms-law-basics.html
    â”œâ”€â”€ resistor-color-bands.html
    â”œâ”€â”€ resistor-power-rating.html
    â””â”€â”€ voltage-divider-basics.html
```

## Update notes

- Shared colors, layout, focus styles, and breakpoints are in `assets/styles.css`.
- The supplied CircuitBench logo is in `assets/circuitbench-logo.png` and is used in the header across all pages.
- The author footer markup is included in each HTML page; `assets/site.js` updates its copyright year automatically.
- The day/night toggle is in each page's main navigation. It follows the device preference by default and saves an explicit visitor selection in that browser's local storage; see `privacy.html`.
- Calculator code, formulas, validation, and result formatting are in `assets/calculators.js`. Keep each calculator's on-page formula and worked example in sync when changing its handler.
- Tutorial pages are written as practical educational guides, with formulas and examples checked for consistency and clarity. Hardware-specific examples should still be verified against the exact part datasheets, board documentation, and measurement setup before use.
- The canonical links, `sitemap.xml`, and `robots.txt` are configured for `https://circuitbench1.netlify.app/`. If you publish under a different hostname or path, update those URLs to match the deployed site.
- `404.html` is automatically used as the not-found page by Netlify and many static hosts. Verify this behavior on the selected provider.
- The Contact page provides a `mailto:` link for `avinash1919982006@gmail.com` so visitors can report possible calculator or tutorial errors. Check that inbox periodically and keep the address current; email is sent through the visitor's email provider, not by the static site.

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

1. Create or sign in to a Netlify account and choose **Add new site** â†’ **Deploy manually** (wording may vary).
2. In PowerShell, enter the folder that contains this README and the `index.html`:

   ```powershell
   cd "C:\Users\Hp\OneDrive\Desktop\circuitbench"
   ```

3. This version is configured for the Netlify site URL `https://circuitbench1.netlify.app/`. If you attach a custom domain, update the canonical links, `sitemap.xml`, and `robots.txt` to use the final deployed site URL before sharing it.
4. In Netlify's manual deploy page, drag the **contents of the `circuitbench` folder** (including `index.html`, `assets`, `calculators`, and `tutorials`) into the upload area. Do not upload only `index.html`, and do not place the site one extra directory level down.
5. Wait for the deploy to finish. Open the provided HTTPS site URL and run the after-deployment checklist below.
6. If you attach a custom domain, update the canonical links, sitemap, and robots sitemap location to the final custom HTTPS URL, then redeploy. Confirm every canonical URL and sitemap URL uses that hostname.
7. Confirm a made-up URL such as `/this-page-does-not-exist` displays `404.html` and returns an HTTP 404 status. If the provider does not automatically serve `404.html`, configure its documented not-found-page setting; do not rewrite every URL to the homepage.

There is no build command: the publish directory is the folder containing this README and `index.html`.

## Complete local and deployed test checklist

- [ ] Homepage and all five calculator pages load without missing CSS or JavaScript.
- [ ] All header, breadcrumb, card, article, and footer links navigate to existing pages.
- [ ] Each calculator accepts valid inputs and displays correctly labeled units and results.
- [ ] Ohm's law: try 9 V and 0.02 A; confirm 450 Î© and 0.18 W.
- [ ] LED resistor: try 5 V, 2 V, and 10 mA; confirm 300 Î© ideal, 330 Î© selected, and about 9.09 mA with that value.
- [ ] Divider: try 5 V, 1,000 Î©, and 10,000 Î©; confirm about 4.545 V unloaded.
- [ ] Color bands: brown, black, red, gold; confirm 1 kÎ© Â±5% and 950â€“1,050 Î© range.
- [ ] Power: enter 12 V and 2 A, select power; confirm 24 W.
- [ ] Numeric calculators reject missing, zero, negative, malformed, impossible, and out-of-range inputs with a visible error; clear/reset removes the old error/result. The resistor color-code calculator uses required categorical selections rather than numeric entry fields; confirm unsupported or missing band values show an error.
- [ ] Test very large finite values and overflow in each numeric calculator; verify finite results against independent calculations and confirm overflow is reported instead of displaying a fabricated result.
- [ ] Ohm's law and power calculators reject anything other than exactly two known positive values.
- [ ] Every page is readable at narrow phone width and at desktop width; browser zoom to 200% and check for clipped controls/content.
- [ ] Use keyboard-only navigation; confirm visible focus, skip link, sensible tab order, and meaningful form labels.
- [ ] Confirm the day/night control switches the palette, follows the device theme initially, and remembers a selected mode after reload and when navigating to another page.
- [ ] Check that calculator result updates are announced by a screen reader or accessibility inspection through the live region.
- [ ] Turn JavaScript off: calculator controls should explain that calculations need JavaScript while formula text remains available.
- [ ] Confirm all ten tutorial pages are linked from the index and clearly describe their practical scope and limitations.
- [ ] Confirm About, Contact, Privacy, Disclaimer, and 404 pages are reachable and accurate for the actual deployment.
- [ ] Check page titles and meta descriptions in each HTML file; ensure no guide policy or contact detail misrepresents the deployed site.
- [ ] Validate `sitemap.xml` as XML, confirm every listed URL exists at the deployed host, and check `robots.txt` points to that sitemap.
- [ ] Confirm absolute canonical links on all indexable pages use `https://circuitbench1.netlify.app/` (or the final custom domain, if configured).
- [ ] On the deployed site, directly open a nested calculator and tutorial URL, refresh each, and verify relative assets and links still work.
- [ ] Open an unknown route and confirm the host serves the custom 404 page with a 404 response (not a homepage with status 200).
- [ ] Review the hosting provider's privacy/logging behavior and update the Privacy page if deployment adds analytics, forms, cookies, or other services.

