/// <reference path="../../kg.ts" />

module KG {
    export interface RectangleDefinition extends ViewObjectDefinition {
        x1: any;
        y1: any;
        x2: any;
        y2: any;
    }

    export class Rectangle extends ViewObject {

        private x1;
        private y1;
        private x2;
        private y2;

        private shape;

        constructor(def: RectangleDefinition) {
            setDefaults(def, {
                fill: 'blue',
                opacity: 0.2
            });
            setProperties(def, 'updatables',['x1', 'x2', 'y1', 'y2']);
            super(def);
        }

        // create SVG elements
        draw(layer) {
            let rect = this;
            if(rect.inClipPath){
                rect.rootElement = layer;
            } else {
                rect.rootElement = layer.append('g');
                rect.addClipPath().addInteraction();
            }
            rect.shape = rect.rootElement.append('rect');

            //rect.interactionHandler.addTrigger(rect.rootElement);
            return rect.addClipPath().addInteraction();
        }

        // update properties
        redraw() {
            let rect = this;
            const x1 = rect.xScale.scale(rect.x1);
            const y1 = rect.yScale.scale(rect.y1);
            const x2 = rect.xScale.scale(rect.x2);
            const y2 = rect.yScale.scale(rect.y2);
            rect.shape
                .attr('x', Math.min(x1, x2))
                .attr('y', Math.min(y1, y2))
                .attr('width', Math.abs(x2-x1))
                .attr('height', Math.abs(y2-y1))
                .attr('fill', rect.fill)
                .style('opacity', rect.opacity);
            return rect;
        }
    }
}