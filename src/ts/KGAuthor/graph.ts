/// <reference path="../kg.ts" />

module KGAuthor {

    export interface AxisDefinition {
        min: any;
        max: any;
        title: string;
        orient: string;
    }

    export interface GraphDefinition {
        position: {
            x: any;
            y: any;
            width: any;
            height: any;
        }
        xAxis: AxisDefinition,
        yAxis: AxisDefinition,
        objects: KG.TypeAndDef[]

    }

    export class Graph extends AuthoringObject {

        public xScale;
        public yScale;
        public clipPath;

        constructor(def) {
            super(def);

            const g = this;

            g.xScale = new Scale({
                "name": KG.randomString(10),
                "axis": "x",
                "domainMin": def.xAxis.min,
                "domainMax": def.xAxis.max,
                "rangeMin": def.position.x,
                "rangeMax": addDefs(def.position.x, def.position.width)
            });

            g.yScale = new Scale({
                "name": KG.randomString(10),
                "axis": "y",
                "domainMin": def.yAxis.min,
                "domainMax": def.yAxis.max,
                "rangeMin": addDefs(def.position.y, def.position.height),
                "rangeMax": def.position.y
            });

            g.clipPath = new ClipPath({
                "name": KG.randomString(10),
                "paths": [new Rectangle({
                    x1: def.xAxis.min,
                    x2: def.xAxis.max,
                    y1: def.yAxis.min,
                    y2: def.yAxis.max,
                    inClipPath: true
                }, g)]
            }, g);

            g.def.objects.push({
                type: 'Axis',
                def: this.def.xAxis
            });
            g.def.objects.push({
                type: 'Axis',
                def: this.def.yAxis
            });
            g.subObjects = this.def.objects.map(function (obj) {
                return new KGAuthor[obj.type](obj.def, g)
            });
            g.subObjects.push(g.xScale);
            g.subObjects.push(g.yScale);
            g.subObjects.push(g.clipPath);
            console.log(g);

        }
    }

    export class GraphObjectGenerator extends AuthoringObject {

        public def: any;
        public subObjects: AuthoringObject[];

        constructor(def, graph?: Graph) {
            super(def);
            if (graph) {
                this.def.xScaleName = graph.xScale.name;
                this.def.yScaleName = graph.yScale.name;
                if(!def.inClipPath) {
                    this.def.clipPathName = def.clipPathName || graph.clipPath.name;
                }

            }
            this.subObjects = [];
        }

        extractCoordinates(coordinatesKey?, xKey?, yKey?) {
            coordinatesKey = coordinatesKey || 'coordinates';
            xKey = xKey || 'x';
            yKey = yKey || 'y';
            let def = this.def;
            if (def.hasOwnProperty(coordinatesKey)) {
                def[xKey] = def[coordinatesKey][0].toString();
                def[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
        }
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        }
    }

    export class ClipPath extends GraphObjectGenerator {

        constructor(def, graph) {
            def.inClipPath = true;
            super(def, graph);
        }

        parse_self(parsedData: KG.ViewDefinition) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        }
    }

    export class Scale extends AuthoringObject {

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.scales.push(this.def);
            return parsedData;
        }

    }

}