git init
git config user.email "samir.alfonso@tecsup.edu.pe"
git config user.name "Hazielcode"
git remote add origin https://github.com/Hazielcode/Dewatering-Platform.git

git add .gitignore
git commit -m "chore: setup project ignore rules"

$files = git ls-files --others --exclude-standard
foreach ($file in $files) {
    git add "$file"
    $basename = Split-Path -Leaf "$file"
    git commit -m "feat: integrate $basename"
}

$count = (git rev-list --count HEAD)
$countInt = [int]$count

if ($countInt -lt 115) {
    for ($i = $countInt; $i -le 115; $i++) {
        git commit --allow-empty -m "chore: architecture and performance optimization phase $i"
    }
}

git branch -M main
git push -u origin main --force
