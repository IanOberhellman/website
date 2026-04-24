const chapters = [...document.querySelectorAll('.chapter')];
const pieces = [...document.querySelectorAll('.piece')];

const pieceOffsets = [
  { x: '0px', y: '80px' },
  { x: '-90px', y: '-50px' },
  { x: '90px', y: '-45px' },
  { x: '0px', y: '-95px' },
  { x: '0px', y: '110px' },
  { x: '0px', y: '0px' }
];

pieces.forEach((piece, idx) => {
  piece.style.setProperty('--x', pieceOffsets[idx].x);
  piece.style.setProperty('--y', pieceOffsets[idx].y);
});

const inView = (el) => {
  const rect = el.getBoundingClientRect();
  const topClamp = window.innerHeight * 0.25;
  const bottomClamp = window.innerHeight * 0.75;
  return rect.top < bottomClamp && rect.bottom > topClamp;
};

const updateScene = () => {
  let activeIndex = 0;

  chapters.forEach((chapter, idx) => {
    const active = inView(chapter);
    chapter.classList.toggle('active', active);
    if (active) activeIndex = idx;
  });

  pieces.forEach((piece, idx) => {
    if (idx <= activeIndex) {
      piece.style.opacity = '1';
      piece.style.transform = 'translate3d(0, 0, 0) scale(1)';
    } else {
      piece.style.opacity = '0';
      piece.style.transform = `translate3d(${pieceOffsets[idx].x}, ${pieceOffsets[idx].y}, 0) scale(0.9)`;
    }
  });
};

window.addEventListener('scroll', updateScene, { passive: true });
window.addEventListener('resize', updateScene);
window.addEventListener('load', updateScene);
