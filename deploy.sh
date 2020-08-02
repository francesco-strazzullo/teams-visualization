git branch -D deploy &>/dev/null
git checkout -b deploy
mv .gitignore_deploy .gitignore
cp src/lib/config.json src/lib/_config.json
cp server/src/credentials.json server/src/_credentials.json
git add server/public
git add src/lib/config.json
git add server/src/credentials.json
git commit -am "deploy"
git push heroku deploy:master --force
git checkout master
mv src/lib/_config.json src/lib/config.json
mv server/src/_credentials.json server/src/credentials.json
