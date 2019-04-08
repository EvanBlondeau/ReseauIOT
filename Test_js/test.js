
  function dim()
    {
        console.log("hi dim");
        objet = JSON.stringify({ip_client:"hello", commande:"diminuer"});
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "http://localhost:3000/change_time", true);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
        var tiime = document.getElementById("time").textContent;
        if(tiime==500){
            time = 1500;
        }else{
            time = tiime - 100;
        }
        document.getElementById("time").innerHTML =time;
    }

    function aug()
    {
        console.log("hi aug");
        objet = JSON.stringify({ip_client:"hello", commande:"augmenter"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST", "http://localhost:3000/change_time", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
        var tiime = document.getElementById("time").textContent;
        time = Number(tiime);
        if(time==500){
            time = 1500;
        }else{
            time = time + 100;
        }
        document.getElementById("time").innerHTML =time;
    }

    function chenillar()
    {
        console.log("hi chenillar");
        objet = JSON.stringify({ip_client:"hello", commande:"on_off_chen",val:"droit"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST", "http://localhost:3000/chenillar", true);
        // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
        var etat_chenillar = document.getElementById("etat_chenillar").textContent;
        if((etat_chenillar === "état du chenillar : ?") || (etat_chenillar === "état du chenillar : false") )
        {
            document.getElementById("etat_chenillar").innerHTML = "état du chenillar : true";
        }else{
            document.getElementById("etat_chenillar").innerHTML = "état du chenillar : false";
        }
    }

    function inv_chen()
    {
        console.log("inv chenillar");
        objet = JSON.stringify({ip_client:"hello", commande:"inverser_chenillar"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST", "http://localhost:3000/chenillar", true);
        // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
        var etat_chenillar = document.getElementById("etat_chenillar").textContent;
        if(etat_chenillar === "état du chenillar : ?")
        {
            document.getElementById("etat_chenillar").innerHTML = "état du chenillar : true";
        } 
    }

    function etat_lampe()
    {
        console.log("etat_lampe ??");
        objet = JSON.stringify({ip_client:"hello", commande:"bonjour"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST", "http://localhost:3000/etat_lampe", true);
        // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(objet.toString());
    }
    
    var socket = io.connect(
        "http://localhost:3000"
        );

    let response = {};
    response.command = "etat_lampe";
    
    socket.emit("ip", response);

    socket.on("Lampe", function(data) {
        console.log("helloods");
        switch (data.command) {
            case "update_lampe":
              console.log(data.tab_lampe);
              for(i=0;i<data.tab_lampe.lenght;i++){
                document.getElementById("lampe"+i).style.property = "fill:rgb(0,0,0);stroke-width:3;stroke:rgb(0,0,0)" ;
              }

              break;

            default:
              console.log("Command not supported by the web client");
          

        }
    })

            
    function lampe_onoff(lampe)
    {
        document.getElementById("button_"+lampe).value="eteindre";
        document.getElementById("lamp_on_"+lampe).src = "/lamp_on.png";
    }


