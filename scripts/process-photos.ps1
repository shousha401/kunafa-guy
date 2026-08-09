<#
    Crops and compresses source photos into every image slot the site expects.

    Why this exists: source photos arrive at arbitrary sizes and are usually far
    too heavy. Each slot has a fixed aspect ratio and a weight budget (see the
    asset manifest in kunafah-guy-build-spec.md). This script crops to the right
    shape and then steps JPEG quality down until the file fits its budget.

    Usage
      # Re-create every slot from the photos currently mapped at the bottom
      .\scripts\process-photos.ps1

      # Drop a new photo into one slot, centre-cropped to that slot's aspect
      .\scripts\process-photos.ps1 -Source 'C:\path\shawarma.jpg' -Slot 'menu-shawarma'

    Sizing rule worth keeping: do NOT upscale a small source to the slot's ideal
    pixel size and then crush quality to fit the budget. Fine food texture
    (kataifi strands especially) is JPEG-hostile, and the result looks worse than
    a smaller, higher-quality image. Stay near the source resolution instead.
#>

param(
    [string]$Source,
    [string]$Slot
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$imgDir = Join-Path $root 'public\images'

# name -> output pixels + weight budget. Aspect is implied by width/height.
$Slots = @{
    'hero-kunafa-pull'      = @{ W = 900;  H = 1200; KB = 245 }  # 3:4, full-bleed hero
    'menu-kunafa-classic'   = @{ W = 1050; H = 525;  KB = 120 }  # 2:1, featured menu card
    'menu-kunafah-tray'     = @{ W = 700;  H = 525;  KB = 115 }  # 4:3
    'menu-burger-smash'     = @{ W = 700;  H = 525;  KB = 115 }  # 4:3
    'menu-burger-double'    = @{ W = 700;  H = 525;  KB = 115 }  # 4:3
    'menu-chicken-sandwich' = @{ W = 700;  H = 525;  KB = 115 }  # 4:3 - no photo yet
    'menu-wings'            = @{ W = 700;  H = 525;  KB = 115 }  # 4:3 - no photo yet
    'menu-fries'            = @{ W = 700;  H = 525;  KB = 115 }  # 4:3 - no photo yet
    'process-shred'         = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'process-sear'          = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'process-pull'          = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'process-drench'        = @{ W = 620;  H = 620;  KB = 105 }  # 1:1
    'find-us-truck'         = @{ W = 1000; H = 750;  KB = 150 }  # 4:3, "look for this truck"
    'deal-banners'          = @{ W = 1000; H = 750;  KB = 150 }  # 4:3, his own deal signage
}

function Save-Jpeg($bmp, $path, $q) {
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$q)
    $bmp.Save($path, $enc, $ep)
}

# Largest rectangle of the given aspect that fits the source, centred.
function Get-CenterCrop($srcW, $srcH, $targetW, $targetH) {
    $targetAspect = $targetW / $targetH
    if (($srcW / $srcH) -gt $targetAspect) {
        $h = $srcH; $w = [int]($srcH * $targetAspect)
    }
    else {
        $w = $srcW; $h = [int]($srcW / $targetAspect)
    }
    return @{ X = [int](($srcW - $w) / 2); Y = [int](($srcH - $h) / 2); W = $w; H = $h }
}

<#  Crop $sx,$sy,$sw,$sh out of $srcPath, scale into the slot, shrink quality
    until it fits budget. Pass -1 for $sx to centre-crop automatically. #>
