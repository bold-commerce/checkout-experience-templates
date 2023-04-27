#!/bin/bash
echo Pulling Last GITLAB checkout-experience-back-end changes
cd ~/repo/checkout-experience-back-end/
git fetch
git checkout main
git pull

echo Pulling Last GITHUB checkout-experience-templates changes
cd ~/repo/github/checkout-backend/
git fetch
git checkout main
git pull

echo Rsync copy GITLAB to GITHUB folder of checkout-experience-back-end
echo Rsync Excluding list: ~/repo/checkout-experience-templates/scripts/.rsyncignore
cd ~/repo/checkout-experience-templates/scripts/
rsync -av --exclude-from=./.rsyncignore ~/repo/checkout-experience-back-end/ ~/repo/github/checkout-backend/ --delete
