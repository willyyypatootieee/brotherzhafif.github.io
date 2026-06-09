; =========================================================================
; Poppins-MediumItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_MediumItalic_ttf
    Poppins_MediumItalic_ttf:
        incbin "Poppins-MediumItalic.ttf"
