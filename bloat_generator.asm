; =========================================================================
; Raja Zhafif Raditya Harahap - Bloat Generator Tool
; =========================================================================
; Target: Windows x86-64
; Assembler: NASM
; Linker: GoLink
; =========================================================================

bits 64
default rel

extern CreateDirectoryA
extern CreateFileA
extern WriteFile
extern CloseHandle
extern ExitProcess
extern lstrcatA
extern lstrcpyA

section .data
    dir_name        db "bloat", 0
    path_prefix     db "bloat\bloat_", 0
    path_suffix     db ".asm", 0

    ; Templates for file content
    content_part1   db "; bloat_", 0
    content_part2   db ".asm", 13, 10, "section .text", 13, 10, "    global bloat_function_", 0
    content_part3   db 13, 10, "bloat_function_", 0
    content_part4   db ":", 13, 10, "    nop", 13, 10, "    ret", 13, 10, 0

section .bss
    num_str         resb 32
    file_path       resb 256
    file_content    resb 1024

section .text
global _start

_start:
    sub rsp, 40

    ; 1. Create Directory "bloat"
    lea rcx, [dir_name]
    xor edx, edx            ; NULL
    call CreateDirectoryA

    ; 2. Loop from 0 to 99999
    mov r15, 0              ; Loop counter

.loop_start:
    cmp r15, 100000
    jae .loop_end

    ; Convert current number to string
    mov rax, r15
    lea rdi, [num_str]
    call int_to_string

    ; Build File Path: "bloat\bloat_[number].asm"
    lea rcx, [file_path]
    lea rdx, [path_prefix]
    call lstrcpyA

    lea rcx, [file_path]
    lea rdx, [num_str]
    call lstrcatA

    lea rcx, [file_path]
    lea rdx, [path_suffix]
    call lstrcatA

    ; Build File Content:
    ; ; bloat_[number].asm
    ; section .text
    ;     global bloat_function_[number]
    ; bloat_function_[number]:
    ;     nop
    ;     ret
    
    lea rcx, [file_content]
    lea rdx, [content_part1]
    call lstrcpyA

    lea rcx, [file_content]
    lea rdx, [num_str]
    call lstrcatA

    lea rcx, [file_content]
    lea rdx, [content_part2]
    call lstrcatA

    lea rcx, [file_content]
    lea rdx, [num_str]
    call lstrcatA

    lea rcx, [file_content]
    lea rdx, [content_part3]
    call lstrcatA

    lea rcx, [file_content]
    lea rdx, [num_str]
    call lstrcatA

    lea rcx, [file_content]
    lea rdx, [content_part4]
    call lstrcatA

    ; Create File
    lea rcx, [file_path]
    mov edx, 0x40000000     ; GENERIC_WRITE
    xor r8d, r8d            ; Share Mode = 0
    xor r9d, r9d            ; Security = NULL
    sub rsp, 48
    mov qword [rsp+32], 2   ; CREATE_ALWAYS
    mov qword [rsp+40], 0x80 ; FILE_ATTRIBUTE_NORMAL
    mov qword [rsp+48], 0   ; Template = NULL
    call CreateFileA
    add rsp, 48

    cmp rax, -1             ; INVALID_HANDLE_VALUE
    je .next_iter
    mov r12, rax            ; File handle in r12

    ; Write File Content
    ; Get length of file_content
    lea rcx, [file_content]
    call string_length

    mov rcx, r12            ; hFile
    lea rdx, [file_content]  ; lpBuffer
    mov r8d, eax            ; nNumberOfBytesToWrite
    lea r9, [rsp+32]        ; lpNumberOfBytesWritten (re-use stack)
    sub rsp, 40
    mov qword [rsp+32], 0
    call WriteFile
    add rsp, 40

    ; Close Handle
    mov rcx, r12
    call CloseHandle

.next_iter:
    inc r15
    jmp .loop_start

.loop_end:
    xor ecx, ecx
    call ExitProcess

; =========================================================================
; Helper: Integer to String (rax = integer, rdi = buffer)
; =========================================================================
int_to_string:
    push rbx
    push rcx
    push rdx
    push rsi
    push rdi

    mov rbx, 10
    xor ecx, ecx

.div_loop:
    xor rdx, rdx
    div rbx                 ; rax = quotient, rdx = remainder
    push rdx
    inc ecx
    test rax, rax
    jnz .div_loop

.write_loop:
    pop rdx
    add dl, '0'
    mov [rdi], dl
    inc rdi
    dec ecx
    jnz .write_loop

    mov byte [rdi], 0

    pop rdi
    pop rsi
    pop rdx
    pop rcx
    pop rbx
    ret

; =========================================================================
; Helper: String Length (rcx = string, returns length in eax)
; =========================================================================
string_length:
    xor eax, eax
.loop:
    mov dl, [rcx+rax]
    test dl, dl
    jz .done
    inc eax
    jmp .loop
.done:
    ret
