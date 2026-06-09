; =========================================================================
; Poppins-Bold.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Bold_ttf
    Poppins_Bold_ttf:
        incbin "Poppins-Bold.ttf"
