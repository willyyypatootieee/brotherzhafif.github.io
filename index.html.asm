; =========================================================================
; index.html - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global index_html_content
    index_html_content db '<!DOCTYPE html>', 10
                       db '<html lang="en" class="scroll-smooth">', 10
                       db '<head>', 10
                       db '    <meta charset="UTF-8" />', 10
                       db '    <link rel="stylesheet" href="asset/style.css">', 10
                       db '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />', 10
                       db '    <title>Raja Zhafif Raditya Harahap</title>', 10
                       db '    <link id="web-favicon" rel="shortcut icon" href="" type="image/x-icon">', 10
                       db '    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />', 10
                       db '    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />', 10
                       db '    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">', 10
                       db '    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>', 10
                       db '    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', 10
                       db '    <script src="https://cdn.tailwindcss.com"></script>', 10
                       db '</head>', 10
                       db '<body class="overflow-x-hidden w-full text-white bg-[#333445]">', 10
                       db '    <!-- Navigation, Header, Achievements, and contact elements -->', 10
                       db '    <!-- Dynamic Portfolio Content loaded via script.js -->', 10
                       db '    <script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>', 10
                       db '    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>', 10
                       db '    <script src="asset/script.js"></script>', 10
                       db '</body>', 10
                       db '</html>', 10, 0
