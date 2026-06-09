; =========================================================================
; asset/script.js - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global script_js_content
    script_js_content db 'function refreshLightbox() {', 10
                      db '    if (typeof customLightbox !== "undefined" && customLightbox) {', 10
                      db '        customLightbox.destroy();', 10
                      db '    }', 10
                      db '    customLightbox = GLightbox({', 10
                      db '        selector: ".glightbox",', 10
                      db '        touchNavigation: true,', 10
                      db '        loop: true,', 10
                      db '        zoomable: true', 10
                      db '    });', 10
                      db '}', 10
                      db 'const SUPABASE_URL = "https://cequvuujxqkzguvxbpzg.supabase.co";', 10
                      db 'const SUPABASE_KEY = "sb_publishable_TbMXWbW5nhIyUU7QlIayIg_quPVpE3g";', 10
                      db 'const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);', 10
                      db '// ... client-side JS data loading and events handlers ...', 10, 0
