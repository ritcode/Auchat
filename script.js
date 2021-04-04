const peer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4, 0))
//let peer = new Peer()
peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  document.getElementById('id').textContent = "My id : " + id
});
let messages = document.getElementById('messages')

let conn
let messageValue
let peerid
let localstream
async function getmedia () {
  await navigator.mediaDevices.getUserMedia({
    audio: true
  }).then(stream => {
    localstream = stream
    console.log('got localstream')
  })
  .catch((err) => console.log('error in getting localstream:', err))
}

setTimeout(getmedia, 0);
let cbtn = () => {
  conn = peer.connect(document.getElementById('peerid').value)
  peerid = document.getElementById('peerid').value
  document.getElementById('peerid').value = ''
  console.log('connection sent')
  start()
}
let mbtn = () => {
  messageValue = document.getElementById('msg').value
  let d = document.createElement('h4')
  d.innerText = 'Me: '+ messageValue
  messages.appendChild(d)
  document.getElementById('msg').value = ''
  conn.send(messageValue);
}
document.getElementById('msgbtn').onclick = mbtn

document.getElementById('cbtn').onclick = cbtn

/*function showAfterCall() {
  document.getElementById('localaudio').setAttribute('hidden', false)
  document.getElementById('remoteaudio').setAttribute('hidden', false)
  let hangup = document.getElementById('hangbtn')
  hangup.setAttribute('hidden', false)
  hangup.onclick = () => {
    conn.close()
    document.getElementById('localaudio').setAttribute('hidden', true)
    document.getElementById('remoteaudio').setAttribute('hidden', true)
    hangup.setAttribute('hidden', true)
  }
}*/

document.getElementById('hangbtn').onclick = () => {
  conn.close()
  console.log('connection closed')
}

peer.on('connection', function(con) {
  conn = con
  console.log('connection Received')
  start()
});

function start() {
  conn.on('open', function() {
    // Receive messages
    conn.on('data', function(data) {
      let d = document.createElement('h2')
      d.innerText = 'Friend : '+ data
      messages.appendChild(d)
      console.log('Received', data);
    });

    document.getElementById('callbtn').onclick = () => {
      let call = peer.call(peerid, localstream)
      call.on('stream', function(stream) {
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
        document.getElementById('localaudio').srcObject = localstream
        document.getElementById('remoteaudio').srcObject = stream
        //showAfterCall()
      });
    }

    peer.on('call', function(call) {
      // Answer the call, providing our mediaStream
      //let ask = window.confirm('Do you want to accept call?')

      call.answer(localstream);
      call.on('stream', function(stream) {
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
        document.getElementById('localaudio').srcObject = localstream
        document.getElementById('remoteaudio').srcObject = stream
        //showAfterCall()
      });
    });
  });
}