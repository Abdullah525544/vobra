<#
.SYNOPSIS
  One-shot Firebase setup for the DELISOGA storefront.
.DESCRIPTION
  - Logs in to Firebase CLI (browser-based)
  - Selects the delisoga-6d124 project
  - Creates the Firestore database (Native mode) if missing
  - Deploys Firestore rules + indexes
  - Deploys Storage rules
  - Tries to enable Email/Password auth (may require console if API blocks it)
#>

$ErrorActionPreference = 'Stop'

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    OK  $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    !!  $msg" -ForegroundColor Yellow }

# ------------------------------------------------------------
# 0. Check firebase CLI
# ------------------------------------------------------------
Step "Checking Firebase CLI"
$fb = (Get-Command firebase -ErrorAction SilentlyContinue)
if (-not $fb) {
    Warn "firebase CLI not found. Installing..."
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install firebase-tools. Install Node.js first, then re-run." -ForegroundColor Red
        exit 1
    }
}
Ok "firebase CLI ready"

# ------------------------------------------------------------
# 1. Login (if not already)
# ------------------------------------------------------------
Step "Firebase login"
firebase login --no-localhost 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Warn "Login may have failed or was cancelled. Re-run if needed."
}
Ok "logged in"

# ------------------------------------------------------------
# 2. Set active project
# ------------------------------------------------------------
Step "Selecting project delisoga-6d124"
firebase use delisoga-6d124 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Warn "Could not select project. Make sure the project ID is correct and you have access."
}
Ok "active project = delisoga-6d124"

# ------------------------------------------------------------
# 3. Create Firestore DB (if missing)
# ------------------------------------------------------------
Step "Creating Firestore database (Native mode) in eur3"
try {
    firebase firestore:databases:create --location eur3 delisoga-6d124 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Warn "Database may already exist, or creation requires console access."
    } else {
        Ok "Firestore database created (eur3)"
    }
} catch {
    Warn "Skipping database create: $_"
}

# ------------------------------------------------------------
# 4. Deploy Firestore rules + indexes
# ------------------------------------------------------------
Step "Deploying Firestore rules + indexes"
firebase deploy --only firestore:rules,firestore:indexes 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Warn "Firestore deploy failed. Check the error above."
} else {
    Ok "firestore rules + indexes deployed"
}

# ------------------------------------------------------------
# 5. Deploy Storage rules
# ------------------------------------------------------------
Step "Deploying Storage rules"
firebase deploy --only storage 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Warn "Storage deploy failed. Check the error above."
} else {
    Ok "storage rules deployed"
}

# ------------------------------------------------------------
# 6. Enable Email/Password auth via Management API
# ------------------------------------------------------------
Step "Enabling Email/Password sign-in provider"
$idToken = $null
$localCred = "$env:USERPROFILE\.config\firebase\login.json"
if (Test-Path $localCred) {
    try {
        $tokens = Get-Content $localCred -Raw | ConvertFrom-Json
        $idToken = $tokens."$tokens[0].tokens"[0].idToken
    } catch { }
}

# Try Identity Platform v2 endpoint
$project = "delisoga-6d124"
$apiKey  = "AIzaSyAzhLuwCAXjJOdPYCM2bOsWv3SQJKUpqyA"
$body = @{ providerId = "password"; enabled = $true } | ConvertTo-Json
$url  = "https://identitytoolkit.googleapis.com/v2/projects/$project/identityPlatform:updateConfig"

# Get a fresh access token via gcloud / firebase-tools
try {
    $token = firebase login:ci 2>$null | Select-String -Pattern "ya29\.[A-Za-z0-9_\-]+" | Select-Object -First 1
    if ($token) {
        $accessToken = $token.Matches[0].Value
        $headers = @{ Authorization = "Bearer $accessToken"; "Content-Type" = "application/json" }
        $resp = Invoke-RestMethod -Uri $url -Method PATCH -Headers $headers -Body $body
        Ok "Email/Password auth enabled via Management API"
    } else {
        Warn "Could not get access token. Enable Email/Password manually in the console:"
        Write-Host "        https://console.firebase.google.com/project/$project/authentication/providers" -ForegroundColor Yellow
    }
} catch {
    Warn "Could not enable auth via API. Please enable manually in the console:"
    Write-Host "        https://console.firebase.google.com/project/$project/authentication/providers" -ForegroundColor Yellow
    Write-Host "        (Sign-in method tab -> Email/Password -> Enable -> Save)" -ForegroundColor Yellow
}

# ------------------------------------------------------------
# 7. Bootstrap the admin user (creates Firebase Auth user via REST)
# ------------------------------------------------------------
Step "Creating admin user (mrabdullah1028@gmail.com)"
$email = "mrabdullah1028@gmail.com"
$password = "Abdullah1028@"
$signupUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$apiKey"
$signupBody = @{ email = $email; password = $password; returnSecureToken = $true } | ConvertTo-Json
try {
    $signupResp = Invoke-RestMethod -Uri $signupUrl -Method POST -ContentType "application/json" -Body $signupBody
    if ($signupResp.localId) {
        Ok "Firebase Auth user created: $email  (uid: $($signupResp.localId))"
        Write-Host "        Now visit http://localhost:5173/admin and sign in to bootstrap /admins/$($signupResp.localId)" -ForegroundColor Cyan
    }
} catch {
    $msg = $_.Exception.Message
    if ($msg -match 'EMAIL_EXISTS') {
        Ok 'User already exists in Firebase Auth - you can sign in directly'
    } else {
        Warn "Could not create user via REST: $msg"
    }
}

Write-Host "`n=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Next: open http://localhost:5173/admin and sign in with" -ForegroundColor Cyan
Write-Host "       $email / $password" -ForegroundColor Cyan
