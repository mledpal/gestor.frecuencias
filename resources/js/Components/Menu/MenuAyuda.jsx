import { Dialog } from "@material-tailwind/react";
import { useState } from "react";
import { About } from "../About/About";
import { Ayuda } from "../Ayuda/Ayuda";

export const MenuAyuda = () => {
    const [size, setSize] = useState(null);
    const handleOpenAbout = (value) => setSize(value);

    const [sizeHelp, setSizeHelp] = useState(null);
    const handleOpenHelp = (value) => setSizeHelp(value);

    return (
        <>
            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                onClick={() => handleOpenAbout("xxl")}
            >
                <i className="fa-solid fa-info"></i>
                Acerca de
            </li>

            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                onClick={() => handleOpenHelp("xxl")}
            >
                <i className="fa-solid fa-question"></i>
                Ayuda
            </li>

            <hr className="my-2" />

            <a href={route("index.logout")}>
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Desconectar
                </li>
            </a>

            <Dialog
                open={
                    size === "xs" ||
                    size === "sm" ||
                    size === "md" ||
                    size === "lg" ||
                    size === "xl" ||
                    size === "xxl"
                }
                size={size || "md"}
                handler={handleOpenAbout}
                className="w-screen h-screen bg-transparent backdrop-blur-sm shadow-transparent flex flex-col m-auto  items-center justify-center overflow-y-auto"
            >
                <About handleOpenAbout={handleOpenAbout} />
            </Dialog>

            <Dialog
                open={
                    sizeHelp === "xs" ||
                    sizeHelp === "sm" ||
                    sizeHelp === "md" ||
                    sizeHelp === "lg" ||
                    sizeHelp === "xl" ||
                    sizeHelp === "xxl"
                }
                size={sizeHelp || "md"}
                handler={handleOpenHelp}
                className="w-screen h-screen bg-transparent shadow-transparent flex flex-col m-auto  items-center justify-center overflow-y-auto"
            >
                <Ayuda handleOpenHelp={handleOpenHelp} />
            </Dialog>
        </>
    );
};

//
