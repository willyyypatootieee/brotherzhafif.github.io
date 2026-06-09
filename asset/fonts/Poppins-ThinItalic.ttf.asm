; =========================================================================
; Poppins-ThinItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_ThinItalic_ttf
    Poppins_ThinItalic_ttf:
        incbin "Poppins-ThinItalic.ttf"
