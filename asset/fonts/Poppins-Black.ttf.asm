; =========================================================================
; Poppins-Black.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Black_ttf
    Poppins_Black_ttf:
        incbin "Poppins-Black.ttf"
