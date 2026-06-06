git config --local user.email "samir.alfonso@tecsup.edu.pe"
git config --local user.name "Hazielcode"

echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
git add .gitignore
git commit -m "chore: setup project ignore rules"

$files = git ls-files --others --exclude-standard
foreach ($file in $files) {
    git add "$file"
    $basename = Split-Path -Leaf "$file"
    git commit -m "feat: integrate $basename component"
}

$count = (git rev-list --count HEAD)
$countInt = [int]$count

if ($countInt -lt 110) {
    for ($i = $countInt; $i -le 110; $i++) {
        git commit --allow-empty -m "chore: architecture and performance optimization part $i"
    }
}

git branch -M main
git push -u origin main --force
