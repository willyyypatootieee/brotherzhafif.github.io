; =========================================================================
; Poppins-Regular.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_Regular_ttf
    Poppins_Regular_ttf:
        incbin "Poppins-Regular.ttf"
