import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reactive-background',
  templateUrl: './reactive-background.component.html',
  styleUrls: ['./reactive-background.component.css']
})
export class ReactiveBackgroundComponent implements OnInit {

  numPoints: number = 450;
  speed: number = 0.001; // 0-1
  rotateInterval: number = 1000;
  maxSize: number = 6;

  minDistance: number = 0.07; //0-1
  cursorDistance: number = 0.07;

  private points: Point[] = [];

  private width = 200;
  private height = 200;
  private ratio = 1;

  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  private time: number = 0;

  constructor() { }

  private mouseX = 0;
  private mouseY = 0;

  ngOnInit(): void {

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX / this.width;
      this.mouseY = e.clientY / this.height;
    })

    this.canvas = (<HTMLCanvasElement>document.getElementById('bgCanvas'));
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
    } else {
      console.warn('Could not get canvas context!');
    }

    let i = 0;
    while (i < this.numPoints) {
      const x = Math.random();
      const y = Math.random();
      const size = (Math.random() * 0.8 + 0.2) * this.maxSize;
      const direction = Math.random() * 360;
      this.points.push(new Point(x, y, size, direction));
      i++;
    }

    window.addEventListener('resize', () => { this.resize() });
    this.resize();

    setInterval(() => {
      this.drawBackground();
    }, 1000 / 60);
  }

  drawBackground() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#222277";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.points.forEach((point, index) => {
      this.drawLines(point, index);
      this.drawPoint(point);
      this.updatePoint(point);
    });

    //this.drawPoint(new Point(this.mouseX, this.mouseY, 12, 0));

    this.time += 1;
  }

  drawLines(p: Point, index: number) {
    let i = index + 1;
    while (i < this.points.length) {
      const otherPoint = this.points[i];

      const dist = this.distance(p.x, p.y, otherPoint.x, otherPoint.y);
      if (dist < this.minDistance) {
        const h = HEX[Math.round((1 - dist / this.minDistance) * 16)]
        this.ctx!.strokeStyle = '#ffffff' + h + h;
        this.ctx!.beginPath();
        this.ctx!.moveTo(p.x * this.width, p.y * this.height);
        this.ctx!.lineTo(otherPoint.x * this.width, otherPoint.y * this.height);
        this.ctx!.stroke();
      }

      i++;
    }
  }

  drawPoint(p: Point) {
    this.ctx!.fillStyle = '#ffffff';
    this.ctx!.beginPath();
    this.ctx!.arc(p.x * this.width, p.y * this.height, p.size, 0, 2 * Math.PI);
    this.ctx!.fill();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = this.width / this.height;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.drawBackground();
  }

  updatePoint(p: Point) {
    const vx = Math.sin(p.direction);
    const vy = Math.cos(p.direction);

    p.x = p.x + vx * this.speed;
    p.y = p.y + vy * this.speed;

    const mx = this.mouseX;
    const my = this.mouseY;
    const distToCursor = this.distance(p.x, p.y, mx, my);
    if (distToCursor < this.cursorDistance) {

      p.x -= ((mx - p.x) / distToCursor) / 500;
      p.y -= ((my - p.y) / distToCursor) / 500;

      const grd = this.ctx!.createLinearGradient(p.x * this.width, p.y * this.height, mx * this.width, my * this.height);
      grd.addColorStop(0, '#ff0000ff');
      grd.addColorStop(1, '#ff000000');
      this.ctx!.strokeStyle = grd;
      this.ctx!.beginPath();
      this.ctx!.moveTo(p.x * this.width, p.y * this.height);
      this.ctx!.lineTo(mx * this.width, my * this.height);
      this.ctx!.stroke();
    }

    p.x %= 1;
    p.y %= 1;
  }

  distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(((x2 - x1) ** 2) + ((y2 / this.ratio - y1 / this.ratio) ** 2));
  }
}

class Point {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public direction: number
  ) { }
}

const HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];