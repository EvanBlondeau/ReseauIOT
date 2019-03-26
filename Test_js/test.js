
  function dim()
    {
        console.log("hi dim");
        objet = JSON.stringify({ip_client:"hello", commande:"diminuer"});
        var xhr = new XMLHttpRequest();
        //probleme car on ne trouvait pas le serveur depuis l'appli :/
        xhr.open("POST", "http://localhost:3000/change_time", true);
        // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

        //Send the proper header information along with the request
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
        // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');

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
        if(etat_chenillar === "état du chenillar : ?")
        {
            document.getElementById("etat_chenillar").innerHTML = "état du chenillar : true";
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

