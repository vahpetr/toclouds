const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
let originDot = null;
let targetDots = {
  maxNum: 15,
  dom: []
};
let step_changeorigindot = 0;
let timer_changeorigindot = null;
const lineBox = {
  width: 600,
  height: 500,
  box: {}
};

let winW, winH;
let dots = {
  sum: 100,
  dom: []
};

function resize() {
    winW = window.innerWidth * 0.8;
    winH = window.innerHeight * 0.4;
    canvas.width = winW;
    canvas.height = winH;
    ctx.fillStyle = "#B3C1C7";
    ctx.strokeStyle = '#C1CCD2';
    dots.dom = [];
    if (timer_changeorigindot) {
      clearInterval(timer_changeorigindot);
    }
    step_changeorigindot = Math.min(winW, winH) * 16;
    timer_changeorigindot = setInterval(getOriginDot, step_changeorigindot);
  }
function draw() {
    ctx.clearRect(0, 0, winW, winH);
    if (dots.dom.length === 0) {
      return;
    }
    if (originDot) {
      for (let i = 0, sum = dots.sum; i < sum; i++) {
        const dot = dots.dom[i];
        dot.move();
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2, true);
        ctx.fill();
      }
      drawLines();
    } else {
      getOriginDot();
    }
    window.requestAnimationFrame(draw);
  }
function createDots() {
    for (let i = 0, sum = dots.sum; i < sum; i++) {
      let x = Math.random() * winW;
      let y = Math.random() * winH;
      let dot = new Dot(x, y, winW, winH);
      dots.dom.push(dot);
    }
  }
function drawLines() {
    targetDots.dom = [];
    lineBox.box.left = Math.max(originDot.x - lineBox.width / 2, 0);
    lineBox.box.right = Math.min(originDot.x + lineBox.width / 2, winW);
    lineBox.box.top = Math.max(originDot.y - lineBox.height / 2, 0);
    lineBox.box.bottom = Math.min(originDot.y + lineBox.height / 2, winH);
    ctx.beginPath();
    for (let i = 0, sum = dots.sum; i < sum; i++) {
      let dot = dots.dom[i];
      if (dot.x >= lineBox.box.left && dot.x <= lineBox.box.right && dot.y >= lineBox.box.top && dot.y <= lineBox.box.bottom) {
        if (targetDots.dom.length < targetDots.maxNum) {
          targetDots.dom.push(dot);
          ctx.moveTo(originDot.x, originDot.y);
          ctx.lineTo(dot.x, dot.y);
        }
      }
    }
    for (let i = 0, len = targetDots.dom.length; i < len; i++) {
      let _index = i===len-1?0:i + 1;
      if (_index < len) {
        ctx.moveTo(targetDots.dom[i].x, targetDots.dom[i].y);
        ctx.lineTo(targetDots.dom[_index].x, targetDots.dom[_index].y);
      }
    }
    ctx.stroke();
  }
function getOriginDot() {
    let index = Math.floor(Math.random() * dots.sum);
    originDot = dots.dom[index];
  }
class Dot {
  constructor(x, y, boxW, boxH) {
    this.x = x;
    this.y = y;
    this.tranlateX = 0;
    this.tranlateY = 0;
    this.box = {
      width: boxW,
      height: boxH
    };
    this.radius = (0.5 + Math.random()) * 5;

    this.directions = {
      x: (Math.random() - 0.5) > 0 ? true : false,
      y: (Math.random() - 0.5) > 0 ? true : false
    }
  }
  move() {
    if ((this.directions.x && this.x + this.radius >= this.box.width) || (!this.directions.x && this.x - this.radius <= 0)) {
      this.directions.x = !this.directions.x;
    }
    if ((this.directions.y && this.y + this.radius >= this.box.height) || (!this.directions.y && this.y - this.radius <= 0)) {
      this.directions.y = !this.directions.y;
    }
    this.tranlateX = this.directions.x ? Math.round(0.5 + Math.random()) : -Math.round(0.5 + Math.random());
    this.tranlateY = this.directions.y ? Math.round(0.5 + Math.random()) : -Math.round(0.5 + Math.random());
    this.x += this.tranlateX;
    this.y += this.tranlateY;
  }
}
resize();
createDots();
window.requestAnimationFrame(draw);
window.onreset = function(){
  ctx.clearRect(0, 0, winW, winH);
  resize();
  createDots();
}