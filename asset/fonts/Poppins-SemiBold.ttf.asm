; =========================================================================
; Poppins-SemiBold.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_SemiBold_ttf
    Poppins_SemiBold_ttf:
        incbin "Poppins-SemiBold.ttf"
