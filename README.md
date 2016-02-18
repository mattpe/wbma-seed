# WBMA seed

Project starting point template for Web Based Mobile Applications course.

**Replace this with your own app's readme file.**

## Getting Started 

1. Install Git, Node.js (npm), Cordova, grunt-cli & bower globally on your computer.
2. Clone this repo.
3. Modify `package.json` & `bower.json` files to match your app (name, version, description).
4. Run `npm install && bower install` 
5. Develop in _src/_ folder
6. Check and update _Gruntfile.js_ if needed
7. Build using `grunt` command
8. Deploy your _build/_ folder

## Cordova stuff (Android)

```sh 
cordova create cordova fi.metropolia.[myname].[appname] 'My Application'
cd cordova/
cordova platform add android
#copy contents of build/ to cordova/www/
cp -R ../build/* www/

cordova plugin add [pluginName]

cordova build
cordova run android

```

To debug android device on a browser, go to [chrome://inspect](chrome://inspect/#devices). Full instructions: https://developers.google.com/web/tools/chrome-devtools/debug/remote-debugging/remote-debugging
