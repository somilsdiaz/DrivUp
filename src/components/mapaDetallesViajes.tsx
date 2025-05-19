import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DriverMarker } from './driverMarker';
import { PassengerMarker } from './passengerMarker';
import { DestinyMarker } from './destinyMarker';




export function MapaDetallesViajes() {
  const position:LatLngExpression = [11.008879308510416, -74.82384826225098];
  const positionmarker: { lat: number, lng: number } = { lat: 11.008879308510416, lng: -74.82384826225098 };

  const positionsList: { lat: number, lng: number }[] = [
    { lat: 11.009, lng: -74.824 },
    { lat: 11.0085, lng: -74.8235 }
  ];

  const positionsList2: { lat: number, lng: number }[] = [
    { lat: 11.109, lng: -74.910 },
    { lat: 20.0185, lng: -75.8235 }
  ];

 
  return (
    <div className='w-full sm:w-9/12 z-0'>
      <MapContainer center={position} zoomControl={false} zoom={17} style={{ height: "100vh", width: "100%", maxHeight: "100vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <DriverMarker position={positionmarker} />
        {positionsList?.map((position, index) => (
          <PassengerMarker key={index} position={position} />
        ))}

        {positionsList2.map((position, index) => (
          <DestinyMarker key={index} position={position} />
        ))}
      </MapContainer>
    </div>
  );
}
 