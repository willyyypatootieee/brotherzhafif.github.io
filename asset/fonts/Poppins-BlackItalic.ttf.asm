; =========================================================================
; Poppins-BlackItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_BlackItalic_ttf
    Poppins_BlackItalic_ttf:
        incbin "Poppins-BlackItalic.ttf"
