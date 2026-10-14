# Donkey Kong Country Co-op

A browser page that lets two players control Donkey Kong and Diddy at the same time in *Donkey Kong Country* (SNES, USA Rev 1).

This repository contains **no game data**: only the web page and a small IPS patch.
To host a game you need your own dump of `Donkey Kong Country (USA) (Rev 1).sfc` (SHA-1 `8ee954e15b7d77a7941b107c8243b27acebdcbc0`).
The page checks the file, applies the patch in your browser, and runs it with [snes9x-wasm](https://github.com/wasm-gaming/snes9x-wasm)
(snes9x's license allows non-commercial use only).

- **Same keyboard:** player 1 uses arrows, X (jump), Z (roll/run), Enter. Player 2 uses I/J/K/L, N (jump), B (roll/run), and presses 2 to join.
- **Online:** click "Invite a friend online" and send the link. Your game streams to them, and they control the second Kong. They don't need the game file.
