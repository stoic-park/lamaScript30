// Get Our Elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

// Build out functions
// 1. 영상 재생 함수
function togglePlay() {
  const method = video.paused ? "play" : "pause";
  video[method]();
}

// 2. 플레이 버튼 업데이트
function updateButton() {
  const icon = this.paused ? "►" : "⏸";
  //   const icon = this.pause ? "►" : "❚ ❚";
  toggle.textContent = icon;
  //   console.log("Update the button");
}

// 3. 스킵버튼
function skip() {
  //   console.log("skipping!");
  //   console.log(this.dataset);
  console.log(this.dataset.skip); // 25 / 10
  video.currentTime += parseFloat(this.dataset.skip); // 함수는 문자열을 분석해 부동소수점 실수로 반환합니다.
}

// 4. 볼륨 & 재생속도
function handleRangeUpdate() {
  video[this.name] = this.value;
  //   console.log(this.name);
  //   console.log(this.value);
}

// 5. 영상 길이
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// 6. 영상 스크럽
function scrup(e) {
  const scrupTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrupTime;
  //   console.log(e);
}

// Hooks up the event listeners

// 1. 영상재생
video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);

// 2. 플레이 버튼 업데이트
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

// 3. 스킵버튼
skipButtons.forEach((button) => button.addEventListener("click", skip));

// 4. 볼륨 & 재생속도
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener("mousemove", handleRangeUpdate)
);

// 5. 영상 길이
video.addEventListener("timeupdate", handleProgress);

// 6. 영상 스크럽
let mousedown = false;
progress.addEventListener("click", scrup);
// 6-1 마우스 드래그
progress.addEventListener("mousemove", (e) => mousedown && scrup(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
