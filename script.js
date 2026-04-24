const chapters = Array.from(document.querySelectorAll('.chapter'));
const cards = Array.from(document.querySelectorAll('.card'));
const pieces = Array.from(document.querySelectorAll('.piece'));
const stage = document.querySelector('.watch-stage');

const pieceOffsets = [
  { x: 0, y: 100, rotate: -6, scale: 0.88 },
  { x: -110, y: -60, rotate: -8, scale: 0.85 },
  { x: 120, y: -70, rotate: 8, scale: 0.84 },
  { x: 0, y: -120, rotate: -4, scale: 0.83 },
  { x: 0, y: 130, rotate: 3, scale: 0.86 },
  { x: 0, y: 0, rotate: 0, scale: 0.95 }
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (t) => 1 - (1 - t) ** 3;

let ticking = false;

function getClosestChapterIndex() {
  let closestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;
  const viewportCenter = window.innerHeight * 0.5;

  chapters.forEach((chapter, index) => {
    const rect = chapter.getBoundingClientRect();
    const center = rect.top + rect.height * 0.5;
    const distance = Math.abs(center - viewportCenter);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function getChapterProgress(chapter) {
  const rect = chapter.getBoundingClientRect();
  const start = window.innerHeight * 0.82;
  const end = window.innerHeight * 0.2;
  return clamp((start - rect.top) / (start - end));
}

function updateCards(activeIndex) {
  cards.forEach((card, index) => {
    const progress = getChapterProgress(chapters[index]);
    const emphasis = 1 - Math.abs(progress - 0.5) * 2;
    const opacity = clamp(0.18 + emphasis * 0.82);
    const y = 45 - emphasis * 45;

    card.style.opacity = opacity.toFixed(3);
    card.style.transform = `translateY(${y.toFixed(2)}px)`;
    card.classList.toggle('is-current', index === activeIndex);
  });
}

function updatePieces(activeIndex) {
  pieces.forEach((piece, index) => {
    const offset = pieceOffsets[index];
    const chapterProgress = easeOut(getChapterProgress(chapters[index]));
    const assembled = index < activeIndex ? 1 : index === activeIndex ? chapterProgress : 0;

    const x = offset.x * (1 - assembled);
    const y = offset.y * (1 - assembled);
    const rotate = offset.rotate * (1 - assembled);
    const scale = offset.scale + (1 - offset.scale) * assembled;
    const opacity = clamp(index <= activeIndex ? 0.08 + assembled * 0.92 : 0, 0, 1);

    piece.style.opacity = opacity.toFixed(3);
    piece.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
  });
}

function updateStageParallax(activeIndex) {
  const currentRect = chapters[activeIndex].getBoundingClientRect();
  const chapterCenter = currentRect.top + currentRect.height * 0.5;
  const shift = clamp((window.innerHeight * 0.5 - chapterCenter) / window.innerHeight, -0.2, 0.2);

  stage.style.setProperty('--tilt-x', `${(shift * -10).toFixed(2)}deg`);
  stage.style.setProperty('--tilt-y', `${(shift * 16).toFixed(2)}deg`);
  stage.style.setProperty('--float-y', `${(shift * 16).toFixed(2)}px`);
}

function render() {
  const activeIndex = getClosestChapterIndex();
  updateCards(activeIndex);
  updatePieces(activeIndex);
  updateStageParallax(activeIndex);
  ticking = false;
}

function requestRender() {
  if (!ticking) {
    window.requestAnimationFrame(render);
    ticking = true;
  }
}

window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender);
window.addEventListener('load', requestRender);
