; =========================================================================
; CNAME - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global cname_domain
    cname_domain db 'brotherzhafif.my.id', 10, 0
