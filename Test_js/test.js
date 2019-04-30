
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

    let resp = {};
    resp.command = "ip_maquette_req";
    
    socket.emit("ip", resp);

    socket.on("Lampe", function(data) {
        console.log(data.command);
        switch (data.command) {
             case "up_lampe":
              console.log(data.ip_maquette);
              console.log(data.value);
              console.log(data.lampe);
              if(data.value===1){
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).value="eteindre";
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).className="btn btn-danger col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                document.getElementById(data.ip_maquette+"_lamp_on_"+data.lampe).src = "/lamp_on.png";
              }else if(data.value==0){
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).value="allumer";
                document.getElementById(data.ip_maquette+"_button_"+data.lampe).className="btn btn-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                document.getElementById(data.ip_maquette+"_lamp_on_"+data.lampe).src = "/lamp_off.png";
              }

              break;

              case "ip_maquette":
              console.log("hello hello");
              console.log(data.ip_maquette);
              let list = document.getElementById("mes_maquettes");
              if(document.getElementById("mes_maquettes").getElementsByTagName("div").length!=0){
              list.innerHTML = '';
              }
                let name = "auth_cam_";
                if (data.ip_maquette.length == 0) {
                    $("#authentification_cam").append("<li class='list-group-item' >Pas d'authentification de caméra demandées</li>");
                } else {
                for (var i in data.ip_maquette) {
                name = "maquette_" + i;
                            
                ip_auth = data.ip_maquette[i];          
                $("#mes_maquettes").append(
                   '<div class="card shadow" style="box-shadow:0 0.0rem 0.5rem 0 rgba(58, 59, 69, 0.15) !important">'+
                   '<div class="card-header py-3">'+
                       ' <h6 class="m-0 font-weight-bold text-dark">'+ip_auth+' </h6>'+
                    '</div>'+
                '<div class="col-xl-12 form-group card-body" style="text-align: center">'+
                  
                    '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_1" width="200"  src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_2" width="200" src="/lamp_off.png">'+
                   '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_3" width="200" src="/lamp_off.png">'+
                    '<img class="col-xl-1 col-lg-2 col-sm-2 col-2" width="100" id="'+ip_auth+'_lamp_on_4" width="200" src="/lamp_off.png"> '+
                    '<br>'+
                    '<br>'+

                    '<ul class="list-group" style="box-shadow: 0 0.0rem 0.2rem 0 rgba(58, 59, 69, 0.15) !important;" id="list_lampe">'+
                        '<li class="list-group-item " >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">Gestion des lampes</div>'+
                            ' <button class="btn" data-toggle="collapse" data-target="#Gestion_'+name+'" aria-expanded="false" aria-controls="collapseExample">'+
                            '<i class="fas fa-fw fa-camera"></i>'+
                            '</button>'+       
                            '</div>'+
                        '</li>'+
                        '<div class="collapse" id="Gestion_'+name+'">'+
                        '<li class="list-group-item " >'+
                           '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre toutes les lampes</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_all" type="button" value="allumer" onclick="lampe_onoff(all,\'' + ip_auth + '\')"/>'+
                          '</div>'+
                       '</li>'+
                        '<li class="list-group-item " >'+
                           '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre la lampe n°1</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_1" type="button" value="allumer" onclick="lampe_onoff(1,\'' + ip_auth + '\')"/>'+
                          '</div>'+
                       '</li>'+
                       '<li class="list-group-item" >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre la lampe n°2</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_2" type="button" value="allumer" onclick="lampe_onoff(2,\'' + ip_auth + '\')"/>'+
                           '</div>'+
                         '</li>'+
                         '<li class="list-group-item" >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                               '<div class="mr-auto p-2">allumer ou eteindre la lampe n°3</div>'+
                              '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_3" type="button" value="allumer" onclick="lampe_onoff(3,\'' + ip_auth + '\')"/>'+
                            '</div>'+
                        '</li>'+
                         '<li class="list-group-item" >'+
                            '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                              '<div class="mr-auto p-2">allumer ou eteindre la lampe n°4</div>'+
                               '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_4" type="button" value="allumer" onclick="lampe_onoff(4,\'' + ip_auth + '\')"/>'+
                          '</div>'+
                         '</li>'+
                         '</div>'+
                      '</ul>'+

                      '<ul class="list-group" style="box-shadow: 0 0.0rem 0.2rem 0 rgba(58, 59, 69, 0.15) !important;" id="list_lampe">'+
                      '<li class="list-group-item " >'+
                          '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                          '<div class="mr-auto p-2">Gestion des lampes</div>'+
                          ' <button class="btn" data-toggle="collapse" data-target="#Chen_'+name+'" aria-expanded="false" aria-controls="collapseExample">'+
                          '<i class="fas fa-fw fa-camera"></i>'+
                          '</button>'+       
                          '</div>'+
                      '</li>'+
                      '<div class="collapse" id="Chen_'+name+'">'+
                      '<li class="list-group-item " >'+
                         '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">allumer ou eteindre toutes les lampes</div>'+
                            '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_all" type="button" value="allumer" onclick="lampe_onoff(all,\'' + ip_auth + '\')"/>'+
                        '</div>'+
                     '</li>'+
                      '<li class="list-group-item " >'+
                         '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">allumer ou eteindre la lampe n°1</div>'+
                            '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_1" type="button" value="allumer" onclick="lampe_onoff(1,\'' + ip_auth + '\')"/>'+
                        '</div>'+
                     '</li>'+
                     '<li class="list-group-item" >'+
                          '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">allumer ou eteindre la lampe n°2</div>'+
                            '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_2" type="button" value="allumer" onclick="lampe_onoff(2,\'' + ip_auth + '\')"/>'+
                         '</div>'+
                       '</li>'+
                       '<li class="list-group-item" >'+
                          '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                             '<div class="mr-auto p-2">allumer ou eteindre la lampe n°3</div>'+
                            '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_3" type="button" value="allumer" onclick="lampe_onoff(3,\'' + ip_auth + '\')"/>'+
                          '</div>'+
                      '</li>'+
                       '<li class="list-group-item" >'+
                          '<div class="d-flex flex-row col-xl-12 col-lg-12 col-md-12 ">'+
                            '<div class="mr-auto p-2">allumer ou eteindre la lampe n°4</div>'+
                             '<input class="btn btn-success  col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3" id="'+ip_auth+'_button_4" type="button" value="allumer" onclick="lampe_onoff(4,\'' + ip_auth + '\')"/>'+
                        '</div>'+
                       '</li>'+
                       '</div>'+
                    '</ul>'+

                      '</div>'+
                    
                 
                '</div>'
                );
                }
            } 

              break;


            default:
              console.log("Command not supported by the web client");
          

        }
    })
       
    function lampe_onoff(lampe,ip_maquette)
    {
        v = document.getElementById(ip_maquette+"_button_"+lampe).value;
        console.log(v);
        if(v=="allumer"){
            objet = JSON.stringify({ip_client:ip_maquette, commande:"lampe_onoff",lampe_nb:lampe, value:1});
            var xhr = new XMLHttpRequest();
            //probleme car on ne trouvait pas le serveur depuis l'appli :/
            xhr.open("POST", "http://localhost:3000/lampe", true);
            // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(objet.toString());
            var update = new Promise(function(resolve, reject) {
                document.getElementById(ip_maquette+"_button_"+lampe).value="eteindre";
                document.getElementById(ip_maquette+"_button_"+lampe).className="btn btn-danger col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                document.getElementById(ip_maquette+"_lamp_on_"+lampe).src = "/lamp_on.png";
              });
              update.then(function() {});
               
              
        }
        else{
            objet = JSON.stringify({ip_client:ip_maquette, commande:"lampe_onoff",lampe_nb:lampe, value:0});
            var xhr = new XMLHttpRequest();
            //probleme car on ne trouvait pas le serveur depuis l'appli :/
            xhr.open("POST", "http://localhost:3000/lampe", true);
            // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(objet.toString());
            var up = new Promise(function(resolve, reject) {
                 document.getElementById(ip_maquette+"_button_"+lampe).value="allumer";
                 document.getElementById(ip_maquette+"_button_"+lampe).className="btn btn-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3";
                 document.getElementById(ip_maquette+"_lamp_on_"+lampe).src = "/lamp_off.png";
                });
                up.then(function() {});
        }
        
    }


    


