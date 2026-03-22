================================================================
 SETUP WORDPRESS — Landing Bando Competenze PMI SUD
 Aggiornato: 2026-03-09
================================================================

PREREQUISITI
------------
- WordPress + Elementor (template: Elementor Canvas)
- WP Rocket installato
- Font Outfit caricato via Google Fonts

================================================================
 STRUTTURA CARTELLA
================================================================

landing-page/
├── index.html                   ← Sorgente HTML (apri nel browser per test locale)
├── style.css                    ← CSS personalizzato
├── script.js                    ← JS configuratore + webhook n8n
├── img/
│   └── food-hub-event.jpg       ← Upload su WP Media Library
├── franco-biolatto.png          ← Upload su WP Media Library
├── css-elementor-override.css   ← CSS da aggiungere in Elementor
├── wp-rocket-exclusions.txt     ← Esclusioni da configurare in WP Rocket
├── README-setup.txt             ← Questa guida
├── n8n-setup.txt                ← Documentazione webhook → Notion
└── _archivio/                   ← Vecchie versioni (non usare)

================================================================
 STEP 1 — Caricare le immagini su WordPress Media Library
================================================================

File da caricare:
  • img/food-hub-event.jpg
  • franco-biolatto.png

DOVE: WP Admin → Media → Aggiungi file

Dopo il caricamento annotare gli URL assoluti, es.:
  https://www.food-hub.it/wp-content/uploads/2026/03/food-hub-event.jpg
  https://www.food-hub.it/wp-content/uploads/2026/03/franco-biolatto.png

================================================================
 STEP 2 — Aggiornare i path immagini nel widget Elementor
================================================================

Nel widget HTML di Elementor, fare Find & Replace:

  TROVA:       src="img/food-hub-event.jpg"
  SOSTITUISCI: src="[URL assoluto da Step 1]"

  TROVA:       src="franco-biolatto.png"
  SOSTITUISCI: src="[URL assoluto da Step 1]"

================================================================
 STEP 3 — Aggiungere il CSS override (fix conflitti Elementor)
================================================================

Elementor → Site Settings → Custom CSS
→ Incollare il contenuto del file: css-elementor-override.css

Questo fix risolve:
  - Font DM Sans di Elementor che sovrascrive Outfit
  - Bottoni arancio del kit Elementor che sovrascrivono il rosso Food Hub
  - Underline sui link aggiunto da WordPress global-styles

================================================================
 STEP 4 — Configurare WP Rocket
================================================================

Seguire le istruzioni in: wp-rocket-exclusions.txt

SOLUZIONE PIÙ RAPIDA (consigliata):
  WP Rocket → Advanced Rules → Never Delay JS on these URLs:
  → /bando-compentenze-sud/

================================================================
 STEP 5 — Correggere l'encoding dei caratteri nel widget
================================================================

Nel widget HTML di Elementor fare Find & Replace per ogni coppia:

  Ã¨  →  è        â‚¬  →  €
  Ã   →  à        â€™  →  '
  Ã²  →  ò        â€"  →  —
  Ã¹  →  ù        â€¢  →  •
  Ã©  →  é        SocietÃ   →  Società
  Ã¬  →  ì

ALTERNATIVA PIÙ VELOCE: ricopiare il contenuto da index.html
che ha già tutti i caratteri corretti.

================================================================
 STEP 6 — Webhook n8n ✅ CONFIGURATO
================================================================

URL già impostato in script.js (riga 554):
  https://n8n.srv1036443.hstgr.cloud/webhook/bando-competenze-lead

Workflow n8n già caricato su: n8n.srv1036443.hstgr.cloud
Per dettagli sul flusso e sul database Notion: vedi n8n-setup.txt

================================================================
 STEP 7 — Rimuovere i meta tag dall'interno del widget
================================================================

Il widget Elementor contiene tag <head> non necessari (duplicati
rispetto all'head reale di WordPress). Rimuovere:

  <meta charset="UTF-8">
  <meta name="viewport" ...>
  <title>Bando Competenze...</title>
  <meta name="description" ...>
  <meta name="keywords" ...>
  <link rel="preload" ...>
  <link rel="preconnect" ...>
  <link rel="canonical" ...>
  <meta name="robots" ...>
  Tutti i tag <meta property="og:...">
  Tutti i tag <meta property="twitter:...">
  Il blocco <script type="application/ld+json">...</script>

  TENERE: <link href="https://fonts.googleapis.com/...Outfit...">
  TENERE: <script src="https://cdn.tailwindcss.com">
  TENERE: <script> tailwind.config = {...} </script>
  TENERE: il blocco <style> con il CSS critico inline

================================================================
 CHECKLIST FINALE
================================================================

[ ] Step 1: Immagini caricate su WP Media Library
[ ] Step 2: Path immagini aggiornati nel widget (URL assoluti)
[ ] Step 3: css-elementor-override.css aggiunto in Elementor
[ ] Step 4: WP Rocket configurato (esclusioni Delay JS)
[ ] Step 5: Encoding testo corretto nel widget
[x] Step 6: Webhook n8n configurato (già fatto)
[ ] Step 7: Meta tag non necessari rimossi dal widget
[ ] Test: aprire la pagina in modalità incognito e verificare font e layout
[ ] Test: compilare il form configuratore e verificare ricezione su Notion

================================================================
