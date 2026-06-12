import React, { useEffect, useRef } from "react";
import { googleMapsLoader } from "../../Helpers/googleMapsLoader";

export const MapaFrecuencias = ({ frecuencias = [] }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const puntos = frecuencias
            .map((contacto) => {
                const [lat, lng] = (contacto.localizacion?.gps ?? "").split(",");

                return {
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                    frecuencia: contacto.frecuencia?.frecuencia,
                    nombre: contacto.nombre,
                    localidad: contacto.localizacion?.localidad,
                    provincia: contacto.localizacion?.provincia,
                };
            })
            .filter((punto) => !isNaN(punto.lat) && !isNaN(punto.lng));

        let map;

        googleMapsLoader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps");

            const centroPorDefecto = { lat: 40.4168, lng: -3.7038 }; // España

            map = new Map(mapRef.current, {
                center: puntos[0]
                    ? { lat: puntos[0].lat, lng: puntos[0].lng }
                    : centroPorDefecto,
                zoom: puntos.length ? 10 : 6,
            });

            const infoWindow = new google.maps.InfoWindow();
            const bounds = new google.maps.LatLngBounds();

            puntos.forEach((punto) => {
                const position = { lat: punto.lat, lng: punto.lng };

                const marker = new google.maps.Marker({
                    position,
                    map,
                    title: punto.frecuencia ?? punto.nombre ?? "Contacto",
                });

                marker.addListener("click", () => {
                    const ubicacion = [punto.localidad, punto.provincia]
                        .filter(Boolean)
                        .join(", ");

                    infoWindow.setContent(`
                        <div style="color:#1f2937; font-size:13px; line-height:1.4;">
                            ${
                                punto.frecuencia
                                    ? `<strong>${punto.frecuencia}</strong><br/>`
                                    : ""
                            }
                            ${punto.nombre ? `${punto.nombre}<br/>` : ""}
                            ${ubicacion ? `<span>${ubicacion}</span>` : ""}
                        </div>
                    `);
                    infoWindow.open({ anchor: marker, map });
                });

                bounds.extend(position);
            });

            if (puntos.length > 1) {
                map.fitBounds(bounds);
            }
        });
    }, [frecuencias]);

    return (
        <div
            ref={mapRef}
            className="bg-slate-800 w-full h-full rounded-xl border-[5px] border-slate-700"
        ></div>
    );
};
