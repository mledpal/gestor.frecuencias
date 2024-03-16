import { useContext, useState } from "react";
import { AppContext } from "../AppProvider";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const Colores = ({ handleOpenSetColor, setData }) => {
    const { isSmallScreen } = useContext(AppContext);

    const colores = [
        "blue",
        "emerald",
        "fuchsia",
        "gray",
        "green",
        "indigo",
        "orange",
        "pink",
        "purple",
        "red",
        "rose",
        "sky",
        "violet",
        "yellow",
    ];
    const intensidades = [
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
    ];

    const [color, setColor] = useState("blue-100");


    const handlerColor = () => {
        const clrselect = document.getElementById("colores").value+"-"+document.getElementById("intensidades").value;
        setColor(clrselect);
    }

    const clasesMovil = "w-screen ";
    const clasesPC = "w-1/3 min-h-full ";
    const clasesComunes =
        "bg-slate-800 shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),-2px_-2px_10px_rgba(0,0,0,.5)] flex flex-col items-center justify-between  rounded-xl m-auto select-none";

    const claseModal = isSmallScreen ? clasesMovil : clasesPC;

    return (
        <div
            className={`${
                isSmallScreen ? clasesMovil : clasesPC
            } ${clasesComunes}`}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Elija un color
            </header>
            <main
                className="p-4 w-full h-full flex flex-col items-center justify-center gap-2"
                autoFocus="on"
            >
                <div className="w-full flex flex-col text-center">
                    <label htmlFor="colores">Color</label>
                    <select
                        id="colores"
                        className="bg-slate-600 text-gray-200"
                        onChange={(e) => handlerColor(e.target.value)}
                    >
                        {colores.map((color, index) => (
                            <option key={index} value={color}>
                                {color}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full flex flex-col text-center">
                    <label htmlFor="intensidades">Intensidad</label>
                    <select
                        id="intensidades"
                        className="bg-slate-600 text-gray-200"
                        onChange={(e) => handlerColor(e.target.value)}
                    >
                        {intensidades.map((intensidad, index) => (
                            <option key={index} value={intensidad}>
                                {intensidad}
                            </option>
                        ))}
                    </select>
                </div>
                <div
                    id="ejemplo"
                    className={`w-full flex flex-col text-center p-3 bg-${color}`}
                >
                    <p>Color de Ejemplo</p>
                </div>
            </main>
            <footer className="w-full flex flex-row items-center justify-around p-4">
                <BotonesFormulario
                    actionSubmit={() => {
                        setData(
                            "color",
                            document.getElementById("colores").value +
                                "-" +
                                document.getElementById("intensidades").value
                        );
                        handleOpenSetColor(null);
                    }}
                    textSubmit="Aplicar"
                    iconSubmit="fas fa-check"
                    colorSubmit="bg-blue-600"
                    actionExit={() => handleOpenSetColor(null)}
                    textExit="Cancelar"
                    iconExit="fas fa-times"
                    colorExit="bg-red-600"
                />
            </footer>
        </div>
    );
};
