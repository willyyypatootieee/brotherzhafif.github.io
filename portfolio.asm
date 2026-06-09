; =========================================================================
; Raja Zhafif Raditya Harahap - Native x86-64 Windows Assembly Portfolio
; =========================================================================
; Target: Windows x86-64 (AMD64)
; Assembler: NASM (Intel Syntax)
; Linker: GoLink or MSVC link.exe
; =========================================================================

bits 64
default rel

; External Windows API function declarations
extern ExitProcess
extern GetModuleHandleA
extern CreateThread
extern Sleep
extern lstrlenA
extern RegisterClassExA
extern CreateWindowExA
extern ShowWindow
extern UpdateWindow
extern GetMessageA
extern TranslateMessage
extern DispatchMessageA
extern PostQuitMessage
extern DefWindowProcA
extern BeginPaint
extern EndPaint
extern GetClientRect
extern InvalidateRect
extern MessageBoxA
extern CreateSolidBrush
extern FillRect
extern CreateFontA
extern SelectObject
extern DeleteObject
extern SetTextColor
extern SetBkMode
extern DrawTextA
extern InternetOpenA
extern InternetConnectA
extern HttpOpenRequestA
extern HttpSendRequestA
extern InternetReadFile
extern InternetCloseHandle
extern ShellExecuteA
extern LoadCursorA

section .data
    ; Class & Window Titles
    class_name      db "PortfolioWindowClass", 0
    window_title    db "Raja Zhafif Raditya Harahap - Assembly Portfolio", 0
    msg_err_init    db "Failed to register window class or create window.", 0
    msg_err_caption db "Initialization Error", 0

    ; Font configurations
    font_segoe      db "Segoe UI", 0
    font_consolas   db "Consolas", 0

    ; Supabase HTTPS configuration
    supabase_host   db "cequvuujxqkzguvxbpzg.supabase.co", 0
    supabase_path_me db "/rest/v1/me?select=*", 0
    supabase_path_posts db "/rest/v1/posts?select=*&order=order_num.asc,created_at.desc", 0
    
    ; Supabase API authorization headers
    http_headers    db "apikey: sb_publishable_TbMXWbW5nhIyUU7QlIayIg_quPVpE3g", 13, 10
                    db "Authorization: Bearer sb_publishable_TbMXWbW5nhIyUU7QlIayIg_quPVpE3g", 13, 10
                    db "Accept: application/json", 13, 10, 0
    http_verb_get   db "GET", 0
    agent_name      db "AssemblyHttpClient", 0

    ; JSON keys (including double quotes to avoid false positive substring matches)
    key_name        db 34, "name", 34, 0
    key_alias       db 34, "alias", 34, 0
    key_role        db 34, "role", 34, 0
    key_org         db 34, "organization", 34, 0
    key_desc        db 34, "description", 34, 0
    key_title       db 34, "title", 34, 0
    key_year        db 34, "year", 34, 0
    key_type        db 34, "type", 34, 0

    ; JSON parsing string constants
    str_achievement db "achievement", 0
    str_certificate db "certificate", 0

    ; Fallback state display text
    text_loading    db "Loading profile from Supabase API in background...", 0
    text_error      db "Error loading data. Check internet connection.", 0
    
    ; Section titles
    title_achieve   db "ACHIEVEMENTS", 0
    title_certs     db "CERTIFICATES", 0
    
    ; Interactive Social Links
    social_github   db "GitHub: github.com/brotherzhafif", 0
    url_github      db "https://github.com/brotherzhafif", 0
    social_insta    db "Instagram: @razafif_", 0
    url_insta       db "https://instagram.com/razafif_", 0
    social_linkedin db "LinkedIn Connection", 0
    url_linkedin    db "https://www.linkedin.com/in/raja-zhafif-raditya-harahap-577bb6293/", 0
    str_open        db "open", 0

    ; Colors (BGR format: 0x00BBGGRR)
    color_bg        dq 0x002D2422   ; #22242D (darker charcoal background)
    color_card      dq 0x003D2E2B   ; #2B2E3D (card surface background)
    color_blue      dq 0x00FF9D3B   ; #3B9DFF (vibrant profile blue)
    color_text      dq 0x00ECECEC   ; #ECECEC (warm white text)
    color_gray      dq 0x00909090   ; #909090 (muted gray subtext)

section .bss
    h_instance      resq 1
    h_wnd           resq 1
    h_font_title    resq 1
    h_font_body     resq 1
    h_font_mono     resq 1
    h_brush_bg      resq 1
    h_brush_card    resq 1

    ; Threading & Network buffers
    h_thread        resq 1
    loading_done    resb 1          ; 0 = loading, 1 = success, 2 = error
    buf_me_json     resb 16384      ; 16KB for profile JSON response
    buf_posts_json  resb 65536      ; 64KB for posts JSON response

    ; Extracted profile data strings
    val_name        resb 256
    val_alias       resb 256
    val_role        resb 256
    val_org         resb 256
    val_desc        resb 1024

    ; Extracted achievements & certificates lists
    ach_titles      resb 256 * 5    ; up to 5 items
    ach_years       resb 64 * 5
    ach_count       resq 1

    cert_titles     resb 256 * 5    ; up to 5 items
    cert_years      resb 64 * 5
    cert_count      resq 1