function Write-Slot($slotName, $srcPath, $sx = -1, $sy = 0, $sw = 0, $sh = 0) {
    if (-not $Slots.ContainsKey($slotName)) { throw "Unknown slot '$slotName'. Known: $($Slots.Keys -join ', ')" }
    if (-not (Test-Path $srcPath)) { throw "Source photo not found: $srcPath" }

    $spec = $Slots[$slotName]
    $dstPath = Join-Path $imgDir "$slotName.jpg"
    $src = [System.Drawing.Image]::FromFile($srcPath)

    if ($sx -lt 0) {
        $c = Get-CenterCrop $src.Width $src.Height $spec.W $spec.H
        $sx = $c.X; $sy = $c.Y; $sw = $c.W; $sh = $c.H
    }

    $dst = New-Object System.Drawing.Bitmap($spec.W, $spec.H)
    $g = [System.Drawing.Graphics]::FromImage($dst)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $g.SmoothingMode = 'HighQuality'
    $g.CompositingQuality = 'HighQuality'
    $g.DrawImage($src,
        (New-Object System.Drawing.Rectangle(0, 0, $spec.W, $spec.H)),
        (New-Object System.Drawing.Rectangle($sx, $sy, $sw, $sh)),
        [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose(); $src.Dispose()

    $q = 86
    do {
        Save-Jpeg $dst $dstPath $q
        $kb = [math]::Round((Get-Item $dstPath).Length / 1KB)
        $q -= 6
    } while ($kb -gt $spec.KB -and $q -ge 40)

    $dst.Dispose()
    "{0,-24} {1,4}x{2,-4} q{3,-3} {4,4} KB" -f $slotName, $spec.W, $spec.H, ($q + 6), $kb
}

# ---------------------------------------------------------------------------
if ($Source -and $Slot) {
    Write-Slot $Slot $Source          # centre-crop a new photo into one slot
    return
}
if ($Source -xor $Slot) { throw 'Pass -Source and -Slot together, or neither.' }

# ---------------------------------------------------------------------------
# Source photos. The four in photos-source/ are the OWNER'S OWN photos, sent
# July 25 2026 - they replaced the earlier stock-looking kunafa shot and its
# licensing question. Kept in-repo so this pipeline is reproducible.
$SRC    = Join-Path $root 'photos-source'
$TRAY   = Join-Path $SRC 'kunafah-tray-pull.jpg'  # 739 x 1600 - tray + cheese pull
$MACRO  = Join-Path $SRC 'kunafah-macro.jpg'      # 739 x 1600 - close macro ("Crop" UI at top, avoid y<120)
$PLATED = Join-Path $SRC 'kunafah-plated.jpg'     # 736 x 1103 - plated tray, used for the hero by owner's choice
$TRUCK  = Join-Path $SRC 'truck.jpg'              # 1200 x 1600 - the truck + menu board
$BANNER = Join-Path $SRC 'deal-banners.jpg'       # 1200 x 1600 - his 2-for-$10 / 2-for-$15 pull-ups
$BURGER = 'C:\Users\shous\Downloads\double smash.jpeg'  # 236 x 314 thumbnail - STILL NEEDS a real photo

if (-not (Test-Path $TRAY)) { Write-Warning "Source photo missing: $TRAY"; return }

# Hero: the plated tray shot. Chosen over the cheese-pull crop by the site owner.
Write-Slot 'hero-kunafa-pull'    $PLATED  0  115 736 981

# Menu cards. The TRAY photo is noticeably sharper than the MACRO one (which
# is a soft, oversaturated video grab), so it carries most of the slots.
Write-Slot 'menu-kunafa-classic' $TRAY    0  650 739 370   # 2:1 tray rim + crust, past the blurriest drip
Write-Slot 'menu-kunafah-tray'   $TRAY    0  830 739 554   # full tray, for the S/M/L trays

# Process steps - PINNED, do not regenerate from $TRAY. The owner asked to go
# back to the pre-truck-photo set for this section (2026-08-01), restored from
# git history (commit bb37d65) rather than cropped from a current source file.
# That set has no source in photos-source/ and carries the open licensing
# question noted in CLAUDE.md - re-running these four lines would silently
# overwrite the restored files with the truck-photo crops again.
# Write-Slot 'process-shred'       $TRAY   60 1080 620 620   # kataifi surface + pistachio
# Write-Slot 'process-sear'        $TRAY   60  900 620 620   # golden toasted crust
# Write-Slot 'process-pull'        $TRAY   60  280 620 620   # the cheese pull itself
# Write-Slot 'process-drench'      $TRAY   60  640 620 620   # syrup sheen + pistachio blanket

# Location + deal signage
Write-Slot 'find-us-truck'       $TRUCK    0  330 1200 900
Write-Slot 'deal-banners'        $BANNER  20  170 1100 825

if (Test-Path $BURGER) {
    Write-Slot 'menu-burger-double' $BURGER  0  67 236 177
    Write-Slot 'menu-burger-smash'  $BURGER 12  80 212 159
}
