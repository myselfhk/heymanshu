# Prismic Setup Guide for heymanshu

## Step 1 — Create your Prismic repository
1. Go to https://prismic.io and sign up / log in
2. Create a new repository → name it exactly: **heymanshu**
3. Choose "React" as your framework

## Step 2 — Create Custom Types
In your Prismic dashboard go to **Custom Types** and create these 4 types.
Copy-paste the JSON from `/prismic/custom_types/` for each one.

| File | Type ID | Kind |
|------|---------|------|
| `case_study.json` | `case_study` | Repeatable |
| `article.json` | `article` | Repeatable |
| `shelf_product.json` | `shelf_product` | Repeatable |
| `settings.json` | `settings` | Single |

### How to import a Custom Type via JSON:
1. Click "Custom Types" → "Create new"
2. Choose Repeatable or Single (see table above)
3. Name it (e.g. "Case Study"), set the API ID to match the table
4. Click "JSON editor" tab and paste the contents of the JSON file
5. Save

## Step 3 — Add your content

### Case Studies (3 documents: paytm, honda, woo)
Set the **URL Slug** (UID) to: `paytm`, `honda`, `woo`

**Manifesto Card tab** — fill in per study:
| Study | Order | Title | Color |
|-------|-------|-------|-------|
| Woo | 01 | Woo. Nigerian Payments Platform | #3D5A80 |
| Honda | 02 | Honda. Customer Portal | #2E6B5E |
| Paytm | 03 | Paytm. Design System | #5A3F72 |

Add a 4th document with slug `focus-flow`, manifesto order 04, "Has case study link?" = No (placeholder project).

### Articles (3 documents)
UIDs: `startup-ux-fails`, `design-system-shared-language`, `building-trust-digital-payments`

### Shelf Products (2 documents)
UIDs: `design-audit-playbook`, `fintech-ui-kit`

### Settings (1 document — auto-created as Single type)
- Upload your 8 gallery images
- Fill in the philosophy quote
- Fill in the About page content

## Step 4 — Publish
Click **Publish** on every document.

## Step 5 — Private repository (optional)
If you set repository access to **Private** in Settings:
1. Go to Settings → API & Security → Generate an access token
2. Add it to `.env`:
   ```
   VITE_PRISMIC_ACCESS_TOKEN=your_token_here
   ```

## How fallbacks work
The site ships with all content hardcoded as fallback.
- If Prismic is unreachable → fallback data is shown (site never breaks)
- Once Prismic has content → Prismic data takes over automatically

## Adding new content going forward
- **New case study** → create a new Case Study document in Prismic, publish it
- **New article** → create a new Article document, publish it
- **New shelf product** → create a new Shelf Product document, publish it
- **Change gallery images** → edit the Settings document, upload new images, publish
- **Change philosophy quote** → edit Settings → Philosophy tab, publish
