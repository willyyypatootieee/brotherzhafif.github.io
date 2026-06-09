; =========================================================================
; Poppins-LightItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_LightItalic_ttf
    Poppins_LightItalic_ttf:
        incbin "Poppins-LightItalic.ttf"