section .text
global _start

_start:
    sub rsp, 40
    call main
    xor ecx, ecx
    call ExitProcess

main:
    push rbx
    push rdi
    sub rsp, 208 ; WNDCLASSEX struct (80) + MSG struct (48) + local variables + shadow space

    ; Get module handle of current process
    xor ecx, ecx
    call GetModuleHandleA
    mov [h_instance], rax

    ; Create background brushes
    mov rcx, [color_bg]
    call CreateSolidBrush
    mov [h_brush_bg], rax

    mov rcx, [color_card]
    call CreateSolidBrush
    mov [h_brush_card], rax

    ; Create Segoe UI Title Font (size 28, bold)
    sub rsp, 120
    mov dword [rsp+32], 700 ; FW_BOLD
    mov dword [rsp+40], 0
    mov dword [rsp+48], 0
    mov dword [rsp+56], 0
    mov dword [rsp+64], 1   ; DEFAULT_CHARSET
    mov dword [rsp+72], 0
    mov dword [rsp+80], 0
    mov dword [rsp+88], 5   ; CLEARTYPE_QUALITY
    mov dword [rsp+96], 0
    lea rax, [font_segoe]
    mov qword [rsp+104], rax
    mov ecx, 28             ; Height
    xor edx, edx
    xor r8d, r8d
    xor r9d, r9d
    call CreateFontA
    add rsp, 120
    mov [h_font_title], rax

    ; Create Segoe UI Body Font (size 16, bold)
    sub rsp, 120
    mov dword [rsp+32], 700 ; FW_BOLD
    mov dword [rsp+40], 0
    mov dword [rsp+48], 0
    mov dword [rsp+56], 0
    mov dword [rsp+64], 1
    mov dword [rsp+72], 0
    mov dword [rsp+80], 0
    mov dword [rsp+88], 5
    mov dword [rsp+96], 0
    lea rax, [font_segoe]
    mov qword [rsp+104], rax
    mov ecx, 16
    xor edx, edx
    xor r8d, r8d
    xor r9d, r9d
    call CreateFontA
    add rsp, 120
    mov [h_font_body], rax

    ; Create Consolas Mono Font (size 14, normal)
    sub rsp, 120
    mov dword [rsp+32], 400 ; FW_NORMAL
    mov dword [rsp+40], 0
    mov dword [rsp+48], 0
    mov dword [rsp+56], 0
    mov dword [rsp+64], 1
    mov dword [rsp+72], 0
    mov dword [rsp+80], 0
    mov dword [rsp+88], 5
    mov dword [rsp+96], 0
    lea rax, [font_consolas]
    mov qword [rsp+104], rax
    mov ecx, 14
    xor edx, edx
    xor r8d, r8d
    xor r9d, r9d
    call CreateFontA
    add rsp, 120
    mov [h_font_mono], rax

    ; Populate WNDCLASSEX structure at rsp+48
    mov dword [rsp+48], 80 ; cbSize
    mov dword [rsp+52], 3  ; style = CS_HREDRAW | CS_VREDRAW
    lea rax, [WndProc]
    mov qword [rsp+56], rax ; lpfnWndProc
    mov dword [rsp+64], 0
    mov dword [rsp+68], 0
    mov rax, [h_instance]
    mov qword [rsp+72], rax
    mov qword [rsp+80], 0
    
    ; Load Cursor
    xor ecx, ecx
    mov edx, 32512         ; IDC_ARROW
    call LoadCursorA
    mov qword [rsp+88], rax
    
    mov rax, [h_brush_bg]
    mov qword [rsp+96], rax
    mov qword [rsp+104], 0
    lea rax, [class_name]
    mov qword [rsp+112], rax
    mov qword [rsp+120], 0

    lea rcx, [rsp+48]
    call RegisterClassExA
    test ax, ax
    jz .error_exit

    ; Create Windows GUI Window
    xor ecx, ecx
    lea rdx, [class_name]
    lea r8, [window_title]
    mov r9d, 0x10CF0000     ; WS_OVERLAPPEDWINDOW | WS_VISIBLE
    sub rsp, 72
    mov dword [rsp+32], 100 ; x
    mov dword [rsp+40], 100 ; y
    mov dword [rsp+48], 920 ; width
    mov dword [rsp+56], 700 ; height
    mov qword [rsp+64], 0
    mov qword [rsp+72], 0
    mov rax, [h_instance]
    mov qword [rsp+80], rax
    mov qword [rsp+88], 0
    call CreateWindowExA
    add rsp, 72
    test rax, rax
    jz .error_exit
    mov [h_wnd], rax

    ; Show and refresh window
    mov rcx, [h_wnd]
    mov edx, 5              ; SW_SHOW
    call ShowWindow
    mov rcx, [h_wnd]
    call UpdateWindow

    ; Main Message Pump
