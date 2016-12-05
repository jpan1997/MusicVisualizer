var SC_CLIENT_ID = "57752f80398a70ff5cacb186de7e75d4";
var scData;

function loadAudioFromSC(input) {
  SC.initialize({client_id: SC_CLIENT_ID});

  SC.get("https://api.soundcloud.com/resolve", { url: input, client_id: SC_CLIENT_ID },
  function(sound) {
    scData = sound;
    $('#player').attr('src', sound.stream_url + '?client_id=' + SC_CLIENT_ID);
 });
}
