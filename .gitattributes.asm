; =========================================================================
; .gitattributes - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global gitattributes_content
    gitattributes_content db '* text=auto', 10
                          db '*.html linguist-detectable=false', 10
                          db '*.css linguist-detectable=false', 10, 0
