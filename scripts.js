(function (window, document) {
  const player = document.querySelector('.player');
  const video = player.querySelector('video.viewer');
  const toggleButton = player.querySelector('button.toggle');
  const rangeSelectors = player.querySelectorAll('input[type="range"]');
  const skipButtons = player.querySelectorAll('button[data-skip]');
  const progressWrapper = player.querySelector('.progress');
  const progressFilled = player.querySelector('.progress__filled');
  const fullScreenButton = player.querySelector('.fullscreen');

  initPlayPause(toggleButton, video);
  initRangeSelectors(rangeSelectors, video);
  initSkipButtons(skipButtons, video);
  initProgressBar(progressWrapper, progressFilled, video);
  initFullScreenButton(fullScreenButton, player);

  function initPlayPause(toggle, viewer) {
    toggle.addEventListener('click', e => togglePlay(e, toggle, viewer));
    viewer.addEventListener('click', e => togglePlay(e, toggle, viewer));
    window.addEventListener('keyup', e => pressSpaceBar(e, toggle, viewer));
  }

  function initRangeSelectors(ranges, viewer) {
    ranges.forEach(range => {
      range.addEventListener('change', e => changeRange(e, viewer));
    });
    ranges.forEach(range => {
      range.addEventListener('mousemove', e => changeRange(e, viewer));
    });
  }

  function initSkipButtons(skipButtons, viewer) {
    skipButtons.forEach(button => {
      button.addEventListener('click', e => skip(e, viewer));
    });
  }

  function initProgressBar(progress, progressBar, viewer) {
    let mousedown = false;
    viewer.addEventListener('timeupdate', e => updateProgress(progressBar, viewer));
    progress.addEventListener('click', e => moveProgress(e, progressBar, viewer));
    progress.addEventListener('mousemove', e => {
      if (mousedown) moveProgress(e, progressBar, viewer);
    });
    progress.addEventListener('mousedown', e => mousedown = true);
    progress.addEventListener('mouseup', e => mousedown = false);
  }

  function initFullScreenButton(button, player) {
    button.addEventListener('click', () => toggleFullscreen(button, player));
  }


  function togglePlay(e, toggle, viewer) {
    toggle.innerText = viewer.paused ? '▐▐' : '►';
    const action = viewer.paused ? 'play' : 'pause';
    viewer[action]();
  }

  function pressSpaceBar(e, toggle, viewer) {
    const SPACE_BAR_CODE = 32;
    if (e.keyCode === SPACE_BAR_CODE) togglePlay(e, toggle, viewer);
  }

  function changeRange(e, viewer) {
    viewer[e.target.name] = e.target.value;
  }

  function skip(e, viewer) {
    viewer.currentTime += +e.target.dataset.skip;
  }

  function updateProgress(progressBar, viewer) {
    const percent = viewer.currentTime / viewer.duration;
    progressBar.style.flexBasis = `${percent * 100}%`;
  }

  function moveProgress(e, progressBar, viewer) {
    const percent = e.offsetX / e.target.offsetWidth;
    viewer.currentTime = percent * viewer.duration;
  }

  function toggleFullscreen(button, player) {
    if (isFullscreen()) {
      exitFullscreen(button);
    } else {
      enterFullscreen(button, player);
    }
  }

  function isFullscreen() {
    return document.fullscreenElement ||
           document.mozFullscreenElement ||
           document.webkitFullscreenElement;
  }

  function exitFullscreen(button) {
    const exit = document.exitFullscreen ||
                 document.mozCancelFullScreen ||
                 document.webkitExitFullscreen;
    exit.call(document);
    button.innerHTML = 'Enter Fullscreen';
  }

  function enterFullscreen(button, player) {
    const enter = player.requestFullscreen ||
                  player.mozRequestFullScreen ||
                  player.msRequestFullscreen ||
                  player.webkitRequestFullScreen;
    enter.call(player);
    button.innerHTML = 'Exit Fullscreen';
  }

})(window, document);
