import { Component, OnInit,Input } from '@angular/core';
import Model from 'src/app/_data/Model';
import { graphviz }  from 'd3-graphviz';

@Component({
  selector: 'app-annvisual',
  templateUrl: './annvisual.component.html',
  styleUrls: ['./annvisual.component.css']
})
export class AnnvisualComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  @Input() model: Model = new Model();

  d3(){
    let inputlayerstring:string='';
    let hiddenlayerstring:string='';
    let digraphstring:string='digraph {';

    for(let i=0;i<this.model.inputColumns.length;i++)
    {
      inputlayerstring=inputlayerstring+'i'+i+',';
    }
    inputlayerstring=inputlayerstring.slice(0,-1);

    digraphstring=digraphstring+inputlayerstring+'->';

    for(let j=0;j<this.model.hiddenLayers;j++)
    {
      for(let i=0;i<this.model.hiddenLayerNeurons;i++)
      {
        hiddenlayerstring=hiddenlayerstring+'h'+j+'_'+i+',';
      }
      hiddenlayerstring=hiddenlayerstring.slice(0,-1);
      digraphstring=digraphstring+hiddenlayerstring+'->';
      hiddenlayerstring='';
    }
    digraphstring=digraphstring+'o}';
    
    
    graphviz('#graph').renderDot(digraphstring);
    }

    //'digraph {i0,i1,i2->h1,h2,h3->h21,h22,h23->o}'
}



