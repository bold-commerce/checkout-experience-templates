#!/bin/bash
echo Pulling Last GITLAB checkout-experience-templates changes
cd ~/repo/checkout-experience-templates/
git fetch
git checkout main
git pull

echo Pulling Last GITHUB checkout-experience-templates changes
cd ~/repo/github/checkout-experience-templates/
git fetch
git checkout main
git pull

echo Rsync copy GITLAB to GITHUB folder of checkout-express-pay-library
echo Rsync Excluding list: ~/repo/checkout-experience-templates/scripts/.rsyncignore
cd ~/repo/checkout-experience-templates/scripts/
rsync -av --exclude-from=./.rsyncignore ~/repo/checkout-experience-templates/templates/ ~/repo/github/checkout-experience-templates/ --delete
