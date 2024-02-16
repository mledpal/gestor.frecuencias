import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const GpsMap = ({ coordenadas, nombre, handleOpen }) => {
    const loader = new Loader({
        apiKey: "AIzaSyCNa2l2LonBW2U8F19VzBY_98LOWYXrn9U",
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
                zoom: 15,
            });

            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: nombre ?? "Contacto",
            });

            initMap();
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
