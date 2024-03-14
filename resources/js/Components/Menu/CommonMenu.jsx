import { AppContext } from "../AppProvider";
import { useContext } from "react";

export const CommonMenu = ({ setVista, setVisible }) => {
    const { isSmallScreen } = useContext(AppContext);

    return (
        <>
            <li
                className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md "
                onClick={() => {
                    setVisible(null);
                    setVista(isSmallScreen ? "movil" : "main");
                }}
            >
                <i className="fa-solid fa-house" />
                Inicio
            </li>

            {/* <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-md ">
                <i className="fa-solid fa-magnifying-glass"></i>
                Buscar
            </li> */}

            <a href="/profile">
                <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 hover:drop-shadow-sm ">
                    <i className="fa-sharp fa-solid fa-user"></i>
                    Mi cuenta
                </li>
            </a>
        </>
    );
};