.msg_loop:
    lea rcx, [rsp+128]      ; MSG struct offset
    xor edx, edx
    xor r8d, r8d
    xor r9d, r9d
    call GetMessageA
    test eax, eax
    je .loop_done
    
    lea rcx, [rsp+128]
    call TranslateMessage
    lea rcx, [rsp+128]
    call DispatchMessageA
    jmp .msg_loop

.loop_done:
    jmp .exit

.error_exit:
    xor ecx, ecx
    lea rdx, [msg_err_init]
    lea r8, [msg_err_caption]
    xor r9d, r9d
    call MessageBoxA

.exit:
    add rsp, 208
    pop rdi
    pop rbx
    ret

; =========================================================================
; Window Procedure Event Handler
; =========================================================================
WndProc:
    push rbx
    push rsi
    push rdi
    sub rsp, 160            ; Allocate space for PAINTSTRUCT (72) + local RECT (16) + align
    
    mov rbx, rcx            ; hwnd

    cmp edx, 2              ; WM_DESTROY
    je .on_destroy
    cmp edx, 1              ; WM_CREATE
    je .on_create
    cmp edx, 15             ; WM_PAINT
    je .on_paint
    cmp edx, 0x0201         ; WM_LBUTTONDOWN
    je .on_lbuttondown
    
    ; Default handling
    add rsp, 160
    pop rdi
    pop rsi
    pop rbx
    jmp DefWindowProcA

.on_create:
    ; Launch asynchronous data fetching thread so UI thread doesn't lock
    xor ecx, ecx
    xor edx, edx
    lea r8, [FetchDataThread]
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 0
    call CreateThread
    add rsp, 48
    mov [h_thread], rax
    
    xor eax, eax
    jmp .done

.on_lbuttondown:
    ; click coordinates in r9
    mov r10d, r9d
    and r10d, 0xFFFF        ; X coord
    mov r11d, r9d
    shr r11d, 16            ; Y coord
    
    cmp r11d, 590
    jl .exit_lbutton
    cmp r11d, 630
    jg .exit_lbutton
    
    ; Check click bounds for GitHub
    cmp r10d, 40
    jl .exit_lbutton
    cmp r10d, 300
    jle .click_github
    
    ; Check click bounds for Instagram
    cmp r10d, 320
    jl .exit_lbutton
    cmp r10d, 580
    jle .click_insta
    
    ; Check click bounds for LinkedIn
    cmp r10d, 600
    jl .exit_lbutton
    cmp r10d, 860
    jle .click_linkedin
    
    jmp .exit_lbutton

.click_github:
    xor ecx, ecx
    lea rdx, [str_open]
    lea r8, [url_github]
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 1
    call ShellExecuteA
    add rsp, 48
    jmp .exit_lbutton

.click_insta:
    xor ecx, ecx
    lea rdx, [str_open]
    lea r8, [url_insta]
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 1
    call ShellExecuteA
    add rsp, 48
    jmp .exit_lbutton

.click_linkedin:
    xor ecx, ecx
    lea rdx, [str_open]
    lea r8, [url_linkedin]
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 1
    call ShellExecuteA
    add rsp, 48
    jmp .exit_lbutton

.exit_lbutton:
    xor eax, eax
    jmp .done

.on_paint:
    ; BeginPaint (hwnd = rbx, ps = rsp+32)
    mov rcx, rbx
    lea rdx, [rsp+32]
    call BeginPaint
    mov rsi, rax            ; rsi = hdc

    ; Get client rect (hwnd = rbx, rect = rsp+112)
    mov rcx, rbx
    lea rdx, [rsp+112]
    call GetClientRect

    ; Clear entire window client background
    mov rcx, rsi
    lea rdx, [rsp+112]
    mov r8, [h_brush_bg]
    call FillRect

    ; Draw Header Card background
    mov r14d, [rsp+120]     ; width
    sub r14d, 20            ; margin
    
    mov dword [rsp+128], 20  ; left
    mov dword [rsp+132], 20  ; top
    mov [rsp+136], r14d      ; right
    mov dword [rsp+140], 190 ; bottom
    
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_card]
    call FillRect

    ; Check if database fetch completed
    mov al, [loading_done]
    cmp al, 1
    je .paint_data
    cmp al, 2
    je .paint_error

    ; Draw loading state
    mov rcx, rsi
    mov rdx, [h_font_title]
    call SelectObject
    
    mov rcx, rsi
    mov rdx, [color_text]
    call SetTextColor
    
    mov rcx, rsi
    mov edx, 1              ; TRANSPARENT
    call SetBkMode
    
    mov rcx, rsi
    lea rdx, [text_loading]
    mov r8d, 40
    mov r9d, 60
    call draw_text_at
    jmp .paint_end

.paint_error:
    mov rcx, rsi
    mov rdx, [h_font_title]
    call SelectObject
    
    mov rcx, rsi
    mov rdx, 0x000000FF     ; Red
    call SetTextColor
    
    mov rcx, rsi
    mov edx, 1
    call SetBkMode
    
    mov rcx, rsi
    lea rdx, [text_error]
    mov r8d, 40
    mov r9d, 60
    call draw_text_at
    jmp .paint_end

