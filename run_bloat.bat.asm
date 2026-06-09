; =========================================================================
; run_bloat.bat - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global run_bloat_bat
    run_bloat_bat db '@echo off', 10
                  db 'echo Compiling bloat_generator.asm...', 10
                  db 'nasm -f win64 bloat_generator.asm -o bloat_generator.obj', 10
                  db 'echo Linking bloat_generator.obj...', 10
                  db 'golink /entry _start bloat_generator.obj kernel32.dll', 10
                  db 'echo Running bloat_generator.exe to generate 100,000 assembly files...', 10
                  db 'bloat_generator.exe', 10
                  db 'echo Done! 100,000 files created in "bloat" folder.', 10
                  db 'pause', 10, 0
