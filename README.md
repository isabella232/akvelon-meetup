
How To

``` javascript
mkdir ~/work/iot/akvelon-meetup
cd ~/work/iot/akvelon-meetup
mkdir Temperature
cp ~/Documents/Arduino/hardware/RFDuino/arm/libraries/RFduinoBLE/examples/Temperature/Temperatute.ino Temperature
cordova create ./iot-gateway me.apla.iotgateway IoTGW
cordova platform add ios
cd iot-gateway/
cordova platform add ios
cordova plugin add com.megster.cordova.ble
cordova plugin add com.megster.cordova.rfduino
cordova plugin add ~/work/cordova/plugins/me.apla.cordova.http-client
cordova prepare ios
cd ..
npm install -g dataflo.ws
mkdir storage-dataflows
cd storage-dataflows/
dataflows init
dataflows config
vim .dataflows/apla@kobuk/fixup
dataflows config
mkdir www
dataflows daemon

```

