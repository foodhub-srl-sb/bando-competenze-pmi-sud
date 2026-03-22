<?php
/**
 * Template Name: Landing Bando Competenze PMI
 * Description: Template ottimizzato per la landing page del bando competenze.
 */

// Evitiamo l'accesso diretto
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>

    <!-- Performance & Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    
    <!-- Tailwind & Lucide (CDN) -->
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

    <!-- Includiamo gli stili ottimizzati -->
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/landing-page/style.css">
    <style>
        /* Critico per evitare FOUC su WP */
        body { background-color: #0A0A0A; color: #D1D5DB; }
        .reveal { opacity: 0; }
        #navbar.shadow-lg { background-color: rgba(10, 10, 10, 0.95); }
    </style>
</head>

<body <?php body_class('bg-dark-bg text-gray-300 font-sans antialiased overflow-x-hidden'); ?>>

    <?php 
    // Qui inseriremo tutto il contenuto del <body> dell'index.html 
    // che è già stato ottimizzato nei passaggi precedenti.
    ?>

    <!-- Main Content -->
    <div id="landing-bando-wrapper">
        <!-- Contenuto HTML della Landing (Navbar, Hero, Calcolatore, ecc.) -->
        <?php include(get_template_directory() . '/landing-page/content-part.php'); ?>
    </div>

    <!-- Script Post-Footer -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="<?php echo get_template_directory_uri(); ?>/landing-page/script.js"></script>

    <?php wp_footer(); ?>
</body>
</html>
