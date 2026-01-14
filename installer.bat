@echo off
setlocal enabledelayedexpansion

REM Check for the correct number of arguments
if "%~1"=="" goto usage
if "%~2"=="" goto usage

set "FILENAME=%~1"
set "TARGET_DIR=%~2"
set "HTNODES_BAT=%USERPROFILE%\htnodes.bat"

REM Determine the next available port
set "PORT=3000"
if exist "%HTNODES_BAT%" (
    for /f "tokens=2" %%i in ('findstr /r "^REM [0-9][0-9]*" "%HTNODES_BAT%"') do (
        set "LAST_PORT=%%i"
    )
    if defined LAST_PORT (
        set /a "PORT=LAST_PORT + 1"
    ) else (
        for /f "tokens=2 delims=: " %%i in ('findstr /r "echo \".*:[0-9]*\"" "%HTNODES_BAT%"') do (
            set "LAST_PORT=%%i"
        )
        if defined LAST_PORT (
            set /a "PORT=PORT + 1"
        )
    )
)


REM Create or update the htnodes.bat script
if not exist "%HTNODES_BAT%" (
    echo @echo off > "%HTNODES_BAT%"
    echo. >> "%HTNODES_BAT%"
    echo REM 3000 >> "%HTNODES_BAT%"
    echo. >> "%HTNODES_BAT%"
    echo cd /d "%TARGET_DIR%" ^& start "Node Server for %FILENAME%" /b node "svr_%FILENAME%.js" >> "%HTNODES_BAT%"
    echo. >> "%HTNODES_BAT%"
    echo timeout /t 3 /nobreak ^>nul >> "%HTNODES_BAT%"
    echo. >> "%HTNODES_BAT%"
    echo echo. >> "%HTNODES_BAT%"
    echo echo. >> "%HTNODES_BAT%"
    echo echo. >> "%HTNODES_BAT%"
    echo echo %FILENAME%: %PORT% >> "%HTNODES_BAT%"
    echo echo. >> "%HTNODES_BAT%"
    echo echo. >> "%HTNODES_BAT%"
    echo echo. >> "%HTNODES_BAT%"
) else (
    REM Add the new port comment
    powershell -Command "(Get-Content -path '%HTNODES_BAT%') + 'REM %PORT%' | Out-File -filepath '%HTNODES_BAT%' -encoding ASCII"
    
    REM Add the new node service command before timeout
    powershell -Command "$content = Get-Content -path '%HTNODES_BAT%'; $timeoutIndex = $content | Select-String -Pattern 'timeout' | Select -First 1 | ForEach-Object { $_.LineNumber - 1 }; $newContent = $content[0..($timeoutIndex-1)] + 'cd /d \"%TARGET_DIR%\" ^& start \"Node Server for %FILENAME%\" /b node \"svr_%FILENAME%.js\"' + $content[$timeoutIndex..($content.Length-1)]; $newContent | Out-File -filepath '%HTNODES_BAT%' -encoding ASCII"

    REM Add the new echo statement
    powershell -Command "$content = Get-Content -path '%HTNODES_BAT%'; $lastEchoIndex = $content | Select-String -Pattern 'echo \".*:[0-9]*\"' | Select -Last 1 | ForEach-Object { $_.LineNumber - 1 }; $newContent = $content[0..$lastEchoIndex] + 'echo %FILENAME%: %PORT%' + $content[($lastEchoIndex+1)..($content.Length-1)]; $newContent | Out-File -filepath '%HTNODES_BAT%' -encoding ASCII"
)

REM Copy httree.html to the target directory
copy "httree.html" "%TARGET_DIR%\%FILENAME%.html" >nul

REM Update the node port in the new html file
powershell -Command "(Get-Content -path '%TARGET_DIR%\%FILENAME%.html') -replace 'let nodePort = 0;', 'let nodePort = %PORT%;' | Set-Content -path '%TARGET_DIR%\%FILENAME%.html'"

REM Copy saver.js to the target directory
copy "saver.js" "%TARGET_DIR%\svr_%FILENAME%.js" >nul

REM Update the file name and port in the new saver.js file
powershell -Command "(Get-Content -path '%TARGET_DIR%\svr_%FILENAME%.js') -replace 'const FILE_PATH = \"./httree.html\";', 'const FILE_PATH = \"./%FILENAME%.html\";' | Set-Content -path '%TARGET_DIR%\svr_%FILENAME%.js'"
powershell -Command "(Get-Content -path '%TARGET_DIR%\svr_%FILENAME%.js') -replace 'const PORT = 3000;', 'const PORT = %PORT%;' | Set-Content -path '%TARGET_DIR%\svr_%FILENAME%.js'"


echo New httree instance '%FILENAME%' created in '%TARGET_DIR%' on port %PORT%.
echo To start the node services, run: %HTNODES_BAT%
goto:eof

:usage
echo Usage: %0 ^<filename_minus_extension^> ^<target_directory^>
exit /b 1
