#!/bin/bash
echo Pulling Last GITLAB checkout-express-pay-library changes
cd ~/repo/checkout-express-pay-library/
git fetch
git checkout develop
git pull

echo Pulling Last GITHUB checkout-express-pay-library changes
cd ~/repo/github/checkout-express-pay-library/
git fetch
git checkout main
git pull

echo Rsync copy GITLAB to GITHUB folder of checkout-express-pay-library
echo Rsync Excluding list: ~/repo/checkout-experience-templates/scripts/.rsyncignore
cd ~/repo/checkout-experience-templates/scripts/
rsync -av --exclude-from=./.rsyncignore ~/repo/checkout-express-pay-library/ ~/repo/github/checkout-express-pay-library/
