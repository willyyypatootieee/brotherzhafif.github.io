; =========================================================================
; asset/tailwind.css - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global tailwind_css_content
    tailwind_css_content db '@tailwind base;', 10
                         db '@tailwind components;', 10
                         db '@tailwind utilities;', 10
                         db '.bg-dark { @apply bg-background text-white; }', 10
                         db '.bg-surface { @apply bg-surface text-white; }', 10
                         db '.text-neutral-400 { color: #b0b3c7; }', 10
                         db '.font-mono { font-family: Fira Mono, Menlo, Monaco, Consolas, monospace; }', 10, 0
