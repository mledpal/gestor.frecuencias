import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const GPSSearch = ({
    coordenadas,
    nombre,
    setSizeGPSModal,
    setData,
}) => {
    const loader = new Loader({
        apiKey: "AIzaSyCNa2l2LonBW2U8F19VzBY_98LOWYXrn9U",
        version: "weekly",
    });

    useEffect(() => {
        let map;

        const position = {
            lat: parseFloat(coordenadas[0]) ?? 30,
            lng: parseFloat(coordenadas[1]) ?? -30,
        };

        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement, PinElement } =
                await google.maps.importLibrary("marker");

            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 8,
                center: position,
                mapId: "Localizacion_MAP",
            });

            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: nombre ?? "Contacto",
            });

            map.addListener("click", (e) => {
                marker.setPosition(e.latLng);
                setData(
                    "gps",
                    e.latLng.toJSON().lat.toFixed(5) +
                        "," +
                        e.latLng.toJSON().lng.toFixed(5)
                );
            });

        });
    }, []);

    return (
        <div className="relative container bg-slate-700 m-auto h-screen">
            <div
                id="map"
                className="bg-slate-800 w-full h-full rounded-xl border-[5px] border-slate-700"
            ></div>
            <div className="absolute bottom-2 left-2 z-10">
                <BotonesFormulario actionExit={() => setSizeGPSModal()} />
            </div>
        </div>
    );
};
