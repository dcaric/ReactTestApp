import React, { useEffect, useRef, useContext } from 'react';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Style, Stroke, Icon } from 'ol/style';
import { transform } from 'ol/proj';

function ArrowLine({ point1, point2, color, width, map, angle, arrwHeadPercentage }) {
    console.log('point1:', point1);
    console.log('point2:', point2);

    const layerRef = useRef(null);
  
    useEffect(() => {
        if (!map) return;  // Ensure map is defined
        // Transform points from EPSG:4326 to EPSG:3857
        const transformedPoint1 = transform(point1, 'EPSG:4326', 'EPSG:3857');
        const transformedPoint2 = transform(point2, 'EPSG:4326', 'EPSG:3857');

        if (!layerRef.current) {
            layerRef.current = new VectorLayer({
            source: new VectorSource(),
                style: new Style({
                    stroke: new Stroke({
                    color: color,
                    width: width
                    }),
                    image: new Icon({
                    anchor: [0.75, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: 'path/to/arrowhead.png'
                    })
                })
            });
            console.log('dario: layerRef.current:', layerRef.current);
            map.addLayer(layerRef.current);
        }

        const features = createArrowFeatures(point1, point2);
        layerRef.current.getSource().clear();
        layerRef.current.getSource().addFeatures(features);

        // Adjust fit to check for valid extent
        const arrowExtent = layerRef.current.getSource().getExtent();
        if (!isEmptyExtent(arrowExtent)) {
            map.getView().fit(arrowExtent, {
            padding: [50, 50, 50, 50],
            duration: 500
            });
        }

        return () => {
            if (map && layerRef.current) {
            //map.removeLayer(layerRef.current);
            }
        };
    }, [map, point1, point2, color, width]);

    function isEmptyExtent(extent) {
        return !extent || extent[0] === Infinity || extent.some(num => isNaN(num));
    }
  


    const createArrowFeatures = (point1, point2) => {
        console.log('point1:', point1);
        console.log('point2:', point2);
        const mainLine = new LineString([point1, point2]);
        const arrowLength =3; // Length of the arrow head lines
        const arrowWidth = angle * Math.PI / 180; // Convert 45 degrees to radians

        const endArrow1 = calculateArrowhead(point2, point1, arrowLength, arrowWidth);
        const endArrow2 = calculateArrowhead(point2, point1, arrowLength, -arrowWidth);

        return [
            new Feature(mainLine),
            new Feature(new LineString([point2, endArrow1])),
            new Feature(new LineString([point2, endArrow2]))
        ];
    };

    const calculateArrowhead = (end, start, length, angle) => {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        // Correct the angle by adding or subtracting pi (180 degrees) if necessary
        const rotation = Math.atan2(dy, dx) + Math.PI + angle;
    
        return [
            end[0] + length * Math.cos(rotation),
            end[1] + length * Math.sin(rotation)
        ];
    };
    

    return null;
}

export default ArrowLine;
