; =========================================================================
; Poppins-ExtraBold.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_ExtraBold_ttf
    Poppins_ExtraBold_ttf:
        incbin "Poppins-ExtraBold.ttf"
