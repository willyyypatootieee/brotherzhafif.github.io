; =========================================================================
; Poppins-Thin.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Thin_ttf
    Poppins_Thin_ttf:
        incbin "Poppins-Thin.ttf"
