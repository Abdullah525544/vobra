<#
.SYNOPSIS
  Seeds the DELISOGA Firestore with the admin doc + site settings.
  Uses POST (not PATCH) so the create rules apply, not the update rules.
#>
$ErrorActionPreference = 'Stop'

$apiKey   = 'AIzaSyAzhLuwCAXjJOdPYCM2bOsWv3SQJKUpqyA'
$email    = 'mrabdullah1028@gmail.com'
$password = 'Abdullah1028@'
$project  = 'delisoga-6d124'

function Step($m) { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    OK  $m" -ForegroundColor Green }
function Warn($m) { Write-Host "    !!  $m" -ForegroundColor Yellow }

# -----------------------------------------------------------------
# 1. Sign in to get a fresh idToken
# -----------------------------------------------------------------
Step "Sign in to Firebase Auth"
$signin = Invoke-RestMethod -Uri "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$apiKey" `
    -Method POST -ContentType 'application/json' `
    -Body (@{ email = $email; password = $password; returnSecureToken = $true } | ConvertTo-Json)
$idToken = $signin.idToken
$uid     = $signin.localId
Ok "signed in (uid=$uid)"

$authHeader = @{ Authorization = "Bearer $idToken"; 'Content-Type' = 'application/json' }
$baseFirestore = "https://firestore.googleapis.com/v1/projects/$project/databases/(default)/documents"

# -----------------------------------------------------------------
# 2. Seed /admins/{uid} (POST so create rules apply)
# -----------------------------------------------------------------
Step "Creating /admins/$uid"
$adminBody = @{
    fields = @{
        email     = @{ stringValue = $email }
        role      = @{ stringValue = 'admin' }
        createdAt = @{ timestampValue = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ') }
    }
} | ConvertTo-Json -Depth 5

# POST with documentId: creates the doc (or fails if it already exists)
$adminUrl = "$baseFirestore/admins" + "?documentId=$uid"
try {
    $null = Invoke-RestMethod -Uri $adminUrl -Method POST -Headers $authHeader -Body $adminBody
    Ok '/admins/{uid} created'
} catch {
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $respBody = $reader.ReadToEnd()
    if ($respBody -match 'ALREADY_EXISTS' -or $respBody -match 'already exists') {
        Ok '/admins/{uid} already exists'
    } else {
        Warn "admin create failed: $respBody"
    }
}

# -----------------------------------------------------------------
# 3. Seed /settings/site (PATCH with updateMask — only the fields we set)
# -----------------------------------------------------------------
Step "Seeding /settings/site (WhatsApp = +923279500025)"
$siteBody = @{
    fields = @{
        brand = @{ mapValue = @{ fields = @{
            name        = @{ stringValue = 'DELISOGA' }
            tagline     = @{ stringValue = 'Premium Glassware for Everyday Rituals' }
            description = @{ stringValue = 'A premium glass jar with a natural bamboo lid and a reusable glass straw.' }
        } } }
        product = @{ mapValue = @{ fields = @{
            name               = @{ stringValue = 'Glass Jar with Bamboo Lid & Glass Straw' }
            sku                = @{ stringValue = 'DS-GLASS-JAR-01' }
            unitPrice          = @{ doubleValue  = 1000 }
            deliveryCharge     = @{ doubleValue  = 250 }
            freeDeliveryMinQty = @{ integerValue = '2' }
            inStock            = @{ booleanValue = $true }
            stockNote          = @{ stringValue = 'In stock - ready to ship' }
        } } }
        offer = @{ mapValue = @{ fields = @{
            headline = @{ stringValue = 'Free delivery on 2 or more jars' }
            subtext  = @{ stringValue = 'Order 1 jar at PKR 1,000. Order 2+ jars and delivery is on us.' }
        } } }
        contact = @{ mapValue = @{ fields = @{
            whatsapp      = @{ stringValue = '+923279500025' }
            phone         = @{ stringValue = '+923279500025' }
            email         = @{ stringValue = 'info.abdullah1027@gmail.com' }
            address       = @{ stringValue = 'Faisalabad, Pakistan' }
            businessHours = @{ stringValue = 'Mon-Sat, 10:00-19:00 PKT' }
        } } }
        social = @{ mapValue = @{ fields = @{
            instagram = @{ stringValue = '' }
            facebook  = @{ stringValue = '' }
            tiktok    = @{ stringValue = '' }
        } } }
        announcement = @{ mapValue = @{ fields = @{
            enabled = @{ booleanValue = $true }
            text    = @{ stringValue = 'Free delivery across Pakistan on orders of 2 or more jars' }
        } } }
        policy = @{ mapValue = @{ fields = @{
            paymentMethods = @{ arrayValue = @{ values = @( @{ stringValue = 'Cash on Delivery' } ) } }
            shippingNote   = @{ stringValue = 'We currently ship within Pakistan.' }
        } } }
    }
} | ConvertTo-Json -Depth 12

# PATCH to /settings/site — the read rule is public, write requires isAdmin().
# isAdmin() reads /admins/{uid} which we just created above.
$siteUrl = "$baseFirestore/settings/site"
$mask = '?updateMask.fieldPaths=brand&updateMask.fieldPaths=product&updateMask.fieldPaths=offer&updateMask.fieldPaths=contact&updateMask.fieldPaths=social&updateMask.fieldPaths=announcement&updateMask.fieldPaths=policy'
try {
    $null = Invoke-RestMethod -Uri ($siteUrl + $mask) -Method PATCH -Headers $authHeader -Body $siteBody
    Ok '/settings/site created (WhatsApp = +923279500025)'
} catch {
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Warn "settings create failed: $($reader.ReadToEnd())"
}

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "Open http://localhost:5173/admin and sign in with" -ForegroundColor Cyan
Write-Host "  $email / $password" -ForegroundColor Cyan
