var BluetoothHciSocket = require('bluetooth-hci-socket');
var player = require('play-sound')(opts = {});

var bluetoothHciSocket = new BluetoothHciSocket();


var audio;
var i = 0;
bluetoothHciSocket.on('data', function(data) {
   console.log('data: ' + data.toString('hex') + ', ' + data.length + ' bytes');

  buf=data.toString('hex');

  dPad = buf[5] & 15;
  leftAnalogX= buf[1];
  leftAnalogY= buf[2];
  rightAnalogX= buf[3];
  rightAnalogY= buf[4];
  l2Analog= buf[8];
  r2Analog= buf[9];

  dPadUp=    dPad === 0 || dPad === 1 || dPad === 7;
  dPadRight= dPad === 1 || dPad === 2 || dPad === 3;
  dPadDown=  dPad === 3 || dPad === 4 || dPad === 5;
  dPadLeft=  dPad === 5 || dPad === 6 || dPad === 7;

  cross= (buf[5] & 32) !== 0;
  circle= (buf[5] & 64) !== 0;
  square= (buf[5] & 16) !== 0;
  triangle= (buf[5] & 128) !== 0;
  l1= (buf[6] & 0x01) !== 0;
  l2= (buf[6] & 0x04) !== 0;
  r1= (buf[6] & 0x02) !== 0;
  r2= (buf[6] & 0x08) !== 0;
  l3= (buf[6] & 0x40) !== 0;
  r3= (buf[6] & 0x80) !== 0;

  share= (buf[6] & 0x10) !== 0;
  options= (buf[6] & 0x20) !== 0;
  trackPadButton= (buf[7] & 2) !== 0;
  psButton= (buf[7] & 1) !== 0;

  // ACCEL/GYRO


  // TRACKPAD
  var trackPadTouch0Id= buf[35] & 0x7f; //croix num
  trackPadTouch0Active= (buf[35] >> 7) === 0;
  trackPadTouch0X= ((buf[37] & 0x0f) << 8) | buf[36]; //r1 r2 l1 l2
  trackPadTouch0Y= buf[38] << 4 | ((buf[37] & 0xf0) >> 4);

  trackPadTouch1Id= buf[39] & 0x7f;
  trackPadTouch1Active= (buf[39] >> 7) === 0;
  trackPadTouch1X= ((buf[41] & 0x0f) << 8) | buf[40];
  trackPadTouch1Y= buf[42] << 4 | ((buf[41] & 0xf0) >> 4);

  timestamp= buf[7] >> 2;
  battery= buf[12];
  //batteryShort1: buf[12] & 0x0f,
  //batteryShort2: buf[12] & 0xf0,
  //batteryLevel= buf[12]});
  
  if((trackPadTouch0Id === 2 )&&(i==0)){
    i++;
     audio = player.play('Papa.mp3', function(err){
      if (err && !err.killed) throw err
    });

    
  }else if(trackPadTouch0Id === 4){
    i=0;
   try{
    audio.kill();
   }catch(e){
     console.log(e);
   }
   
  }
/*console.log({
  trackPadTouch0Id,
  trackPadTouch0X
});*/
/*leftAnalogX: buf[1],
  leftAnalogY: buf[2],
  rightAnalogX: buf[3],
  rightAnalogY: buf[4],
  l2Analog: buf[8],
  r2Analog: buf[9],

  dPadUp:    dPad === 0 || dPad === 1 || dPad === 7,
  dPadRight: dPad === 1 || dPad === 2 || dPad === 3,
  dPadDown:  dPad === 3 || dPad === 4 || dPad === 5,
  dPadLeft:  dPad === 5 || dPad === 6 || dPad === 7,

  cross: (buf[5] & 32) !== 0,
  circle: (buf[5] & 64) !== 0,
  square: (buf[5] & 16) !== 0,
  triangle: (buf[5] & 128) !== 0,

  l1: (buf[6] & 0x01) !== 0,
  l2: (buf[6] & 0x04) !== 0,
  r1: (buf[6] & 0x02) !== 0,
  r2: (buf[6] & 0x08) !== 0,
  l3: (buf[6] & 0x40) !== 0,
  r3: (buf[6] & 0x80) !== 0,

  share: (buf[6] & 0x10) !== 0,
  options: (buf[6] & 0x20) !== 0,
  trackPadButton: (buf[7] & 2) !== 0,
  psButton: (buf[7] & 1) !== 0,

  // ACCEL/GYRO


  // TRACKPAD
  trackPadTouch0Id: buf[35] & 0x7f,
  trackPadTouch0Active: (buf[35] >> 7) === 0,
  trackPadTouch0X: ((buf[37] & 0x0f) << 8) | buf[36],
  trackPadTouch0Y: buf[38] << 4 | ((buf[37] & 0xf0) >> 4),

  trackPadTouch1Id: buf[39] & 0x7f,
  trackPadTouch1Active: (buf[39] >> 7) === 0,
  trackPadTouch1X: ((buf[41] & 0x0f) << 8) | buf[40],
  trackPadTouch1Y: buf[42] << 4 | ((buf[41] & 0xf0) >> 4),

  timestamp: buf[7] >> 2});
  //battery: buf[12],
  //batteryShort1: buf[12] & 0x0f,
  //batteryShort2: buf[12] & 0xf0,
//batteryLevel: buf[12]});
  
  //console.log({r1: (buf[6] & 0x02) !== 0,
   // r2: (buf[6] & 0x08) !== 0,});
  /*
  console.log({
    leftAnalogX: buf[1],
    leftAnalogY: buf[2],
    rightAnalogX: buf[3],
    rightAnalogY: buf[4],
    l2Analog: buf[8],
    r2Analog: buf[9],

    dPadUp: buf[5] === 0 || buf[5] === 1 || buf [5] === 7,
    dPadRight: buf[5] === 1 || buf[5] === 2 || buf [5] === 3,
    dPadDown: buf[5] === 3 || buf[5] === 4 || buf [5] === 5,
    dPadLeft: buf[5] === 5 || buf[5] === 6 || buf [5] === 7,

    x: (buf[5] & 32) !== 0,
    cricle: (buf[5] & 64) !== 0,
    square: (buf[5] & 16) !== 0,
    triangle: (buf[5] & 128) !== 0,

    l1: (buf[6] & 0x01) !== 0,
    l2: (buf[6] & 0x04) !== 0,
    r1: (buf[6] & 0x02) !== 0,
    r2: (buf[6] & 0x08) !== 0,
    l3: (buf[6] & 0x40) !== 0,
    r3: (buf[6] & 0x80) !== 0,

    share: (buf[6] & 0x10) !== 0,
    options: (buf[6] & 0x20) !== 0,
    trackPadButton: (buf[7] & 2) !== 0,
    psButton: (buf[7] & 1) !== 0,

    //// usb only, doesn't work via bluetooth
    //// GYRO
    // TODO
    //// TRACKPAD
    trackPadTouch0Id: buf[35] & 0x7f,
    trackPadTouch0Active: (buf[35] >> 7) === 0,
    trackPadTouch0X: ((buf[37] & 0x0f) << 8) | buf[36],
    trackPadTouch0Y: buf[38] << 4 | ((buf[37] & 0xf0) >> 4),

    trackPadTouch1Id: buf[39] & 0x7f,
    trackPadTouch1Active: (buf[39] >> 7) === 0,
    trackPadTouch1X: ((buf[41] & 0x0f) << 8) | buf[40],
    trackPadTouch1Y: buf[42] << 4 | ((buf[41] & 0xf0) >> 4),

    timestamp: buf[7] >> 2,
    battery: buf[12],
    batteryShort1: buf[12] & 0x0f,
    batteryShort2: buf[12] & 0xf0,
  });*/

  if (data.readUInt8(0) === HCI_EVENT_PKT) {
    if (data.readUInt8(1) === EVT_DISCONN_COMPLETE) {
      var status = data.readUInt8(3);
      var handle = data.readUInt16LE(4);
      var reason = data.readUInt8(6);

      console.log('Disconn Complete');
      console.log('\t' + status);
      console.log('\t' + handle);
      console.log('\t' + reason);

      process.exit(0);
    } else if (data.readUInt8(1) === EVT_LE_META_EVENT) {
      if (data.readUInt8(3) === EVT_LE_CONN_COMPLETE) { // subevent
        var status = data.readUInt8(4);
        var handle = data.readUInt16LE(5);
        var role = data.readUInt8(7);
        var peerBdAddrType = data.readUInt8(8);
        var peerBdAddr = data.slice(9, 15);
        var interval = data.readUInt16LE(15);
        var latency = data.readUInt16LE(17);
        var supervisionTimeout = data.readUInt16LE(19);
        var masterClockAccuracy = data.readUInt8(21);

        console.log('LE Connection Complete');
        console.log('\t' + status);
        console.log('\t' + handle);
        console.log('\t' + role);
        console.log('\t' + ['PUBLIC', 'RANDOM'][peerBdAddrType]);
        console.log('\t' + peerBdAddr.toString('hex').match(/.{1,2}/g).reverse().join(':'));
        console.log('\t' + interval * 1.25);
        console.log('\t' + latency);
        console.log('\t' + supervisionTimeout * 10);
        console.log('\t' + masterClockAccuracy);
      } else if (data.readUInt8(3) === EVT_LE_CONN_UPDATE_COMPLETE) {
        var status = data.readUInt8(4);
        var handle = data.readUInt16LE(5);
        var interval = data.readUInt16LE(7);
        var latency = data.readUInt16LE(9);
        var supervisionTimeout = data.readUInt16LE(11);

        console.log('LE Connection Update Complete');
        console.log('\t' + status);
        console.log('\t' + handle);

        console.log('\t' + interval * 1.25);
        console.log('\t' + latency);
        console.log('\t' + supervisionTimeout * 10);

        writeHandle(handle, new Buffer('020001', 'hex'));
      }
    }
  } else if (data.readUInt8(0) === HCI_ACLDATA_PKT) {
    if ( ((data.readUInt16LE(1) >> 12) === ACL_START) &&
          (data.readUInt16LE(7) === ATT_CID) ) {

      var handle = data.readUInt16LE(1) & 0x0fff;
      var data = data.slice(9);

      console.log('ACL data');
      console.log('\t' + handle);
      console.log('\t' + data.toString('hex'));

    // disconnectConnection(handle, HCI_OE_USER_ENDED_CONNECTION);
    }
  }
});

