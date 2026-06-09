; =========================================================================
; Poppins-ExtraBoldItalic.ttf - Assembly Binary Inclusion
; =========================================================================
bits 64
default rel

section .data
    global Poppins_ExtraBoldItalic_ttf
    Poppins_ExtraBoldItalic_ttf:
        incbin "Poppins-ExtraBoldItalic.ttf"