.paint_data:
    ; Draw Profile Name
    mov rcx, rsi
    mov rdx, [h_font_title]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_text]
    call SetTextColor
    mov rcx, rsi
    mov edx, 1
    call SetBkMode
    
    mov rcx, rsi
    lea rdx, [val_name]
    mov r8d, 40
    mov r9d, 35
    call draw_text_at

    ; Draw Role
    mov rcx, rsi
    mov rdx, [h_font_body]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_blue]
    call SetTextColor
    
    mov rcx, rsi
    lea rdx, [val_role]
    mov r8d, 40
    mov r9d, 85
    call draw_text_at

    ; Draw Organization
    mov rcx, rsi
    mov rdx, [color_gray]
    call SetTextColor
    
    mov rcx, rsi
    lea rdx, [val_org]
    mov r8d, 40
    mov r9d, 110
    call draw_text_at

    ; Draw Profile description
    mov rcx, rsi
    mov rdx, [h_font_mono]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_text]
    call SetTextColor
    
    mov r15d, r14d
    sub r15d, 20
    sub rsp, 16
    mov dword [rsp], r15d   ; right
    mov dword [rsp+8], 180  ; bottom
    mov rcx, rsi
    lea rdx, [val_desc]
    mov r8d, 40
    mov r9d, 140
    call draw_text_rect
    add rsp, 16

    ; --- DRAW ACHIEVEMENTS COLUMN (Left) ---
    mov r15d, [rsp+120]     ; width
    shr r15d, 1             ; width / 2
    sub r15d, 10            ; right edge
    
    mov dword [rsp+128], 20  ; left
    mov dword [rsp+132], 210 ; top
    mov [rsp+136], r15d      ; right
    mov dword [rsp+140], 560 ; bottom
    
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_card]
    call FillRect

    ; Section Title
    mov rcx, rsi
    mov rdx, [h_font_body]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_blue]
    call SetTextColor
    
    sub rsp, 16
    mov [rsp], r15d
    mov dword [rsp+8], 240
    mov rcx, rsi
    lea rdx, [title_achieve]
    mov r8d, 35
    mov r9d, 220
    call draw_text_rect
    add rsp, 16

    ; Loop achievements
    mov r12, [ach_count]
    test r12, r12
    jz .done_achievements

    xor rdi, rdi            ; index
.draw_ach_loop:
    cmp rdi, r12
    jae .done_achievements
    cmp rdi, 5
    jae .done_achievements

    ; Y offset
    mov eax, edi
    imul eax, 60
    add eax, 255            ; eax = Y coordinate

    mov rcx, rsi
    mov rdx, [h_font_mono]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_text]
    call SetTextColor

    mov rbx, rdi
    shl rbx, 8              ; index * 256
    
    sub rsp, 16
    mov [rsp], r15d
    lea r10, [eax+40]
    mov [rsp+8], r10d
    mov rcx, rsi
    lea rdx, [ach_titles + rbx]
    mov r8d, 35
    mov r9d, eax
    call draw_text_rect
    add rsp, 16

    ; Draw Year
    mov rbx, rdi
    shl rbx, 6              ; index * 64
    
    mov eax, edi
    imul eax, 60
    add eax, 292            ; Y offset for year

    mov rcx, rsi
    mov rdx, [color_gray]
    call SetTextColor
    
    sub rsp, 16
    mov [rsp], r15d
    lea r10, [eax+20]
    mov [rsp+8], r10d
    mov rcx, rsi
    lea rdx, [ach_years + rbx]
    mov r8d, 35
    mov r9d, eax
    call draw_text_rect
    add rsp, 16

    inc rdi
    jmp .draw_ach_loop

.done_achievements:

    ; --- DRAW CERTIFICATES COLUMN (Right) ---
    mov r15d, [rsp+120]     ; width
    shr r15d, 1
    add r15d, 10            ; left edge
    mov r14d, [rsp+120]
    sub r14d, 20            ; right edge
    
    mov [rsp+128], r15d      ; left
    mov dword [rsp+132], 210 ; top
    mov [rsp+140], 560       ; bottom
    mov [rsp+136], r14d      ; right
    
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_card]
    call FillRect

    ; Section Title
    mov rcx, rsi
    mov rdx, [h_font_body]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_blue]
    call SetTextColor
    
    sub rsp, 16
    mov [rsp], r14d
    mov dword [rsp+8], 240
    mov rcx, rsi
    lea rdx, [title_certs]
    lea r8d, [r15d+15]
    mov r9d, 220
    call draw_text_rect
    add rsp, 16

    ; Loop certificates
    mov r12, [cert_count]
    test r12, r12
    jz .done_certificates

    xor rdi, rdi
