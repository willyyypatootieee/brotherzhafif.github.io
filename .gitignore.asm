; =========================================================================
; .gitignore - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global gitignore_content
    gitignore_content db 'admin.html', 10
                      db '*.rsuser', 10
                      db '*.suo', 10
                      db '*.user', 10
                      db '*.userosscache', 10
                      db '*.sln.docstates', 10
                      db '[Dd]ebug/', 10
                      db '[Rr]elease/', 10
                      db 'x64/', 10
                      db 'x86/', 10
                      db '[Bb]in/', 10
                      db '[Oo]bj/', 10
                      db '[Oo]ut/', 10
                      db '.vs/', 10
                      db 'node_modules/', 10
                      db 'portfolio.obj', 10
                      db 'builder.obj', 10
                      db 'deployer.obj', 10
                      db 'portfolio.exe', 10
                      db 'builder.exe', 10
                      db 'deployer.exe', 10, 0
