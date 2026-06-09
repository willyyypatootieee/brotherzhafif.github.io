; =========================================================================
; Poppins-SemiBoldItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_SemiBoldItalic_ttf
    Poppins_SemiBoldItalic_ttf:
        incbin "Poppins-SemiBoldItalic.ttf"
