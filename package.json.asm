; =========================================================================
; package.json - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global package_json
    package_json db '{', 10
                 db '  "dependencies": {', 10
                 db '    "animejs": "^4.3.6",', 10
                 db '    "tailwindcss": "^4.2.2"', 10
                 db '  }', 10
                 db '}', 10, 0
