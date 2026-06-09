; =========================================================================
; bloat_generator.asm - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global bloat_generator_asm
    bloat_generator_asm db '; =========================================================================', 10
                        db '; Raja Zhafif Raditya Harahap - Bloat Generator Tool', 10
                        db '; =========================================================================', 10
                        db 'bits 64', 10
                        db 'default rel', 10
                        db 'extern CreateDirectoryA', 10
                        db 'extern CreateFileA', 10
                        db 'extern WriteFile', 10
                        db 'extern CloseHandle', 10
                        db 'extern ExitProcess', 10
                        db '; ... (contains the full content of bloat_generator.asm) ...', 10, 0
