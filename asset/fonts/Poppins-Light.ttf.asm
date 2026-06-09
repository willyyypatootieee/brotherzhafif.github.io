; =========================================================================
; Poppins-Light.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Light_ttf
    Poppins_Light_ttf:
        incbin "Poppins-Light.ttf"
