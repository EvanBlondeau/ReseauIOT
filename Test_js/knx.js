var knx = require('knx');

const http = require("http");
const ip = require("ip");
const io = require("socket.io-client");

const server = http.createServer();
const myIP = ip.address();

var temps = 1000;
var set_chenillar=[1,2,3,4];
var set_chenillar_inverse=[4,3,2,1];
var chen = set_chenillar;

process.stdin.on('data',(data) =>{
  dat = data.toString().trim();
  console.log(dat);
  switch(dat){
    case "disconect":
    connection.Disconnect();
    console.log("bye bye");
    break;
    default:
    console.log("no");
    break;
  }

});



var connection = new knx.Connection( {
    // ip address and port of the KNX router or interface
    ipAddr: '192.168.0.10', ipPort: 3671,
    
    handlers: {
      // wait for connection establishment before sending anything!
      connected: function() {
        console.log('Hurray, I can talk KNX!');
        // WRITE an arbitrary boolean request to a DPT1 group address
        
        //chenilar();


        /*start_lampe(1); 
        start_lampe(2);
        start_lampe(3);
        start_lampe(4); 
        
    
      // sleep(100);
        down_lampe(1);
        down_lampe(2);
        down_lampe(3);
        down_lampe(4);
        */

        function start_lampe(nb)
        {
            connection.write("0/1/"+nb, 1);
        }

        function down_lampe(nb)
        {
            connection.write("0/1/"+nb, 0);
        }

        function sleep(ms)
        {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function chenilar()
        {
            while(1){
                start_lampe(chen[0]);
                await sleep(temps);
                down_lampe(chen[0]);
                start_lampe(chen[1]);
                await sleep(temps);
                down_lampe(chen[1]);
                start_lampe(chen[2]);
                await sleep(temps);
                down_lampe(chen[2]);
                start_lampe(chen[3]);
                await sleep(temps);
                down_lampe(chen[3]);
            }
       
        }


      },
      // get notified for all KNX events:
      event: function(evt, src, dest, value) { console.log(
          "event: %s, src: %j, dest: %j, value: %j",
          evt, src, dest, value
        );
        if(dest == "0/3/1")
        {
          console.log("down bouton");
          if(temps == 500)
          {
            temps = 1000;
          }else{
            temps = temps -100;
          }
          console.log("time: "+temps);
        }
        if(dest == "0/3/2")
        {
          console.log("up bouton");
          if(temps == 1500)
          {
            temps = 1000;
          }else{
            temps = temps + 100;
          }
          console.log("time: "+temps);
        }

        if(dest == "0/3/3"){
          console.log("yello");
          if(chen === set_chenillar)
          {
            chen = set_chenillar_inverse;
          }else if(chen === set_chenillar_inverse)
          {
            chen = set_chenillar;
          }
        }
      },
      // get notified on connection errors
      error: function(connstatus) {
        console.log("**** ERROR: %j", connstatus);
      }
    }
});


var socket = io.connect(
  "http://localhost:3000"
);
let response = {};
response.command = "send_ip";
response.ip = myIP;

// Emission 
socket.emit("ip", response);

// Pour la reconnexion (échange des adresses IP avec le serveur)
socket.on("reconnection", function(data) {
  console.log(data);
  let response = {};
  response.command = "send_ip";
  response.ip = myIP;
  switch (data.command) {
    case "sync":
      socket.emit("ip", response);
      break;
    default:  
      console.log("Command not supported..");
  }
});

socket.on("data_send", function(data) {
  console.log(data);
  let response = {};
  response.command = "send_ip";
  response.ip = myIP;
  switch (data.command) {

    case "diminuer":
        console.log("down web");
          if(temps == 500)
          {
            temps = 1000;
            console.log(temps);
        }else{
            temps = temps -100;
            console.log(temps);
          }
        console.log("time: "+temps);
        break;

    case "augmenter":
        console.log("up web ");
        if(temps == 1500)
          {
            temps = 1000;
            console.log(temps);
        }else{
            temps = temps + 100;
            console.log(temps);
          }
        console.log("time: "+temps);
        break;

    case "inverser_chenillar":
        console.log("invers web ");
        if(chen === set_chenillar)
        {
          chen = set_chenillar_inverse;
        }else if(chen === set_chenillar_inverse)
        {
          chen = set_chenillar;
        }
        console.log("time: "+temps);
        break;


    default:
      console.log("Command not supported..");
      break;
  }
});

server.listen(8000);