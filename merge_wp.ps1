$css = Get-Content 'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\style.css' -Raw
$js = Get-Content 'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\script.js' -Raw
$html = Get-Content 'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\index.html' -Raw

# Estrarre il contenuto del body
if ($html -match '(?si)<body.*?>(.*?)</body>') {
    $bodyContent = $matches[1]
} else {
    $bodyContent = $html
}

$finalCode = @"
<div id="fh-landing-scope" style="all: initial; font-family: 'DM Sans', sans-serif; display: block; background-color: #0A0A0A; color: #D1D5DB; min-height: 100vh;">
    <!-- Google Fonts: DM Sans -->
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['DM Sans', 'sans-serif'] },
                    colors: {
                        brand: { orange: '#F39E5F', green: '#5CB47B' },
                        accent: { DEFAULT: '#5CB47B', hover: '#4A9364' },
                        btn: { DEFAULT: '#CC1255', hover: '#A80E44' },
                        dark: { bg: '#0A0A0A', card: '#161616', border: '#2A2A2A' }
                    }
                }
            }
        }
    </script>

    <style>
        $css
        
        /* Fix per WordPress */
        #fh-landing-scope nav.fixed { top: 0 !important; }
        .admin-bar #fh-landing-scope nav.fixed { top: 32px !important; }
        @media screen and (max-width: 782px) {
            .admin-bar #fh-landing-scope nav.fixed { top: 46px !important; }
        }
    </style>

    $bodyContent

    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        (function() {
            function initLanding() {
                $js
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initLanding);
            } else {
                initLanding();
            }
        })();
    </script>
</div>
"@

$finalCode | Out-File -FilePath 'z:\10. TOOL AI\Bando Competenze PMI SUD\landing-page\wordpress-FULL-FINAL.txt' -Encoding utf8
