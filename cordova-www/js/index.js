// (c) 2013 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, tempFahrenheit, tempCelsius, closeButton */
/* global rfduino, alert */
'use strict';

var arrayBufferToFloat = function (ab) {
	var a = new Float32Array(ab);
	return a[0];
};

var app = {
	initialize: function() {
		this.bindEvents();
		detailPage.hidden = true;
		this.currentDevice = null;
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind (this), false);
		refreshButton.addEventListener('touchstart', this.refreshDeviceList.bind (this), false);
		closeButton.addEventListener('touchstart', this.disconnect.bind (this), false);
		deviceList.addEventListener('touchstart', this.connect.bind (this), false); // assume not scrolling
	},
	onDeviceReady: function() {
		app.refreshDeviceList();
	},
	refreshDeviceList: function() {
		deviceList.innerHTML = ''; // empties the list
		rfduino.discover(5, app.onDiscoverDevice, app.onError);
	},
	onDiscoverDevice: function(device) {
		var listItem = document.createElement('li'),
			html = '<b>' + device.name + '</b><br/>' +
			'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
			'Advertising: ' + device.advertising + '<br/>' +
			device.uuid;

		listItem.setAttribute('uuid', device.uuid);
		listItem.setAttribute('data-name', device.advertising);
		listItem.innerHTML = html;
		deviceList.appendChild(listItem);
	},
	connect: function(e) {
		var uuid = e.target.getAttribute('uuid'),
			deviceName = e.target.getAttribute('data-name'),
			onConnect = function() {
				console.log (deviceName);
				if (deviceName === 'temp') {
					rfduino.onData(app.onData, app.onError);
				}
				app.showDetailPage();
				this.currentDeviceName = deviceName;
				if (deviceName === 'ledbtn') {
					app.serverIntervalHandle = setInterval (function () {
						function ok (data) {
							var bodyData = JSON.parse (data.body);
							if (data.code === 200) {
								document.getElementById ("tempLast").innerHTML = bodyData.data[0].temp;
							}

							console.log (data.code, bodyData);

							if (parseFloat (bodyData.data[0].temp) > 30) {
								var data = new Uint8Array(1);
								data[0] = 0x1;

								rfduino.write(data.buffer); // ignoring callbacks
							} else {
								var data = new Uint8Array(1);
								data[0] = 0x0;

								rfduino.write(data.buffer); // ignoring callbacks
							}
						}

						function fail (err) {
							console.log (err);
						}

						plugins.HTTPClient.request (ok, fail, {
							uri: 'http://apla.me:50100/last.json'
						});

					}, 2000);
				}

			}.bind (this);

		rfduino.connect(uuid, onConnect, app.onError);
	},
	onData: function(data) {
		console.log(data);
		var celsius = arrayBufferToFloat(data),
			fahrenheit = celsius * 1.8 + 32;

		tempCelsius.innerHTML = celsius.toFixed(2);
		tempFahrenheit.innerHTML = fahrenheit.toFixed(2);

		function ok (data) {
			var bodyData = JSON.parse (data.body);
			if (data.code === 200) {
				document.getElementById ("tempLast").innerHTML = bodyData.data[0].temp;
			}

			console.log (data.code, bodyData);
		}

		function fail (err) {
			console.log (err);
		}

		plugins.HTTPClient.request (ok, fail, {
			uri: 'http://apla.me:50100/add.json?temp='+celsius.toFixed
		});
	},
	disconnect: function() {
		rfduino.disconnect(app.showMainPage, app.onError);

		if (app.serverIntervalHandle) {
			clearInterval (app.serverIntervalHandle);
		}
	},
	showMainPage: function() {
		mainPage.hidden = false;
		detailPage.hidden = true;
	},
	showDetailPage: function() {
		mainPage.hidden = true;
		detailPage.hidden = false;
	},
	onError: function(reason) {
		alert(reason); // real apps should use notification.alert
	}
};
