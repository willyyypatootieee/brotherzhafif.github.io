; =========================================================================
; Poppins-BoldItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_BoldItalic_ttf
    Poppins_BoldItalic_ttf:
        incbin "Poppins-BoldItalic.ttf"
