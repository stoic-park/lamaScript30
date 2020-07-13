const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

// 카메라 사용??
// : error 발생
// TypeError: Failed to execute 'createObjectURL' on 'URL'
// : No function was found that matched the signature provided. at scripts.js:16
// ! 에러 헤결 in chrome
// https://stackoverflow.com/questions/27120757/failed-to-execute-createobjecturl-on-url

//  using  <video class="player"></video>
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      //   video.src = window.URL.createObjectURL(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`oh no!!!!`, err);
    });
}

// 캔버스 크기 조절하기
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);
    // debugger;

    // mess with them
    // pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);
    // 아련해진다
    // ctx.globalAlpha = 0.8;

    // pixels = greenScreen(pixels);

    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // snap.mp3 audio play
  // :played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  //   console.log(data)
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  // 이미지 다운로드 할 수 있다!
  //   link.textContent = "Download Image";
  // 이미지를 img태크로 넣어주기!
  link.innerHTML = `<img src"${data}" alt="lama world" />`;
  // insertBefore
  // : 사용자가 지정한(존재하는) node 앞에 node를 삽입하는 메소드
  // node.insertBefore(newnode, existingnode)
  strip.insertBefore(link, strip.firstChild);
}

// pixels에 들어있는 컬러 숫자를 가지고 뭐하는것 같은데
// 솔직히 모르겠습니다
// 적용되면 색깔이 바뀌네요
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

// 현란해진다
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 550] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });
  for (let i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0]; // red
    green = pixels.data[i + 1]; // green
    blue = pixels.data[i + 2]; // blue
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

// canplay, paintToCanvas를 바로 실행
// http://www.w3bai.com/ko/tags/av_event_canplay.html
// : 브라우저가 (이 시작 충분히 버퍼링 경우) 지정된 오디오 / 비디오 재생을 시작할 수있을 때 canplay 이벤트가 발생합니다.
video.addEventListener("canplay", paintToCanvas);