.draw_cert_loop:
    cmp rdi, r12
    jae .done_certificates
    cmp rdi, 5
    jae .done_certificates

    mov eax, edi
    imul eax, 60
    add eax, 255            ; Y coordinate

    mov rcx, rsi
    mov rdx, [h_font_mono]
    call SelectObject
    mov rcx, rsi
    mov rdx, [color_text]
    call SetTextColor

    mov rbx, rdi
    shl rbx, 8              ; index * 256
    
    sub rsp, 16
    mov [rsp], r14d
    lea r10, [eax+40]
    mov [rsp+8], r10d
    mov rcx, rsi
    lea rdx, [cert_titles + rbx]
    lea r8d, [r15d+15]
    mov r9d, eax
    call draw_text_rect
    add rsp, 16

    ; Draw Year
    mov rbx, rdi
    shl rbx, 6
    
    mov eax, edi
    imul eax, 60
    add eax, 292

    mov rcx, rsi
    mov rdx, [color_gray]
    call SetTextColor
    
    sub rsp, 16
    mov [rsp], r14d
    lea r10, [eax+20]
    mov [rsp+8], r10d
    mov rcx, rsi
    lea rdx, [cert_years + rbx]
    lea r8d, [r15d+15]
    mov r9d, eax
    call draw_text_rect
    add rsp, 16

    inc rdi
    jmp .draw_cert_loop

.done_certificates:

    ; --- DRAW SOCIAL LINKS COLUMN ---
    mov r14d, [rsp+120]     ; width
    sub r14d, 20
    
    mov dword [rsp+128], 20  ; left
    mov dword [rsp+132], 580 ; top
    mov [rsp+136], r14d      ; right
    mov dword [rsp+140], 640 ; bottom
    
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_card]
    call FillRect

    ; GitHub Button
    mov dword [rsp+128], 40  ; left
    mov dword [rsp+132], 590 ; top
    mov dword [rsp+136], 300 ; right
    mov dword [rsp+140], 630 ; bottom
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_bg]
    call FillRect

    mov rcx, rsi
    mov rdx, [color_blue]
    call SetTextColor
    sub rsp, 16
    mov dword [rsp], 300
    mov dword [rsp+8], 630
    mov rcx, rsi
    lea rdx, [social_github]
    mov r8d, 50
    mov r9d, 600
    call draw_text_rect
    add rsp, 16

    ; Instagram Button
    mov dword [rsp+128], 320 ; left
    mov dword [rsp+132], 590 ; top
    mov dword [rsp+136], 580 ; right
    mov dword [rsp+140], 630 ; bottom
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_bg]
    call FillRect

    sub rsp, 16
    mov dword [rsp], 580
    mov dword [rsp+8], 630
    mov rcx, rsi
    lea rdx, [social_insta]
    mov r8d, 330
    mov r9d, 600
    call draw_text_rect
    add rsp, 16

    ; LinkedIn Button
    mov dword [rsp+128], 600 ; left
    mov dword [rsp+132], 590 ; top
    mov dword [rsp+136], 860 ; right
    mov dword [rsp+140], 630 ; bottom
    mov rcx, rsi
    lea rdx, [rsp+128]
    mov r8, [h_brush_bg]
    call FillRect

    sub rsp, 16
    mov dword [rsp], 860
    mov dword [rsp+8], 630
    mov rcx, rsi
    lea rdx, [social_linkedin]
    mov r8d, 610
    mov r9d, 600
    call draw_text_rect
    add rsp, 16

.paint_end:
    ; EndPaint
    mov rcx, rbx
    lea rdx, [rsp+32]
    call EndPaint
    xor eax, eax
    jmp .done

.on_destroy:
    ; Cleanup GDI Resource Leaks
    mov rcx, [h_brush_bg]
    call DeleteObject
    mov rcx, [h_brush_card]
    call DeleteObject
    mov rcx, [h_font_title]
    call DeleteObject
    mov rcx, [h_font_body]
    call DeleteObject
    mov rcx, [h_font_mono]
    call DeleteObject
    
    xor ecx, ecx
    call PostQuitMessage
    xor eax, eax

.done:
    add rsp, 160
    pop rdi
    pop rsi
    pop rbx
    ret

; =========================================================================
; GDI Text Draw Helpers
; =========================================================================
draw_text_at:
    ; rcx = hdc, rdx = string, r8d = x, r9d = y
    push rbx
    push rdi
    sub rsp, 48
    
    mov [rsp+32], rdx       ; save string
    
    ; Fill RECT struct at rsp+40
    mov [rsp+40], r8d       ; left
    mov [rsp+44], r9d       ; top
    add r8d, 800            ; width = 800
    mov [rsp+48], r8d       ; right
    add r9d, 200            ; height = 200
    mov [rsp+52], r9d       ; bottom
    
    mov rsi, rcx
    mov rdx, [rsp+32]
    mov r8d, -1             ; null terminated
    lea r9, [rsp+40]        ; RECT
    
    ; 5th param: DT_LEFT | DT_WORDBREAK | DT_NOPREFIX
    mov qword [rsp+32], 0x0810
    
    mov rcx, rsi
    call DrawTextA
    
    add rsp, 48
    pop rdi
    pop rbx
    ret

