; =========================================================================
; tailwind.config.js - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global tailwind_config_js
    tailwind_config_js db 'module.exports = {', 10
                       db '    content: [', 10
                       db '        "./index.html",', 10
                       db '        "./asset/script.js",', 10
                       db '        "./asset/style.css"', 10
                       db '    ],', 10
                       db '    darkMode: "class",', 10
                       db '    theme: {', 10
                       db '        extend: {', 10
                       db '            colors: {', 10
                       db '                background: "#11121a",', 10
                       db '                surface: "#1f202b",', 10
                       db '                neutral: {', 10
                       db '                    400: "#b0b3c7",', 10
                       db '                    50: "#f6f7fb"', 10
                       db '                }', 10
                       db '            },', 10
                       db '            fontFamily: {', 10
                       db '                mono: ["Fira Mono", "Menlo", "Monaco", "Consolas", "monospace"]', 10
                       db '            }', 10
                       db '        }', 10
                       db '    },', 10
                       db '    plugins: []', 10
                       db '};', 10, 0
