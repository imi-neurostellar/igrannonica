import { Component, Input, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Model from 'src/app/_data/Model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @Input() model?: Model;
  @Input() inputCols: number = 1;

  @Input() lineThickness: number = 5;
  @Input() nodeRadius: number = 15;
  @Input() lineColor: string = '#ff0000';
  @Input() nodeColor: string = '#222277';
  @Input() inputNodeColor: string = '#44ee22';
  @Input() outputNodeColor: string = '#559977';

  private wrapper?: HTMLDivElement;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
    this.wrapper = (<HTMLDivElement>document.getElementById('graphWrapper'));
    this.canvas = (<HTMLCanvasElement>document.getElementById('graphCanvas'));
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
    } else {
      console.warn('Could not get canvas context!');
    }

    window.addEventListener('resize', () => { this.resize() });
    this.update();
    this.resize();

    /*setInterval(() => {
      this.update();
    }, 5000);*/
  }

  layers?: Node[][];

  update() {
    this.layers = [];

    let inputNodeIndex = 0;
    const inputLayer: Node[] = [];
    while (inputNodeIndex < this.inputCols) {
      const x = 0.5 / (this.model!.hiddenLayers + 2);
      const y = (inputNodeIndex + 0.5) / this.inputCols;
      const node = new Node(x, y, this.inputNodeColor);
      inputLayer.push(node);
      inputNodeIndex += 1;
    }
    this.layers.push(inputLayer);

    let layerIndex = 1;
    while (layerIndex < this.model!.hiddenLayers + 1) {
      const newLayer: Node[] = [];
      let nodeIndex = 0;
      while (nodeIndex < this.model!.hiddenLayerNeurons) {
        const x = (layerIndex + 0.5) / (this.model!.hiddenLayers + 2);
        const y = (nodeIndex + 0.5) / this.model!.hiddenLayerNeurons;
        const node = new Node(x, y, this.nodeColor);
        newLayer.push(node);
        nodeIndex += 1;
      }
      this.layers.push(newLayer);
      layerIndex += 1;
    }

    const outX = 1 - (0.5 / (this.model!.hiddenLayers + 2));
    const outY = 0.5;
    this.layers.push([new Node(outX, outY, this.outputNodeColor)])
    this.draw();
  }

  draw() {
    this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    let index = 0;
    while (index < this.layers!.length - 1) {
      for (let node1 of this.layers![index]) {
        for (let node2 of this.layers![index + 1]) {
          this.drawLine(node1, node2);
        }
      }
      index += 1;
    }

    for (let layer of this.layers!) {
      for (let node of layer) {
        this.drawNode(node);
      }
    }
  }

  drawLine(node1: Node, node2: Node) {
    this.ctx!.strokeStyle = this.lineColor;
    this.ctx!.beginPath();
    this.ctx!.moveTo(node1.x * this.width, node1.y * this.height);
    this.ctx!.lineTo(node2.x * this.width, node2.y * this.height);
    this.ctx!.stroke();
  }

  drawNode(node: Node) {
    this.ctx!.fillStyle = node.color;
    this.ctx!.strokeStyle = '#000';
    this.ctx!.beginPath();
    this.ctx!.arc(node.x * this.width, node.y * this.height, this.nodeRadius, 0, 2 * Math.PI);
    this.ctx!.fill();
    this.ctx!.stroke();
  }

  width = 200;
  height = 200;
  ratio = 1;

  resize() {
    this.width = this.wrapper!.offsetWidth;
    this.height = this.wrapper!.offsetHeight;
    this.ratio = this.width / this.height;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.draw();
  }
}

class Node {
  constructor(
    public x: number,
    public y: number,
    public color: string
  ) { }
}