draw_text_rect:
    ; rcx = hdc, rdx = string, r8d = left, r9d = top, [rsp+40] = right, [rsp+48] = bottom
    push rbp
    mov rbp, rsp
    sub rsp, 48
    
    mov r10d, [rbp+48]      ; right
    mov r11d, [rbp+56]      ; bottom
    
    mov [rsp+32], r8d       ; left
    mov [rsp+36], r9d       ; top
    mov [rsp+40], r10d      ; right
    mov [rsp+44], r11d      ; bottom
    
    mov rsi, rcx
    mov r8d, -1
    lea r9, [rsp+32]
    mov qword [rsp+32], 0x0810
    
    mov rcx, rsi
    call DrawTextA
    
    mov rsp, rbp
    pop rbp
    ret

; =========================================================================
; HTTPS Fetch Thread Routine (WinINet)
; =========================================================================
FetchDataThread:
    sub rsp, 40

    ; 1. InternetOpenA
    lea rcx, [agent_name]
    mov edx, 1              ; INTERNET_OPEN_TYPE_DIRECT
    xor r8d, r8d
    xor r9d, r9d
    sub rsp, 40
    mov qword [rsp+32], 0
    call InternetOpenA
    add rsp, 40
    test rax, rax
    jz .network_error
    mov r12, rax            ; r12 = hInternet

    ; 2. InternetConnectA
    mov rcx, r12
    lea rdx, [supabase_host]
    mov r8d, 443            ; HTTPS
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 3   ; INTERNET_SERVICE_HTTP
    mov qword [rsp+48], 0
    mov qword [rsp+56], 0
    call InternetConnectA
    add rsp, 48
    test rax, rax
    jz .close_internet
    mov r13, rax            ; r13 = hConnect

    ; 3. HttpOpenRequestA ("me" profile query)
    mov rcx, r13
    lea rdx, [http_verb_get]
    lea r8, [supabase_path_me]
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 0
    mov qword [rsp+48], 0x80800000 ; INTERNET_FLAG_SECURE | INTERNET_FLAG_RELOAD
    mov qword [rsp+56], 0
    call HttpOpenRequestA
    add rsp, 48
    test rax, rax
    jz .close_connect
    mov r14, rax            ; r14 = hRequestMe

    ; 4. HttpSendRequestA
    mov rcx, r14
    lea rdx, [http_headers]
    mov r8d, -1
    xor r9d, r9d
    sub rsp, 40
    mov qword [rsp+32], 0
    call HttpSendRequestA
    add rsp, 40
    test eax, eax
    jz .close_req_me

    ; 5. Read JSON response loop for "me"
    lea rdi, [buf_me_json]
    xor r15d, r15d          ; total bytes read
.read_me_loop:
    mov rcx, r14
    mov rdx, rdi
    mov r8d, 4096
    lea r9, [rsp+32]        ; pointer to bytes read
    call InternetReadFile
    test eax, eax
    jz .close_req_me
    mov eax, [rsp+32]
    test eax, eax
    jz .read_me_done
    add rdi, rax
    add r15d, eax
    cmp r15d, 16000         ; buffer boundary check
    jae .read_me_done
    jmp .read_me_loop

.read_me_done:
    mov byte [rdi], 0       ; null terminate

    ; 6. Parse Profile JSON variables
    lea rcx, [buf_me_json]
    lea rdx, [key_name]
    lea r8, [val_name]
    mov r9d, 256
    call find_json_value

    lea rcx, [buf_me_json]
    lea rdx, [key_alias]
    lea r8, [val_alias]
    mov r9d, 256
    call find_json_value

    lea rcx, [buf_me_json]
    lea rdx, [key_role]
    lea r8, [val_role]
    mov r9d, 256
    call find_json_value

    lea rcx, [buf_me_json]
    lea rdx, [key_org]
    lea r8, [val_org]
    mov r9d, 256
    call find_json_value

    lea rcx, [buf_me_json]
    lea rdx, [key_desc]
    lea r8, [val_desc]
    mov r9d, 1024
    call find_json_value

    ; Close request handle
    mov rcx, r14
    call InternetCloseHandle

    ; 7. HttpOpenRequestA ("posts" achievements/certs query)
    mov rcx, r13
    lea rdx, [http_verb_get]
    lea r8, [supabase_path_posts]
    xor r9d, r9d
    sub rsp, 48
    mov qword [rsp+32], 0
    mov qword [rsp+40], 0
    mov qword [rsp+48], 0x80800000
    mov qword [rsp+56], 0
    call HttpOpenRequestA
    add rsp, 48
    test rax, rax
    jz .close_connect
    mov r14, rax            ; r14 = hRequestPosts

    ; 8. HttpSendRequestA
    mov rcx, r14
    lea rdx, [http_headers]
    mov r8d, -1
    xor r9d, r9d
    sub rsp, 40
    mov qword [rsp+32], 0
    call HttpSendRequestA
    add rsp, 40
    test eax, eax
    jz .close_req_posts

    ; 9. Read JSON response loop for "posts"
    lea rdi, [buf_posts_json]
    xor r15d, r15d
