import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const GPSSearch = ({
    coordenadas,
    nombre,
    setSizeGPSModal,
    setData,
}) => {
    if (coordenadas === undefined) {
        coordenadas = [];
    }
    const [nuevasCoordenadas, setNuevasCoordenadas] = useState(coordenadas);

    const loader = new Loader({
        apiKey: "AIzaSyCNa2l2LonBW2U8F19VzBY_98LOWYXrn9U",
        version: "weekly",
    });

    useEffect(() => {
        let map;

        let position = {};

        if (coordenadas[0] !== undefined && coordenadas[1] !== undefined) {
            position = {
                lat: parseFloat(coordenadas[0]),
                lng: parseFloat(coordenadas[1]),
            };
        } else {
            position = {
                lat: 38.095929,
                lng: -3.634245,
            };
        }

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

            marker.addListener("click", (e) => {
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                setNuevasCoordenadas(
                    e.latLng.toJSON().lat.toFixed(6) +
                        "," +
                        e.latLng.toJSON().lng.toFixed(6)
                );
            });

            map.addListener("click", (e) => {
                marker.setPosition(e.latLng);
                setNuevasCoordenadas(
                    e.latLng.toJSON().lat.toFixed(6) +
                        "," +
                        e.latLng.toJSON().lng.toFixed(6)
                );
            });
        });
    }, []);

    return (
        <div className="z-1000 relative container bg-slate-700 m-auto h-screen">
            <div
                id="map"
                className="bg-slate-800 w-full h-full rounded-xl border-[5px] border-slate-700"
            ></div>
            <div className="absolute bottom-2 left-2 z-10 w-full flex flex-row gap-4 justify-start items-center">
                <BotonesFormulario
                    actionApply={() => {
                        setData("gps", nuevasCoordenadas);
                        setSizeGPSModal();
                    }}
                    actionExit={() => setSizeGPSModal()}
                />
            </div>
        </div>
    );
};
