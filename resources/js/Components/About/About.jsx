/**
 * Componente que muestra información sobre el autor y el proyecto.
 */

import { useContext } from "react";
import { AppContext } from "../AppProvider";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";

export const About = ({ handleOpenAbout }) => {

    const { isSmallScreen } = useContext(AppContext);

    const clasesMovil = "w-screen h-screen ";
    const clasesPC = "w-[800px] h-4/5 ";
    const clasesComunes = "bg-slate-800 shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),-2px_-2px_10px_rgba(0,0,0,.5)] flex flex-col items-center justify-between  rounded-xl m-auto select-none"

    const clasesAbout = isSmallScreen ? clasesMovil : clasesPC;

    return (
        <div
            className = { clasesAbout + clasesComunes }
            onClick={() => handleOpenAbout(null)}
        >
            <header className="h-2/12 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Acerca de
            </header>
            <main className={`p-4 w-full h-8/12 flex ${isSmallScreen ? " flex-col" : "flex-row"}  items-center justify-center`}>
                <div className="w-full h-1/3 flex items-center justify-center p-4 ">
                    <img
                        src="img/miguel.webp"
                        className={` ${isSmallScreen ? 'h-[100px] w-[100px]' : 'h-[200px] w-[200px]' } rounded-full`}
                    />
                </div>
                <article className="w-10/12 h-2/3 flex flex-col items-center justify-around font-sans">
                    <p className={` ${isSmallScreen ? 'text-lg' : 'text-xl'} font-bold`}>
                        Miguel Ledesma Palacios
                    </p>
                    <p className={` ${isSmallScreen ? 'text-sm' : 'text-lg'} text-center p-2 font-thin text-gray-400`}>
                        Gestión de frecuencias de radioaficionados
                    </p>
                    <p className={` ${isSmallScreen ? 'text-xs' : 'text-sm'} text-center p-2 font-thin text-white`}>Proyecto para DAW-D</p>
                    <p className="">I.E.S. Trassierra (Córdoba)</p>
                </article>
            </main>
            <footer className="w-full h-2/12 p-5 flex items-center justify-around  bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] ">
                <BotonesFormulario actionExit={() => handleOpenAbout(null)} />
            </footer>
        </div>
    );
};
