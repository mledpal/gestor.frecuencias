import { useContext } from "react";
import { BotonesFormulario } from "../BotonesFormulario/BotonesFormulario";
import { AppContext } from "../AppProvider";

export const Ayuda = ({ handleOpenHelp }) => {

    const { isSmallScreen } = useContext(AppContext);

    const clasesMovil = "w-screen h-screen ";
    const clasesPC = "w-2/3 min-h-full ";
    const clasesComunes = "bg-slate-800 shadow-[inset_-2px_2px_10px_rgba(255,255,255,.5),-2px_-2px_10px_rgba(0,0,0,.5)] flex flex-col items-center justify-between  rounded-xl m-auto select-none"

    const clasesAyuda = isSmallScreen ? clasesMovil : clasesPC;


    return (
        <div
            className={ clasesAyuda + clasesComunes }
            onClick={() => handleOpenHelp(null)}
        >
            <header className="h-15 w-full flex items-center justify-center bg-gradient-to-tl from-blue-900 bg-slate-800 rounded-tr-xl rounded-tl-xl p-5 font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)]">
                Manual de usuario
            </header>
            <main className="p-4 w-full h-full flex flex-row items-center justify-center"></main>
            <footer className="w-full p-5 flex items-center justify-around h-15 bg-gradient-to-br from-blue-900 bg-slate-800 rounded-br-xl rounded-bl-xl font-bold text-xl shadow-[inset_2px_0_5px_rgba(255,255,255,.5),inset_-2px_0_5px_rgba(0,0,0,.5)] ">
                <BotonesFormulario actionExit={() => handleOpenHelp(null)} />
            </footer>
        </div>
    );
};
