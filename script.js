const onObserve = (entires, observer) => {
  entires.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("animate-in")) {
        entry.target.classList.add("visible");
      }
    } else {
      entry.target.classList.remove("visible");
    }
  });
};

const intersectionObserver = new IntersectionObserver(onObserve, {
  root: null,
  rootMargin: "-10px",
  threshold: 0.25,
});

const observed = document.querySelectorAll(".animate-in");
for (let i = 0; i < observed.length; i++) {
  const element = observed[i];
  intersectionObserver.observe(element);
}

let player;

const trojanElement = document.querySelector(".trojan");
const trojanVideoElement = document.querySelector(".trojan-video");
const trojanCloseBtn = document.querySelector(".trojan-video__close");

const tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
  trojanElement.classList.add("shown");
}

let done = false;

function onPlayerStateChange(event) {
  if (done) return;
  if (event.data == YT.PlayerState.BUFFERING) {
    done = true;
    trojanElement.classList.add("shown");
    event.target.stopVideo();
    event.target.unMute();
    event.target.seekTo(0);
  }
}

trojanElement.addEventListener(
  "click",
  () => {
    const autoplay = setInterval(() => {
      if (player !== YT.PlayerState.PLAYING) {
        trojanVideoElement.classList.add("shown");
        trojanElement.classList.remove("shown");

        player.playVideo();
        player.unMute();
        player.seekTo(0);
        clearInterval(autoplay);
      }
    }, 50);

    trojanCloseBtn.addEventListener("click", () => {
      player.destroy();
      trojanVideoElement.classList.remove("shown");
    });
  },
  { once: true }
);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("trojan-video", {
    height: "390",
    width: "640",
    videoId: "dQw4w9WgXcQ",
    playerVars: {
      muted: true,
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}
