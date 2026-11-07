"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  GROUNDWATER_RECORDS,
  THARPARKAR_CENTER,
  THARPARKAR_BOUNDS,
  type GroundwaterPotential,
} from "@/data/groundwater-data";
import { useAquaStore, type SelectedLocation } from "@/store/aqua-store";
import { getPotentialColor } from "@/lib/groundwater";

/** Build a custom color-coded div marker for a groundwater record. */
function buildRecordIcon(
  potential: GroundwaterPotential,
  isSelected: boolean,
  label: string,
): L.DivIcon {
  const cls = `potential-${potential.toLowerCase()}${isSelected ? " selected" : ""}`;
  return L.divIcon({
    className: "aquathar-marker",
    html: `<div class="aquathar-pin ${cls}"><span>${label}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

/** Build the user "click" marker (blue pulsing dot). */
function buildClickIcon(): L.DivIcon {
  return L.divIcon({
    className: "aquathar-marker",
    html: `<div class="aquathar-pin selected" style="background:#0ea5e9;"><span>●</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

/** Helper component that flies to the selected coordinate when it changes. */
function FlyTo({ loc }: { loc: SelectedLocation | null }) {
  const map = useMap();
  useEffect(() => {
    if (loc) {
      map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 11), {
        duration: 1.2,
      });
    }
  }, [loc, map]);
  return null;
}

interface TharMapProps {
  /** Called when the user clicks an arbitrary point on the map. */
  onMapClick: (lat: number, lng: number) => void;
  /** Called when the user clicks a surveyed town marker. */
  onRecordSelect: (recordId: string) => void;
}

export default function TharMap({ onMapClick, onRecordSelect }: TharMapProps) {
  const selected = useAquaStore((s) => s.selected);
  const markersLayerRef = useRef<HTMLDivElement | null>(null);

  const clickIcon = useMemo(() => buildClickIcon(), []);

  // Bind a plain click handler via the MapContainer's whenCreated-style hook.
  // react-leaflet v5 doesn't expose `whenCreated`, so we use a child effect.
  return (
    <div ref={markersLayerRef} className="relative h-full w-full">
      <MapContainer
        center={THARPARKAR_CENTER}
        zoom={9}
        minZoom={7}
        maxZoom={16}
        scrollWheelZoom
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Subtle highlight circle marking the broader Tharparkar focus area */}
        <Circle
          center={THARPARKAR_CENTER}
          radius={55000}
          pathOptions={{
            color: "#0ea5e9",
            weight: 1,
            fillColor: "#0ea5e9",
            fillOpacity: 0.04,
          }}
        />

        {GROUNDWATER_RECORDS.map((r) => {
          const isSelected =
            selected?.recordId === r.id || selected?.label === r.name;
          return (
            <Marker
              key={r.id}
              position={[r.lat, r.lng]}
              icon={buildRecordIcon(r.potential, isSelected, r.name.charAt(0))}
              eventHandlers={{
                click: () => onRecordSelect(r.id),
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {r.name}
                  </p>
                  <p className="text-[11px] text-slate-600">{r.region}</p>
                  <p className="text-[11px] text-slate-700">
                    <span
                      className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
                      style={{ backgroundColor: getPotentialColor(r.potential) }}
                    />
                    Potential: <strong>{r.potential}</strong>
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Est. depth: <strong>{r.depthMin}–{r.depthMax} m</strong>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Confidence: {r.confidence} · Click to view analysis
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User-clicked location marker */}
        {selected && (
          <Marker position={[selected.lat, selected.lng]} icon={clickIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Selected point
                </p>
                <p className="text-[11px] text-slate-700">
                  Lat {selected.lat.toFixed(4)}, Lng {selected.lng.toFixed(4)}
                </p>
                {selected.label ? (
                  <p className="text-[11px] text-slate-600">
                    {selected.label}
                  </p>
                ) : null}
              </div>
            </Popup>
          </Marker>
        )}

        <FlyTo loc={selected} />
        <ClickCatcher onMapClick={onMapClick} />
        <FitBounds />
      </MapContainer>
    </div>
  );
}

/** Invisible overlay capturing map clicks. */
function ClickCatcher({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onMapClick]);
  return null;
}

/** Fit the map to Tharparkar bounds on first load. */
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(THARPARKAR_BOUNDS, { padding: [20, 20] });
  }, [map]);
  return null;
}
