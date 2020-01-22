
let connection = new RTCMultiConnection();

// connection.socketURL="https://rtcmulticonnection.herokuapp.com:443/"
connection.socketURL="http://localhost:3065/"

connection.session ={
audio: true,
video: true
}

connection.sdpConstraints.mandatory ={
OfferToReceiveAudio:true,
OfferToReceiveVideo:true
}

let videoContainer = document.getElementById('videos-container'); 

connection.onstream=function(event){
 let video = event.mediaElement;
 videoContainer.appendChild(video)
}
console.log('this is connection,', connection);
let roomid = document.getElementById('text-roomid')
roomid.value = 'addd'

document.getElementById('btn-open-or-join-room').onclick=function(){
this.disabled = true;
connection.openOrJoin(roomid.value||'predefined-roomid')

}