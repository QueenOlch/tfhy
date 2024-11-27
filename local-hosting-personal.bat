@ECHO OFF
cd /Users/me/Documents/Github/tfhy
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npx vitepress dev docs
PAUSE