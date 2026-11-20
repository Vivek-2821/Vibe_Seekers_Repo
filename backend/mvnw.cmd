@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM ----------------------------------------------------------------------------
@IF "%DEBUG%" == "" @ECHO OFF
@setlocal EnableDelayedExpansion

@REM Execute a user defined script before this one
IF NOT "%MAVEN_SKIP_RC%" == "" GOTO skip_rc
IF EXIST "%USERPROFILE%\mavenrc_pre.bat" call "%USERPROFILE%\mavenrc_pre.bat"
:skip_rc

set ERROR_CODE=0

@REM set HOME of JVM
IF NOT "%JAVA_HOME%" == "" (
  set "JAVACMD=%JAVA_HOME%\bin\java.exe"
) ELSE (
  set "JAVACMD=java.exe"
)

IF NOT EXIST "%JAVACMD%" (
  set "JAVACMD=java"
)

set "MAVEN_PROJECTBASEDIR=%~dp0"
IF NOT "%MAVEN_PROJECTBASEDIR:~-1%" == "\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

"%JAVACMD%" %JVM_CONFIG_MAVEN_PROPS% %MAVEN_OPTS% %MAVEN_DEBUG_OPTS% -jar "%WRAPPER_JAR%" %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