.read_posts_loop:
    mov rcx, r14
    mov rdx, rdi
    mov r8d, 4096
    lea r9, [rsp+32]
    call InternetReadFile
    test eax, eax
    jz .close_req_posts
    mov eax, [rsp+32]
    test eax, eax
    jz .read_posts_done
    add rdi, rax
    add r15d, eax
    cmp r15d, 64000
    jae .read_posts_done
    jmp .read_posts_loop

.read_posts_done:
    mov byte [rdi], 0

    ; 10. Custom Parse Posts JSON Arrays
    call parse_posts

    ; 11. Mark load success, invalidate window to trigger WM_PAINT refresh
    mov byte [loading_done], 1
    mov rcx, [h_wnd]
    xor edx, edx
    mov r8d, 1
    call InvalidateRect
    jmp .cleanup_all

.close_req_posts:
    mov rcx, r14
    call InternetCloseHandle
    jmp .network_error

.close_req_me:
    mov rcx, r14
    call InternetCloseHandle
    jmp .network_error

.close_connect:
    mov rcx, r13
    call InternetCloseHandle
    jmp .network_error

.close_internet:
    mov rcx, r12
    call InternetCloseHandle

.network_error:
    ; Mark error state, repaint window to show error message
    mov byte [loading_done], 2
    mov rcx, [h_wnd]
    xor edx, edx
    mov r8d, 1
    call InvalidateRect
    jmp .thread_exit

.cleanup_all:
    mov rcx, r14
    call InternetCloseHandle
    mov rcx, r13
    call InternetCloseHandle
    mov rcx, r12
    call InternetCloseHandle

.thread_exit:
    add rsp, 40
    xor eax, eax
    ret

; =========================================================================
; JSON Parser Engine (x86-64 Custom State Machine)
; =========================================================================
find_json_value:
    ; rcx = json buffer, rdx = key, r8 = output buffer, r9d = max output size
    push rbx
    push rsi
    push rdi
    push r12
    push r13

    mov rsi, rcx            ; JSON string
    mov rbx, rdx            ; Key string
    mov rdi, r8             ; Out buffer
    mov r12d, r9d           ; Max size
    dec r12d                ; Leave space for null

    ; Find key length
    mov rcx, rbx
    call lstrlenA
    mov r13, rax            ; key length

.loop_search:
    mov al, [rsi]
    test al, al
    jz .not_found

    ; Check if substring matches key
    mov rcx, r13
    mov rdx, rsi
    mov rdi, rbx
    call compare_substring
    test eax, eax
    jz .key_matched

    inc rsi
    jmp .loop_search

.key_matched:
    add rsi, r13
.loop_colon:
    mov al, [rsi]
    test al, al
    jz .not_found
    cmp al, ':'
    je .found_colon
    inc rsi
    jmp .loop_colon

.found_colon:
    inc rsi
.loop_quote:
    mov al, [rsi]
    test al, al
    jz .not_found
    cmp al, '"'
    je .found_quote
    inc rsi
    jmp .loop_quote

.found_quote:
    inc rsi
    mov rdi, r8             ; Reset rdi to start of output
    xor rdx, rdx            ; Bytes written

.copy_value:
    mov al, [rsi]
    test al, al
    jz .done_copy
    cmp al, '"'
    je .done_copy
    cmp edx, r12d
    jae .skip_char

    ; Handle newline escape \n
    cmp al, '\'
    jne .not_escaped
    inc rsi
    mov al, [rsi]
    test al, al
    jz .done_copy
    cmp al, 'n'
    jne .not_escaped
    mov al, 10              ; convert to actual newline character

.not_escaped:
    mov [rdi], al
    inc rdi
    inc edx
.skip_char:
    inc rsi
    jmp .copy_value

.done_copy:
    mov byte [rdi], 0
    mov eax, 1
    jmp .exit

.not_found:
    xor eax, eax

.exit:
    pop r13
    pop r12
    pop rdi
    pop rsi
    pop rbx
    ret

compare_substring:
    ; rcx = length, rdx = string1, rdi = string2
    push rsi
    push rdi
    mov rsi, rdx
    mov rdi, rdi            ; str2 in rdi
    mov rdx, rcx            ; count in rdx
.loop:
    test rdx, rdx
    jz .match
    mov al, [rsi]
    mov bl, [rdi]
    cmp al, bl
    jne .no_match
    inc rsi
    inc rdi
    dec rdx
    jmp .loop
.match:
    xor eax, eax
    jmp .exit
.no_match:
    mov eax, 1
.exit:
    pop rdi
    pop rsi
    ret

parse_posts:
    ; Parse posts from buf_posts_json
    push rbx
    push rsi
    push rdi
    push r12
    push r13
    push r14
    push r15

    lea rsi, [buf_posts_json]
    mov qword [ach_count], 0
    mov qword [cert_count], 0

.loop:
    mov al, [rsi]
    test al, al
    jz .done

    cmp al, '{'
    jne .next_char

    ; Search within current object block (up to 300 chars or until '}') for `"type"`
    mov rdi, rsi
    xor ecx, ecx
