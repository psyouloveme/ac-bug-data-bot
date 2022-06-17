test -f ./src/database/bugData.db && rm ./src/database/bugData.db; 
cd ./src/database; 
node ./createBugDataDb.js && cd ../../;
rm -rf ./extension ./graphics;
npx parcel build \
    --target extension \
    --target acversion;
cp ./src/database/bugData.db ../../;