import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const GpsMap = ({ coordenadas, nombre, handleOpen }) => {
    const loader = new Loader({
        apiKey: "TU_API_KEY",
        version: "weekly",
    });

    useEffect(() => {
        let map;

        const position = {
            lat: parseFloat(coordenadas[0]),
            lng: parseFloat(coordenadas[1]),
        };

        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerView } = await google.maps.importLibrary(
                "marker"
            );

            map = new Map(document.getElementById("map"), {
                center: position,
                zoom: 10,
            });

            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: nombre ?? "Contacto",
            });

            marker.addListener("click", () => {
                map.setZoom(18);
                map.setCenter(marker.getPosition());
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
                <BotonesFormulario actionExit={() => handleOpen()} />
            </div>
        </div>
    );
};
