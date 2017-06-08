/// <reference path="../kg.ts" />

module KG {

    export interface DimensionsDefinition {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }

    export interface ViewDefinition {
        dim?: DimensionsDefinition;
        scales: ScaleDefinition[];
        objects: {
            axes?: AxisDefinition[]
            points?: ViewObjectDefinition[];
            labels?: ViewObjectDefinition[];
        };
    }

    export interface IView {
        container: Container;
        dimensions: {
            x: number; // coordinate of left edge, as fraction of container width
            y: number; // coordinate of top edge, as fraction of container height
            width: number; // width of view, as fraction of container width
            height: number; // height of view, as fraction of container height
        }

        // each view has a root <div> element, with a single child <svg> with same dimensions.
        div: HTMLDivElement;
        svg: SVGAElement;
        viewObjects: ViewObject[];
        scales: any;
    }

    export class View implements IView {

        public container;   // container object that contains this view, and also the model
        public div;         // root div of this view
        public svg;         // root svg of this view
        public dimensions;  // position, height, and width of this view (in pixels)
        public scales;      // scales associated with this view (if there are multiple graphs, could be multiple scales)
        public viewObjects; // array of ViewObjects


        constructor(container: Container, def: ViewDefinition) {

            let v = this;
            v.container = container;
            v.dimensions = _.defaults(def.dim,{x: 0, y: 0, width: 1, height: 1});

            // add div element as a child of the enclosing container
            v.div = d3.select(container.div).append("div").style('position', 'relative').style('background-color', 'white');

            // add svg element as a child of the div
            v.svg = v.div.append("svg");

            // establish scales
            if (def.hasOwnProperty('scales')) {
                v.scales = {};
                for(let i = 0; i<def.scales.length; i++) {
                    let scaleDef = def.scales[i];
                    scaleDef.model = v.container.model;
                    v.scales[scaleDef.name] = new Scale(scaleDef);
                }
            }

            // set initial dimensions of the div and svg
            v.updateDimensions();

            // add child objects
            if (def.hasOwnProperty('objects')) {
                v.viewObjects = [];
                if (def.objects.hasOwnProperty('axes')) {
                    let axisLayer = v.svg.append('g').attr('class', 'axes');
                    for (let i = 0; i < def.objects.axes.length; i++) {
                        let axisDef = def.objects.axes[i];
                        axisDef.view = v;
                        axisDef.model = v.container.model;
                        axisDef.layer = axisLayer;
                        v.viewObjects.push(new Axis(axisDef));
                    }
                }
                if (def.objects.hasOwnProperty('points')) {
                    let pointLayer = v.svg.append('g').attr('class', 'points');
                    for (let i = 0; i < def.objects.points.length; i++) {
                        let pointDef = def.objects.points[i];
                        pointDef.view = v;
                        pointDef.model = v.container.model;
                        pointDef.layer = pointLayer;
                        v.viewObjects.push(new Point(pointDef));
                    }
                }
                if (def.objects.hasOwnProperty('labels')) {
                    let labelLayer = v.div.append('div').attr('class', 'labels');
                    for (let i = 0; i < def.objects.labels.length; i++) {
                        let labelDef =  def.objects.labels[i];
                        labelDef.view = v;
                        labelDef.model = v.container.model;
                        labelDef.layer = labelLayer;
                        v.viewObjects.push(new Label(labelDef));
                    }
                }
            }

        }

        updateDimensions() {
            let v = this,
                w = v.container.width,
                h = v.container.height,
                dim = v.dimensions,
                vx = dim.x*w,
                vy = dim.y*h,
                vw = dim.width*w,
                vh = dim.height*h;
            v.div.style('left', vx + 'px');
            v.div.style('top', vy + 'px');
            v.div.style('width', vw + 'px');
            v.div.style('height', vh + 'px');
            v.svg.style('width', vw);
            v.svg.style('height', vh);
            for(let scaleName in v.scales) {
                if(v.scales.hasOwnProperty(scaleName)) {
                    let s = v.scales[scaleName];
                    s.extent = (s.axis == 'x') ? vw : vh;
                }
            };
            v.container.model.update();
            return v;
        }

    }

}