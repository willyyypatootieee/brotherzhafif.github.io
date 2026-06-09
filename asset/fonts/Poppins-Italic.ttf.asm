; =========================================================================
; Poppins-Italic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Italic_ttf
    Poppins_Italic_ttf:
        incbin "Poppins-Italic.ttf"
