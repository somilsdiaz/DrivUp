import L from "leaflet"
import { Marker } from "react-leaflet"
import greenmarket from "../assets/Pointer_Verde.png";

const icon = new L.Icon({
    iconUrl: greenmarket,
    iconRetinaUrl: greenmarket,
   iconSize: [50, 50],
    iconAnchor: [15, 35],
    popupAnchor: [0, -35]
});

type MarkerProps = {
    position: { lat: number; lng: number };
};

export function DestinyMarker({ position }: MarkerProps) {
    return (
        <Marker position={position} icon={icon} />
    );
}