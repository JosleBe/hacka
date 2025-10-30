@echo off
REM Script de Setup Automático para Capital Raíz (Windows)
REM Este script configura todo el proyecto desde cero

echo.
echo ========================================
echo    Capital Raiz - Setup Automatico
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo Descarga desde https://nodejs.org
    exit /b 1
)

echo [INFO] Node.js instalado: OK
echo.

REM 1. Setup de Backend
echo [INFO] Configurando Backend...
cd backend

echo [INFO] Instalando dependencias de backend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al instalar dependencias de backend
    exit /b 1
)

REM Crear .env si no existe
if not exist .env (
    echo [INFO] Creando archivo .env...
    copy .env.example .env
    echo [WARN] Edita backend\.env con tus credenciales antes de continuar
) else (
    echo [INFO] .env ya existe
)

echo [INFO] Generando Prisma client...
call npx prisma generate

cd ..
echo.

REM 2. Setup de Frontend
echo [INFO] Configurando Frontend...
cd frontend

echo [INFO] Instalando dependencias de frontend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al instalar dependencias de frontend
    exit /b 1
)

REM Crear .env.local si no existe
if not exist .env.local (
    echo [INFO] Creando archivo .env.local...
    copy .env.local.example .env.local
    echo [WARN] Edita frontend\.env.local con tu CONTRACT_ID despues del deploy
) else (
    echo [INFO] .env.local ya existe
)

cd ..
echo.

REM Resumen
echo ========================================
echo Setup completado!
echo ========================================
echo.
echo Proximos pasos:
echo.
echo 1. Configurar Base de Datos:
echo    cd backend
echo    npx prisma migrate dev
echo.
echo 2. Actualizar variables de entorno:
echo    - backend\.env
echo    - frontend\.env.local
echo.
echo 3. Iniciar servicios:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Visita http://localhost:3000
echo.
pause