bluetoothHciSocket.on('error', function(error) {
  // TODO: non-BLE adaptor

  if (error.message === 'Network is down') {
    console.log('state = powered off');
  } else {
    console.error(error);
  }
});

var HCI_COMMAND_PKT = 0x01;
var HCI_ACLDATA_PKT = 0x02;
var HCI_EVENT_PKT = 0x04;

var ACL_START = 0x02;

var ATT_CID = 0x0004;

var EVT_DISCONN_COMPLETE = 0x05;
var EVT_CMD_COMPLETE = 0x0e;
var EVT_CMD_STATUS = 0x0f;
var EVT_LE_META_EVENT = 0x3e;

var EVT_LE_CONN_COMPLETE = 0x01;
var EVT_LE_CONN_UPDATE_COMPLETE = 0x03;

var OGF_LE_CTL = 0x08;
var OCF_LE_CREATE_CONN = 0x000d;

var OGF_LINK_CTL = 0x01;
var OCF_DISCONNECT = 0x0006;

var LE_CREATE_CONN_CMD = OCF_LE_CREATE_CONN | OGF_LE_CTL << 10;
var DISCONNECT_CMD = OCF_DISCONNECT | OGF_LINK_CTL << 10;

var HCI_SUCCESS = 0;
var HCI_OE_USER_ENDED_CONNECTION = 0x13;

