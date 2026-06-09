; =========================================================================
; Raja Zhafif Raditya Harahap - Assembly Builder Tool
; =========================================================================
; Target: Windows x86-64
; Assembler: NASM
; Linker: GoLink
; =========================================================================

bits 64
default rel

extern WinExec
extern ExitProcess
extern GetStdHandle
extern WriteFile
extern Sleep

section .data
    cmd_nasm    db "nasm -f win64 portfolio.asm -o portfolio.obj", 0
    cmd_link    db "golink /entry _start portfolio.obj kernel32.dll user32.dll gdi32.dll wininet.dll shell32.dll", 0
    msg_nasm    db "Builder: Assembling portfolio.asm using nasm...", 10, 0
    msg_link    db "Builder: Linking portfolio.obj using golink...", 10, 0
    msg_done    db "Builder: Build complete! Created portfolio.exe successfully.", 10, 0
    
section .text
global _start
_start:
    sub rsp, 40
    
    ; Get standard output handle
    mov ecx, -11            ; STD_OUTPUT_HANDLE
    call GetStdHandle
    mov r12, rax            ; stdout handle

    ; Write: Assembling using NASM
    mov rcx, r12
    lea rdx, [msg_nasm]
    mov r8d, 49             ; Message length
    xor r9d, r9d
    mov qword [rsp+32], 0
    call WriteFile
    
    ; Execute NASM compilation command
    lea rcx, [cmd_nasm]
    mov edx, 0              ; SW_HIDE
    call WinExec
    
    ; Sleep to wait for disk write and assembler processes to exit
    mov ecx, 1800           ; 1.8 seconds
    call Sleep
    
    ; Write: Linking using GoLink
    mov rcx, r12
    lea rdx, [msg_link]
    mov r8d, 46
    xor r9d, r9d
    mov qword [rsp+32], 0
    call WriteFile
    
    ; Execute Linker command
    lea rcx, [cmd_link]
    mov edx, 0              ; SW_HIDE
    call WinExec
    
    ; Sleep for link output write
    mov ecx, 1200           ; 1.2 seconds
    call Sleep
    
    ; Write: Build done
    mov rcx, r12
    lea rdx, [msg_done]
    mov r8d, 61
    xor r9d, r9d
    mov qword [rsp+32], 0
    call WriteFile
    
    xor ecx, ecx
    call ExitProcess
