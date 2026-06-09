; =========================================================================
; asset/style.css - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global style_css_content
    style_css_content db '#achievement-drawer {', 10
                      db '    transition: none !important;', 10
                      db '    will-change: height, opacity;', 10
                      db '}', 10
                      db '[data-anime] {', 10
                      db '    opacity: 0;', 10
                      db '    transform: translateY(20px);', 10
                      db '    transition: all 0.1s ease-out;', 10
                      db '}', 10
                      db 'body {', 10
                      db '    background-color: #333445;', 10
                      db '}', 10
                      db '::-webkit-scrollbar-track {', 10
                      db '    background-color: #11121a;', 10
                      db '}', 10
                      db '::-webkit-scrollbar-thumb {', 10
                      db '    background-color: black;', 10
                      db '}', 10
                      db '::-webkit-scrollbar {', 10
                      db '    width: 0px;', 10
                      db '}', 10
                      db '@media only screen and (min-width: 1024px) {', 10
                      db '    ::-webkit-scrollbar {', 10
                      db '        width: 2vh;', 10
                      db '    }', 10
                      db '}', 10, 0
