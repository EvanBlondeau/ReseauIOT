var hid = require('node-hid');
var ds4 = require('ds4');

var parseDS4HIDData = ds4.parseDS4HIDData;

var devices = hid.devices();
var controller = devices.filter(isDS4HID)[0]

if (!controller) {
    throw new Error('Could not find desired controller.');
}

var hidDevice = new hid.HID(controller.path);
var offset = 0;

if (isBluetoothHID(controller)) {
    offset = 2;
    hidDevice.getFeatureReport(0x04, 66);
}

hidDevice.on('data', function(buf) {
    console.log(parseDS4HIDData(buf.slice(offset)));
});

// HIDDesciptor -> Boolean
function isDS4HID(descriptor) {
  return descriptor.vendorId == 1356 && descriptor.productId == 1476;
}

// HIDDesciptor -> Boolean
function isBluetoothHID(descriptor) {
  return descriptor.path.match(/^Bluetooth/);
}

// HIDDesciptor -> Boolean
function isUSBHID(descriptor) {
  return descriptor.path.match(/^USB/);
}