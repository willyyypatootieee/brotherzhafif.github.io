; =========================================================================
; Poppins-Medium.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Medium_ttf
    Poppins_Medium_ttf:
        incbin "Poppins-Medium.ttf"
