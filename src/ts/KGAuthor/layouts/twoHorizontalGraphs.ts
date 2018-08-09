/// <reference path="../kgAuthor.ts" />

module KGAuthor {


    export class TwoHorizontalGraphs extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                rightGraphDef = def['rightGraph'];

            leftGraphDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            rightGraphDef.position = {
                "x": 0.55,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            l.subObjects.push(new Graph(leftGraphDef));
            l.subObjects.push(new Graph(rightGraphDef));

        }

    }

    export class TwoHorizontalGraphsPlusSidebar extends WideRectanglePlusSidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                rightGraphDef = def['rightGraph'],
                sidebarDef = def['sidebar'];

            const leftX = 0.1,
                rightX = 0.6,
                topY = 0.025,
                bottomY = 1.2,
                width = 0.369,
                graphHeight = 0.9,
                controlHeight = 0.3;

            leftGraphDef.position = {
                "x": leftX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            rightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": width,
                "height": graphHeight
            };

            const leftGraph = new Graph(leftGraphDef),
                rightGraph = new Graph(rightGraphDef),
                sidebar = new Sidebar(sidebarDef);

            l.subObjects.push(leftGraph);
            l.subObjects.push(rightGraph);
            l.subObjects.push(sidebar);

            if (def.hasOwnProperty('leftControls')) {
                const leftControlsContainer = {
                    position: {
                        x: leftX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['leftControls']
                        }
                    ]
                };
                l.subObjects.push(new DivContainer(leftControlsContainer));
            }

            if (def.hasOwnProperty('rightControls')) {
                const rightControlsContainer = {
                    position: {
                        x: rightX,
                        y: bottomY,
                        width: width,
                        height: controlHeight
                    },
                    children: [
                        {
                            type: "Controls",
                            def: def['rightControls']
                        }
                    ]
                };
                l.subObjects.push(new DivContainer(rightControlsContainer));
            }

        }

    }

    export class MathboxPlusGraph extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let mathboxDef = def['mathbox'],
                graphDef = def['graph'];

            mathboxDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            graphDef.position = {
                "x": 0.6,
                "y": 0.2,
                "width": 0.3,
                "height": 0.6
            };

            l.subObjects.push(new Mathbox(mathboxDef));
            l.subObjects.push(new Graph(graphDef));

        }

    }

    export class GeoGebraPlusGraph extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                graphDef = def['graph'];

            ggbAppletDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            graphDef.position = {
                "x": 0.6,
                "y": 0.2,
                "width": 0.3,
                "height": 0.6
            };

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Graph(graphDef));

        }

    }

    export class GeoGebraPlusGraphPlusSidebar extends WideRectanglePlusSidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                graphDef = def['graph'],
                sidebarDef = def['sidebar'];

            ggbAppletDef.position = {
                "x": 0.1,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            graphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }

    export class MathboxPlusGraphPlusSidebar extends WideRectanglePlusSidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let mathboxDef = def['mathbox'],
                graphDef = def['graph'],
                sidebarDef = def['sidebar'];

            mathboxDef.position = {
                "x": 0.025,
                "y": 0.025,
                "width": 0.444,
                "height": 0.95
            };

            graphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            l.subObjects.push(new MathboxContainer(mathboxDef));
            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }


}