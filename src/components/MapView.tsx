import { useEffect } from 'react';
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ScoredZone } from '../data';
import { assets, riskColor, riskTint } from '../data';

const pilotCenter: [number, number] = [13.421, 80.132];

function AssetIcon({ type }: { type: string }) {
  const short = type === 'Underpass' ? 'UP' : type.slice(0, 2).toUpperCase();
  return L.divIcon({
    className: 'asset-marker-wrapper',
    html: `<div class="asset-marker asset-${type.toLowerCase()}"><span>${short}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapFocus({ selectedZone }: { selectedZone?: ScoredZone }) {
  const map = useMap();
  useEffect(() => {
    if (selectedZone) map.flyTo(selectedZone.center, 15.8, { duration: 0.65 });
  }, [map, selectedZone]);
  return null;
}

export function MapView({
  scoredZones,
  selectedId,
  onSelect,
}: {
  scoredZones: ScoredZone[];
  selectedId?: string;
  onSelect: (zone: ScoredZone) => void;
}) {
  const selectedZone = scoredZones.find((zone) => zone.zone_id === selectedId);
  return (
    <MapContainer className="flood-map" center={pilotCenter} zoom={14.5} minZoom={13.5} maxZoom={17} scrollWheelZoom>
      <TileLayer
        attribution='Tiles &copy; Esri · Source: Esri, OpenStreetMap contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapFocus selectedZone={selectedZone} />
      {scoredZones.map((zone) => {
        const color = riskColor(zone.riskLevel);
        const isSelected = zone.zone_id === selectedId;
        return (
          <Polygon
            key={zone.zone_id}
            positions={zone.polygon}
            pathOptions={{
              color: isSelected ? '#071a2c' : color,
              weight: isSelected ? 4 : 2,
              fillColor: color,
              fillOpacity: isSelected ? 0.72 : 0.52,
              dashArray: isSelected ? undefined : '4 3',
            }}
            eventHandlers={{ click: () => onSelect(zone) }}
          >
            <Popup className="zone-popup">
              <div className="popup-kicker">{zone.zone_id} · DEMO ESTIMATE</div>
              <h3>{zone.zone_name}</h3>
              <div className="popup-risk-row">
                <span className="risk-pill" style={{ background: riskTint(zone.riskLevel), color }}>{zone.riskLevel}</span>
                <strong>{zone.riskScore}<small>/100 risk</small></strong>
              </div>
              <div className="popup-grid">
                <span>Onset</span><strong>{zone.onset}</strong>
                <span>Confidence</span><strong>{zone.confidence}</strong>
                <span>Road / landmark</span><strong>{zone.road}</strong>
              </div>
              <div className="popup-drivers">
                {zone.drivers.slice(0, 3).map((driver) => <span key={driver}>{driver}</span>)}
              </div>
              <button className="popup-action" onClick={() => onSelect(zone)}>Open action recommendation</button>
            </Popup>
          </Polygon>
        );
      })}
      {assets.map((asset) => (
        <Marker key={asset.id} position={asset.position} icon={AssetIcon({ type: asset.type })}>
          <Popup>
            <div className="asset-popup"><span className="asset-popup-type">{asset.type}</span><strong>{asset.name}</strong><span>Visible critical asset marker</span></div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
