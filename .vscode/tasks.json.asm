; =========================================================================
; .vscode/tasks.json - Assembly Data Representation
; =========================================================================
bits 64
default rel

section .data
    global vscode_tasks_json
    vscode_tasks_json db '{', 10
                      db '	"version": "2.0.0",', 10
                      db '	"tasks": [', 10
                      db '		{', 10
                      db '			"label": "Install Tailwind CSS and Anime.js",', 10
                      db '			"type": "shell",', 10
                      db '			"command": "npm install tailwindcss animejs",', 10
                      db '			"args": [],', 10
                      db '			"isBackground": false,', 10
                      db '			"problemMatcher": [],', 10
                      db '			"group": "build"', 10
                      db '		}', 10
                      db '	]', 10
                      db '}', 10, 0
