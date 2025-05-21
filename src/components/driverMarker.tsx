import L from "leaflet"
import { Marker } from "react-leaflet"
import redmarket from "../assets/Pointer_Rojo.png";

const icon = new L.Icon({
    iconUrl: redmarket,
    iconRetinaUrl: redmarket,
    iconSize: [50, 50],
    iconAnchor: [15, 35],
    popupAnchor: [0, -35]
});

type MarkerProps = {
    position: { lat: number; lng: number };
};

export function DriverMarker({ position }: MarkerProps) {
    return (
        <Marker position={position} icon={icon} />
    );
}