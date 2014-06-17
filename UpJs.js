// debut de la cage
(function (){

Element.prototype.submitUpload = function ()
{

    if(!document.getElementById("upload-progressUPJS"))
    {  
      document.body.insertAdjacentHTML('BeforeEnd', "<div id='ALLUPJS'><progress id='upload-progressUPJS' ></progress><div id='uploadUPJS'></div></div><div id='shadowUPJS'></div>");
    }

    // recuperation du l'url ou envoyer les données
    var destination = this.action;
    var progress = document.getElementById('upload-progressUPJS');
    var stat = document.getElementById('uploadUPJS');
    var shadow = document.getElementById('shadowUPJS');

    shadow.style.display = 'block';

    var unite = 0;
    var total = 0;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', destination);

    function init_unite(nb) 
    {
      if(unite == 0)
      {
          if(nb > 1000000000)
          {
              unite = "Go";
              total = nb/1000000000;
          }
          else if(nb > 1000000)
          {
              unite = "Mo";
              total = nb/1000000;
          }
          else if(nb > 1000)
          {
              unite = "Ko";
              total = nb/1000;
          }
          else
          {
              unite = "o";
              total = nb;
          }
      }
    }

    // action pendant le telechargement
    xhr.upload.onprogress = function(e)
    {
      progress.value = e.loaded;
      progress.max = e.total;

      init_unite(e.total);

      switch(unite)
      {
          case "Go" :
              loaded = e.loaded/1000000000;
              break;

          case "Mo" :
              loaded = e.loaded/1000000;
              break;

          case "Ko" :
              loaded = e.loaded/1000;
              break;

          case "o" :
              loaded = e.loaded;
              break;
      }

      stat.innerHTML = "Récéption de "+Math.round(loaded)+" "+unite+" sur "+Math.round(total)+" "+unite;

      if(Math.round(loaded) >= (Math.round(total))*0.97)
      {
        stat.innerHTML += ". Patientez ... ";
      }
    };

    // action a la fin du telechargement
    xhr.onload = function(e) 
    {
      if(this.status > 299 || this.status < 200)
      {
        stat.innerHTML = "Echec de l'envoi.";
        var event = new Event('finUPJS_fail');
      }
      else
      {
        stat.innerHTML = "Envoi terminé avec succés,<br> redirection dans quelques instant.";
        var event = new Event('finUPJS_success');
      }

      // emission d'un event custom , au cas ou il serait utile
      document.body.dispatchEvent(event);

      // simulation de redirection
      document.write(this.response)

    };

    // creation du formulaire virtuel
    var form = new FormData(this);

    // envoi du formulaire
    xhr.send(form);
};

var i = 0;
var checkForm = function(event)
{
  if(i==0)
  {
    i++;
    event.target.submitUpload();

    // efface le formulaire ???? pourquoi j'ai mis cela ?
    //  event.target.innerHTML = '';

    // stop l'envoi du fichier
    event.preventDefault();
  }
}

var init_upload = function()
{
  var forms = document.getElementsByTagName('form');

  for (var i = 0; i < forms.length; i++) {
    if(forms[i].enctype != '')
    {
      try 
      {
          forms[i].addEventListener("submit", checkForm, false);
      } 
      catch(e) 
      {
          forms[i].attachEvent("onsubmit", checkForm); //Internet Explorer 8
      }
    }   
  };
}


// charge le script d'upload si le navigateur le supporte  
if(XMLHttpRequest)
{
  var tmp = new XMLHttpRequest();
  if(tmp.upload)
  {
    init_upload();
  }
  else
  {
    console.log("votre navigateur est trops vieux pour profiter de toutes les fonctionnalitées du site.")
  }
}


// Fin de la cage
} )();
