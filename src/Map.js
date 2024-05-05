import React, { useRef, useEffect, useState } from 'react';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
//import ArrowLine from './ArrowLine';
import { ArrowLineTs } from './ArrowLineTs';

const Map = () => {
  const mapRef = useRef();
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    const olMap = new OLMap({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    setMapInstance(olMap);  // Set the map instance once it is created

    return () => {
      olMap.setTarget(undefined);  // Clean-up function to unset the target
    };
  }, []);

  // Example hardcoded points for ArrowLine component
  /**
   * 

1747885.8567334476, 5751544.571572962
1747888.6731165645, 5751541.600563185


1747888.6731165645, 5751541.600563185
1747892.4134514553, 5751538.054520557


1747892.4134514553, 5751538.054520557
1747895.9645432115, 5751532.87921764

   */

  const pointsArray = [
    { point1: [1747885.8567334476, 5751544.571572962], point2: [1747888.6731165645, 5751541.600563185], color: 'red', width: 3 },
    { point1: [1747888.6731165645, 5751541.600563185], point2: [1747892.4134514553, 5751538.054520557], color: 'yellow', width: 1 },
    { point1: [1747892.4134514553, 5751538.054520557], point2: [1747895.9645432115, 5751532.87921764], color: 'blue', width: 7 },
  ];

  // zoom to extent of all points
    useEffect(() => {

        const pointsArray = [
            { point1: [1747885.8567334476, 5751544.571572962], point2: [1747888.6731165645, 5751541.600563185], color: 'red', width: 3 },
            { point1: [1747888.6731165645, 5751541.600563185], point2: [1747892.4134514553, 5751538.054520557], color: 'yellow', width: 1 },
            { point1: [1747892.4134514553, 5751538.054520557], point2: [1747895.9645432115, 5751532.87921764], color: 'blue', width: 7 },
          ];
          
        if (!mapInstance) return;
        const extent = pointsArray.reduce((acc, { point1, point2 }) => {
        acc[0] = Math.min(acc[0], point1[0], point2[0]);
        acc[1] = Math.min(acc[1], point1[1], point2[1]);
        acc[2] = Math.max(acc[2], point1[0], point2[0]);
        acc[3] = Math.max(acc[3], point1[1], point2[1]);
        return acc;
        }, [Infinity, Infinity, -Infinity, -Infinity]);
        mapInstance.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }, [mapInstance, pointsArray]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '500px' }}>
      {mapInstance && pointsArray.map(({ point1, point2, color, width }, index) => (
        <ArrowLineTs key={index} 
            point1={point1} 
            point2={point2} 
            color={color} 
            width={width} 
            angle={30}
            arrowHeadLengthPercentage={0.3}
            map={mapInstance} 
            shouldRemoveLayer={false}
        />
      ))}
    </div>
  );
};

export default Map;
