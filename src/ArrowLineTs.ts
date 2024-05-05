/**
 * ArrowLineTs is a React component that creates an arrow line between two points on an OpenLayers map.
 * The component uses the OpenLayers library to create a vector layer with a line feature and two arrowhead features.
 * The line feature is created using the LineString geometry class, while the arrowhead features are created by calculating the coordinates of the arrowhead points based on the start and end points, the length of the arrowhead lines, and the angle of the arrowhead lines.
 * The component takes the following props:
 * - point1: The start point of the arrow line.
 * - point2: The end point of the arrow line.
 * - color: The color of the arrow line.
 * - width: The width of the arrow line.
 * - map: The OpenLayers map object on which the arrow line will be displayed.
 * - angle: The angle of the arrowhead lines in degrees.
 * - arrowHeadPercentage: The percentage of the arrow line length that will be used to calculate the length of the arrowhead lines.
 * The component creates a vector layer with the arrow line features and adds it to the map. It also adjusts the map view to fit the extent of the arrow line features.
 * The component returns null as it does not render any visible elements in the DOM.
 * The calculateArrowhead function calculates the coordinates of the arrowhead points based on the end point, start point, length, and angle of the arrowhead lines. 
 *
 */

import React, { useEffect, useRef } from 'react';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Style, Stroke, Icon } from 'ol/style';
//import { transform } from 'ol/proj';
import { Geometry } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

export const ArrowLineTs: React.FC<IProps> = (props) => {
    console.log('point1:', props.point1);
    console.log('point2:', props.point2);

    //const layerRef = useRef(null);
    const layerRef = useRef<VectorLayer<VectorSource<Feature<Geometry>>> | null>(null);

    useEffect(() => {
        // Ensure map is defined
        if (!props.map) return;
        // Transform points from EPSG:4326 to EPSG:3857
        //const transformedPoint1 = transform(point1, 'EPSG:4326', 'EPSG:3857');
        //const transformedPoint2 = transform(point2, 'EPSG:4326', 'EPSG:3857');

        /**
         * Create arrow features based on the start and end points
         * @param point1 
         * @param point2 
         * @returns features array for arrow line and arrowheads
         */
        const createArrowFeatures = (point1: Coordinate, point2: Coordinate) => {
            console.log('point1:', point1);
            console.log('point2:', point2);
            const mainLine = new LineString([point1, point2]);
            // Length of the arrow head lines
            const arrowHeadLength = mainLine.getLength() * props.arrowHeadLengthPercentage;
            // Convert 45 degrees to radians
            const arrowWidth = props.angle * Math.PI / 180; 
            const endArrow1: Coordinate = calculateArrowhead(point2, point1, arrowHeadLength, arrowWidth);
            const endArrow2: Coordinate = calculateArrowhead(point2, point1 , arrowHeadLength, -arrowWidth);
            return [
                new Feature(mainLine),
                new Feature(new LineString([point2, endArrow1])),
                new Feature(new LineString([point2, endArrow2]))
            ];
        };

        if (!layerRef.current) {
            layerRef.current = new VectorLayer({
                source: new VectorSource(),
                style: new Style({
                    stroke: new Stroke({
                        color: props.color,
                        width: props.width
                    })
                })
            });
            console.log('dario: layerRef.current:', layerRef.current);
            props.map.addLayer(layerRef.current);
        }
        
        const features = createArrowFeatures(props.point1, props.point2);
        if (layerRef.current) {
            const source = layerRef.current.getSource();
            if (source) {
                source.clear();
                source.addFeatures(features);
            }
        }
        
        // Cleanup function
        return () => {
            if (props.shouldRemoveLayer && props.map && layerRef.current) {
                props.map.removeLayer(layerRef.current);
                layerRef.current = null;
            }
        };
    }, [props.map, props.point1, props.point2, props.color, props.width, props.angle, props.arrowHeadLengthPercentage, props.shouldRemoveLayer]);
   
    /**
     * Calculates the arrowhead coordinates based on the end point, start point, length and angle.
     * rotation is calculated based on the angle between the end and start points.
     * @param end 
     * @param start 
     * @param length 
     * @param angle 
     * @returns 
     */
    const calculateArrowhead = (end: Coordinate, start: Coordinate, length: number, angle: number) => {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx) + Math.PI + angle;    
        return [
            end[0] + length * Math.cos(rotation),
            end[1] + length * Math.sin(rotation)
        ];
    };
    
    return null;
};

interface IProps {
    point1: Coordinate;
    point2: Coordinate;
    color: string;
    width: number;
    map: any;
    angle: number;
    arrowHeadLengthPercentage: number;
    shouldRemoveLayer: boolean;
}