.find_type_loop:
    cmp ecx, 300
    jae .next_char
    mov dl, [rdi+rcx]
    test dl, dl
    jz .next_char
    cmp dl, '}'
    je .next_char

    push rcx
    lea rdx, [rdi+rcx]
    lea rbx, [key_type]
    mov rcx, 6              ; length of `"type"`
    call compare_substring
    pop rcx
    test eax, eax
    jz .found_type_key

    inc ecx
    jmp .find_type_loop

.found_type_key:
    lea rdx, [rdi+rcx+6]
.find_type_val_loop:
    mov al, [rdx]
    test al, al
    jz .next_char
    cmp al, '}'
    je .next_char
    cmp al, '"'
    je .found_type_val_quote
    inc rdx
    jmp .find_type_val_loop

.found_type_val_quote:
    inc rdx
    
    ; Is achievement?
    push rdx
    lea rbx, [str_achievement]
    mov rcx, 11
    call compare_substring
    pop rdx
    test eax, eax
    jz .is_achievement

    ; Is certificate?
    push rdx
    lea rbx, [str_certificate]
    mov rcx, 11
    call compare_substring
    pop rdx
    test eax, eax
    jz .is_certificate

    jmp .next_char

.is_achievement:
    mov r12, [ach_count]
    cmp r12, 5
    jae .next_char

    ; Offset: r12 * 256
    mov r13, r12
    shl r13, 8
    lea rdi, [ach_titles + r13]
    
    mov rcx, rsi
    lea rdx, [key_title]
    mov r8, rdi
    mov r9d, 256
    call find_value_in_object

    ; Year offset: r12 * 64
    mov r13, r12
    shl r13, 6
    lea rdi, [ach_years + r13]
    
    mov rcx, rsi
    lea rdx, [key_year]
    mov r8, rdi
    mov r9d, 64
    call find_value_in_object

    inc qword [ach_count]
    jmp .next_char

.is_certificate:
    mov r12, [cert_count]
    cmp r12, 5
    jae .next_char

    ; Offset: r12 * 256
    mov r13, r12
    shl r13, 8
    lea rdi, [cert_titles + r13]
    
    mov rcx, rsi
    lea rdx, [key_title]
    mov r8, rdi
    mov r9d, 256
    call find_value_in_object

    ; Year offset: r12 * 64
    mov r13, r12
    shl r13, 6
    lea rdi, [cert_years + r13]
    
    mov rcx, rsi
    lea rdx, [key_year]
    mov r8, rdi
    mov r9d, 64
    call find_value_in_object

    inc qword [cert_count]
    jmp .next_char

.next_char:
    inc rsi
    jmp .loop

.done:
    pop r15
    pop r14
    pop r13
    pop r12
    pop rdi
    pop rsi
    pop rbx
    ret

find_value_in_object:
    ; rcx = object start, rdx = key, r8 = out_buf, r9d = max_len
    push rbx
    push rsi
    push rdi
    push r12
    push r13

    mov rsi, rcx
    mov rbx, rdx
    mov rdi, r8
    mov r12d, r9d
    dec r12d

    mov rcx, rbx
    call lstrlenA
    mov r13, rax

    xor r14d, r14d
.loop:
    cmp r14d, 1000          ; limit search depth
    jae .not_found
    mov al, [rsi+r14]
    test al, al
    jz .not_found
    cmp al, '}'
    je .not_found

    push r14
    lea rdx, [rsi+r14]
    mov rdi, rbx
    mov rcx, r13
    call compare_substring
    pop r14
    test eax, eax
    jz .key_matched

    inc r14d
    jmp .loop

.key_matched:
    lea rdx, [rsi+r14+r13]
.loop_colon:
    mov al, [rdx]
    test al, al
    jz .not_found
    cmp al, '}'
    je .not_found
    cmp al, ':'
    je .found_colon
    inc rdx
    jmp .loop_colon

.found_colon:
    inc rdx
.loop_quote:
    mov al, [rdx]
    test al, al
    jz .not_found
    cmp al, '}'
    je .not_found
    cmp al, '"'
    je .found_quote
    inc rdx
    jmp .loop_quote

.found_quote:
    inc rdx
    xor ecx, ecx
    mov rdi, r8

.copy_loop:
    mov al, [rdx]
    test al, al
    jz .done_copy
    cmp al, '"'
    je .done_copy
    cmp ecx, r12d
    jae .skip_char

    cmp al, '\'
    jne .not_escaped
    inc rdx
    mov al, [rdx]
    test al, al
    jz .done_copy
    cmp al, 'n'
    jne .not_escaped
    mov al, 10

.not_escaped:
    mov [rdi], al
    inc rdi
    inc ecx
.skip_char:
    inc rdx
    jmp .copy_loop

.done_copy:
    mov byte [rdi], 0
    mov eax, 1
    jmp .exit

.not_found:
    xor eax, eax

.exit:
    pop r13
    pop r12
    pop rdi
    pop rsi
    pop rbx
    ret
