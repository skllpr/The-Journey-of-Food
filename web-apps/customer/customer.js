//const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const itemData = document.getElementById('itemData')
const history = document.getElementById('history')
const qrResult = document.getElementById("qr-result");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

qrcode.callback = res => {
  if (res) {
    const productId = res
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    console.log(productId)
    const dbUrl = `https://ancient-fireant-72.loca.lt/`
    const url = dbUrl + `getData/${productId}`
    console.log(url)
    fetch(url).then(res => res.json())
    .then(res => {
      console.log(res.data)
      console.log(res.data[0][1])
      itemData.innerText = 'Item: ' + res.data[0][1] + '\n'
      let foodItemHistory = "History: "
      foodItemHistory = foodItemHistory + res.data[0][2] + '--->'
      const locations = res.data[0][3]
      console.log(locations)
      for(let i = 0; i < locations.length; i++) {
        const currLoc = locations[i].replace(/\*/g, ' ')
        if(i === locations.length - 1) {
          foodItemHistory = foodItemHistory + currLoc
        }
        else {
          foodItemHistory = foodItemHistory + currLoc + '--->'
        }
      }
      
      history.innerText = foodItemHistory

    })
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
