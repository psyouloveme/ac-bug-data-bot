test -f ./src/extension/bugData.db && rm ./src/extension/bugData.db; 
cd ./src/extension; 
node ./createBugDataDb.js && cd ../../;
rm -rf ./extension ./graphics;
npx parcel build \
    --target extension \
    --target acversion;
cp ./src/extension/bugData.db ../../;