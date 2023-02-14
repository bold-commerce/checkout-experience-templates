#!/bin/bash
echo Pulling Last GITLAB checkout-frontend-library changes
cd ~/repo/checkout-frontend-library/
git fetch
git checkout develop
git pull

echo Pulling Last GITHUB checkout-frontend-library changes
cd ~/repo/github/checkout-frontend-library/
git fetch
git checkout main
git pull

echo Rsync copy GITLAB to GITHUB folder of checkout-frontend-library
echo Rsync Excluding list: ~/repo/checkout-experience-templates/scripts/.rsyncignore
cd ~/repo/github/
rsync -av --exclude-from=./.rsyncignore ~/repo/checkout-frontend-library/ ~/repo/github/checkout-frontend-library/
