@echo off

REM Paso 1: Transpilar TypeScript en la carpeta www/ para produccion - https://patorjk.com/software/taag/#p=display&f=Star%20Wars&t=ECO-CUENTA
set "RUTA_ACTUAL=%cd%"
set "RUTA_CARPETA=Proyectos\eco-cuenta"

ECHO  _______   ______   ______            ______  __    __   _______ .__   __. .___________.    ___      
ECHO ^|   ____^| /      ^| /  __  \          /      ^|^|  ^|  ^|  ^| ^|   ____^|^|  \ ^|  ^| ^|           ^|   /   \     
ECHO ^|  ^|__   ^|  ,----'^|  ^|  ^|  ^|  ______^|  ,----'^|  ^|  ^|  ^| ^|  ^|__   ^|   \^|  ^| `---^|  ^|----`  /  ^  \    
ECHO ^|   __^|  ^|  ^|     ^|  ^|  ^|  ^| ^|______^|  ^|     ^|  ^|  ^|  ^| ^|   __^|  ^|  . `  ^|     ^|  ^|      /  /_\  \   
ECHO ^|  ^|____ ^|  `----.^|  `--'  ^|        ^|  `----.^|  `--'  ^| ^|  ^|____ ^|  ^|\   ^|     ^|  ^|     /  _____  \  
ECHO ^|_______^| \______^| \______/          \______^| \______/  ^|_______^|^|__^| \__^|     ^|__^|    /__/     \__\

echo Transpilando TypeScript en la carpeta www/ para produccion...
call tsc --project ecocuenta-api\www\tsconfig.json

if errorlevel 1 (
  echo Error: Ocurrio un error al transpilar TypeScript.
  exit /b 1
)

REM Paso 2: Recorrer los archivos .js en la carpeta dist/ y ofuscarlos con javascript-obfuscator.cmd

echo Ofuscando archivos JavaScript en la carpeta dist/...
for /r "ecocuenta-api\dist" %%f in (*.js) do (
  call javascript-obfuscator.cmd "%%f" --output "%RUTA_ACTUAL%\ecocuenta-api\dist-min\%%~pnxf" --compact true --self-defending false
)
call xcopy %RUTA_ACTUAL%\ecocuenta-api\dist-min\%RUTA_CARPETA%\ecocuenta-api\dist %RUTA_ACTUAL%\dist\ /s/e/h/i
call rmdir %RUTA_ACTUAL%\ecocuenta-api\dist-min\ /s/q

if errorlevel 1 (
  echo Error: Ocurrio un error al ofuscar los archivos JavaScript.
  exit /b 1
)

REM Paso 3: Copiar el archivo package.json en la carpeta dist/ y dist-min/

echo Copiando package.json en las carpetas dist/ y dist-min/...
copy /Y "ecocuenta-api\www\package.json" "ecocuenta-api\dist\"
copy /Y "ecocuenta-api\www\package.json" "dist\"

if errorlevel 1 (
  echo Error: Ocurrio un error al copiar el archivo package.json.
  exit /b 1
)

REM Paso 5: Compilar proyecto Angular
cd /d %RUTA_ACTUAL%\ecocuenta-web
call npm run-script build

if errorlevel 1 (
  echo Error: Ocurrio un error al compilar proyecto Angular
  exit /b 1
)

call xcopy %RUTA_ACTUAL%\ecocuenta-web\dist\public\browser %RUTA_ACTUAL%\dist\public /s/e/h/i

if errorlevel 1 (
  echo Error: Ocurrio un error al copiar la carpeta public/
  exit /b 1
)
call xcopy %RUTA_ACTUAL%\ecocuenta-api\www\assets %RUTA_ACTUAL%\dist\assets /s/e/h/i

if errorlevel 1 (
  echo Error: Ocurrio un error al copiar la carpeta assets/
  exit /b 1
)

REM Paso 6: Comprimir carpeta
SET "carpeta_a_comprimir=%RUTA_ACTUAL%\dist"
SET "archivo_zip=%RUTA_ACTUAL%\dist.zip"

call powershell -noprofile -command "& {Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::CreateFromDirectory('%carpeta_a_comprimir%', '%archivo_zip%');}"

echo Listo! El proceso ha finalizado exitosamente.
exit /b 0
