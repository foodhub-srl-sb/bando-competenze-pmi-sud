import os

path_css = r'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\style.css'
path_js = r'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\script.js'
path_html = r'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\index.html'
output_path = r'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\wordpress-FULL-FINAL.txt'

with open(path_css, 'r', encoding='utf-8') as f:
    css = f.read()

with open(path_js, 'r', encoding='utf-8') as f:
    js = f.read()

with open(path_html, 'r', encoding='utf-8') as f:
    html = f.read()

# Estraggo solo il contenuto del body
import re
body_match = re.search(r'<body.*?>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
if body_match:
    body_content = body_match.group(1)
else:
    body_content = html

# Costruisco il pacchetto finale
final_code = f"""
<div id="fh-landing-scope" style="all: initial; font-family: 'DM Sans', sans-serif; display: block; background-color: #0A0A0A; color: #D1D5DB; min-height: 100vh;">
    <!-- Tailwind CSS (via CDN - per compatibilità totale WP) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    fontFamily: {{ sans: ['DM Sans', 'sans-serif'] }},
                    colors: {{
                        brand: {{ orange: '#F39E5F', green: '#5CB47B' }},
                        accent: {{ DEFAULT: '#5CB47B', hover: '#4A9364' }},
                        btn: {{ DEFAULT: '#CC1255', hover: '#A80E44' }},
                        dark: {{ bg: '#0A0A0A', card: '#161616', border: '#2A2A2A' }}
                    }}
                }}
            }}
        }}
    </script>

    <style>
        {css}
        
        /* Fix aggiuntivi per WordPress */
        #fh-landing-scope nav.fixed {{ top: 0 !important; }}
        .admin-bar #fh-landing-scope nav.fixed {{ top: 32px !important; }}
        @media screen and (max-width: 782px) {{
            .admin-bar #fh-landing-scope nav.fixed {{ top: 46px !important; }}
        }}
    </style>

    {body_content}

    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        {js}
    </script>
</div>
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(final_code)

print(f"File generato con successo in {output_path}")
