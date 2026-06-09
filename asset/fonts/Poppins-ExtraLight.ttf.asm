; =========================================================================
; Poppins-ExtraLight.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_ExtraLight_ttf
    Poppins_ExtraLight_ttf:
        incbin "Poppins-ExtraLight.ttf"
