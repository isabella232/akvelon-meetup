cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.megster.cordova.ble/www/ble.js",
        "id": "com.megster.cordova.ble.ble",
        "clobbers": [
            "ble"
        ]
    },
    {
        "file": "plugins/com.megster.cordova.rfduino/www/rfduino.js",
        "id": "com.megster.cordova.rfduino.rfduino",
        "clobbers": [
            "rfduino"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.megster.cordova.ble": "0.1.6",
    "com.megster.cordova.rfduino": "0.1.3"
}
// BOTTOM OF METADATA
});