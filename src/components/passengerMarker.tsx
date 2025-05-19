import L from "leaflet"
import { Marker } from "react-leaflet"
import bluemarket from "../assets/Pointer_Azul.png";

const icon = new L.Icon({
    iconUrl: bluemarket,
    iconRetinaUrl: bluemarket,
    iconSize: [50, 50],
    iconAnchor: [15, 35],
    popupAnchor: [0, -35]
});

type MarkerProps = {
    position: { lat: number; lng: number };
};

export function PassengerMarker({ position }: MarkerProps) {
    return (
        <Marker position={position} icon={icon} />
    );
}