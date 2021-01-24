//const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

qrcode.callback = res => {
  if (res) {
    const productId = res
    outputData.innerText = productId;
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
      if(res.data !== []) {
        Radar.initialize("prj_test_pk_0234be44c8d7f10ca09b8825f23138c850ca2b36");
        Radar.ipGeocode(function(err, result){
          if(result && result.address){
            console.log(result.address);
            let city = result.address.city
            city = city.replace(/ /g, '*')
            let state = result.address.state
            state = state.replace(/ /g, '*')
            console.log(city, state)

            const processingUrl = dbUrl + `newProcessing/${productId}/${city},*${state}`
            console.log(processingUrl)
            fetch(processingUrl).then(res => res.json())
            .then(res => {
              console.log(res.data)
            })
          }
        });
      }
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
