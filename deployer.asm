; =========================================================================
; Raja Zhafif Raditya Harahap - Assembly Deployer Tool
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
extern CreateFileA
extern CloseHandle

section .data
    filename    db "portfolio.exe", 0
    cmd_run     db "portfolio.exe", 0
    msg_check   db "Deployer: Verifying build status of portfolio.exe...", 10, 0
    msg_ok      db "Deployer: Validation success! Launching portfolio.exe...", 10, 0
    msg_fail    db "Deployer: Critical Error - portfolio.exe was not found! Build first.", 10, 0

section .text
global _start
_start:
    sub rsp, 40
    
    ; Get standard output handle
    mov ecx, -11            ; STD_OUTPUT_HANDLE
    call GetStdHandle
    mov r12, rax            ; stdout

    ; Write checking message
    mov rcx, r12
    lea rdx, [msg_check]
    mov r8d, 52             ; Message length
    xor r9d, r9d
    mov qword [rsp+32], 0
    call WriteFile
    
    ; Validate the existence of portfolio.exe by attempting to open it
    lea rcx, [filename]
    mov edx, 0x80000000     ; GENERIC_READ
    mov r8d, 1              ; FILE_SHARE_READ
    xor r9d, r9d            ; NULL Security
    sub rsp, 48
    mov qword [rsp+32], 3   ; OPEN_EXISTING
    mov qword [rsp+40], 0x80 ; FILE_ATTRIBUTE_NORMAL
    mov qword [rsp+48], 0   ; NULL Template
    call CreateFileA
    add rsp, 48
    
    cmp rax, -1             ; INVALID_HANDLE_VALUE = -1
    je .not_found
    
    ; Close the test handle since the file is valid
    mov rcx, rax
    call CloseHandle
    
    ; Write validation success
    mov rcx, r12
    lea rdx, [msg_ok]
    mov r8d, 56
    xor r9d, r9d
    mov qword [rsp+32], 0
    call WriteFile
    
    ; Launch the application
    lea rcx, [cmd_run]
    mov edx, 1              ; SW_SHOWNORMAL
    call WinExec
    jmp .exit
    
.not_found:
    ; Write validation failure
    mov rcx, r12
    lea rdx, [msg_fail]
    mov r8d, 69
    xor r9d, r9d
    mov qword [rsp+32], 0
    call WriteFile
    
.exit:
    xor ecx, ecx
    call ExitProcess
