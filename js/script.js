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
    audio: true,
    video:true
  }).then(stream => {
    localstream = stream
    console.log('got localstream')
  })
  .catch((err) => console.log('error in getting localstream:', err))
}
setTimeout(getmedia,0)

document.getElementById('msgbtn').onclick = () => {
  messageValue = document.getElementById('msg').value
  let d = document.createElement('h4')
  d.innerText = 'Me: ' + messageValue
  messages.appendChild(d)
  document.getElementById('msg').value = ''
  conn.send(messageValue);
}

document.getElementById('cbtn').onclick = () => {
  conn = peer.connect(document.getElementById('peerid').value)
  peerid = document.getElementById('peerid').value
  document.getElementById('connect').hidden = true
  document.getElementById('peerid').value = ''
  console.log('connection sent')
  afterConnecion();
  start()
}

peer.on('connection', function(con) {
  afterConnecion();
  conn = con
  peerid = con.peer
  document.getElementById('connect').hidden = true
  console.log('connection Received')
  start()
});

function start() {
  conn.on('open', function() {
    conn.on('data', function(data) {
      let d = document.createElement('h2')
      d.innerText = 'Friend : '+ data
      messages.appendChild(d)
      console.log('Received', data);
    });

    document.getElementById('callbtn').onclick = async () => {
      //await getmedia();
      let call = peer.call(peerid, localstream)
      afterCall(call)
    }

    peer.on('call', async (call) => {
      //await getmedia();
      call.answer(localstream);
      afterCall(call)
    });
  });
  conn.on('close', () => {
    console.log("connection closed!!")
    document.getElementById('connected').hidden = true
    document.getElementById('callMode').hidden = true;
    document.getElementById('connect').hidden = false
    document.innerHTML = ''
  })
}

function afterCall(call) {
  call.on('stream', function(stream) {
    document.getElementById('localaudio').srcObject = localstream
    document.getElementById('remoteaudio').srcObject = stream
  });
  call.on('close', () => {
    console.log("connection closed!!")
    document.getElementById('callMode').hidden = true;
  })
  document.getElementById('callMode').hidden = false
  //document.getElementById('remoteaudio').autoplay = true
  //document.getElementById('localaudio').autoplay = true
  let hangup = document.getElementById('hangbtn')
  hangup.onclick = () => {
    call.close()
    console.log("connection closed!!")
    document.getElementById('callMode').hidden = true
  }
}

function afterConnecion() {
  document.getElementById('connected').hidden = false
}