function setFilter() {
  var filter = new Buffer(14);
  var typeMask = (1 << HCI_EVENT_PKT) | (1 << HCI_ACLDATA_PKT);
  var eventMask1 = (1 << EVT_DISCONN_COMPLETE) | (1 << EVT_CMD_COMPLETE) | (1 << EVT_CMD_STATUS);
  var eventMask2 = (1 << (EVT_LE_META_EVENT - 32));
  var opcode = 0;

  filter.writeUInt32LE(typeMask, 0);
  filter.writeUInt32LE(eventMask1, 4);
  filter.writeUInt32LE(eventMask2, 8);
  filter.writeUInt16LE(typeMask, 12);

  bluetoothHciSocket.setFilter(filter);
}

bluetoothHciSocket.bindRaw();
setFilter();
bluetoothHciSocket.start();

function createConnection(address, addressType) {
  var cmd = new Buffer(29);

  // header
  cmd.writeUInt8(HCI_COMMAND_PKT, 0);
  cmd.writeUInt16LE(LE_CREATE_CONN_CMD, 1);

  // length
  cmd.writeUInt8(0x19, 3);

  // data
  cmd.writeUInt16LE(0x0060, 4); // interval
  cmd.writeUInt16LE(0x0030, 6); // window
  cmd.writeUInt8(0x00, 8); // initiator filter

  cmd.writeUInt8(addressType === 'random' ? 0x01 : 0x00, 9); // peer address type
  (new Buffer(address.split(':').reverse().join(''), 'hex')).copy(cmd, 10); // peer address

  cmd.writeUInt8(0x00, 16); // own address type

  cmd.writeUInt16LE(0x0028, 17); // min interval
  cmd.writeUInt16LE(0x0038, 19); // max interval
  cmd.writeUInt16LE(0x0000, 21); // latency
  cmd.writeUInt16LE(0x002a, 23); // supervision timeout
  cmd.writeUInt16LE(0x0000, 25); // min ce length
  cmd.writeUInt16LE(0x0000, 27); // max ce length

  bluetoothHciSocket.write(cmd);
}

function writeHandle(handle, data) {
  var cmd = new Buffer(9 + data.length);

  // header
  cmd.writeUInt8(HCI_ACLDATA_PKT, 0);
  cmd.writeUInt16LE(handle, 1);
  cmd.writeUInt16LE(data.length + 4, 3); // data length 1
  cmd.writeUInt16LE(data.length, 5); // data length 2
  cmd.writeUInt16LE(ATT_CID, 7);

  data.copy(cmd, 9);

  bluetoothHciSocket.write(cmd);
}

/*function disconnectConnection(handle, reason) {
  var cmd = new Buffer(7);

  // header
  cmd.writeUInt8(HCI_COMMAND_PKT, 0);
  cmd.writeUInt16LE(DISCONNECT_CMD, 1);

  // length
  cmd.writeUInt8(0x03, 3);

  // data
  cmd.writeUInt16LE(handle, 4); // handle
  cmd.writeUInt8(reason, 6); // reason

  bluetoothHciSocket.write(cmd);
}*/

createConnection('dc:0b:86:95:e8:a5', 'random');