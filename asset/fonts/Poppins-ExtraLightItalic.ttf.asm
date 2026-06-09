; =========================================================================
; Poppins-ExtraLightItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_ExtraLightItalic_ttf
    Poppins_ExtraLightItalic_ttf:
        incbin "Poppins-ExtraLightItalic.ttf"
