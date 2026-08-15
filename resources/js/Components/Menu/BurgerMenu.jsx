import { useContext, useEffect, useRef, useState } from "react";
import { CommonMenu, UserMenu } from ".";
import { AdminMenu } from "./AdminMenu";
import { MenuAyuda } from "./MenuAyuda";
import { AppContext } from "../AppProvider";
import { useTeclaFisica } from "@/hooks/useTeclaFisica";

export const BurgerMenu = () => {
    const { isAdmin, setVista } = useContext(AppContext);
    const tecla = useTeclaFisica();

    const [visible, setVisible] = useState(false);
    const contenedorRef = useRef(null);

    // Cerrar el menú al hacer clic fuera. La visibilidad la controla solo el
    // estado de React (sin trucos de :hover en CSS, que fallaban en producción).
    useEffect(() => {
        if (!visible) return;

        const handleClickFuera = (event) => {
            if (
                contenedorRef.current &&
                !contenedorRef.current.contains(event.target)
            ) {
                setVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickFuera);
        return () =>
            document.removeEventListener("mousedown", handleClickFuera);
    }, [visible]);

    return (
        <div className="relative select-none" ref={contenedorRef}>
            <button
                type="button"
                className={`tecla w-10 h-10 rounded-md flex items-center justify-center text-rotulo duration-150 ease-linear ${
                    visible ? "text-lcd" : ""
                }`}
                onClick={() => setVisible((prev) => !prev)}
                {...tecla}
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            {visible && (
                <ul className="mt-1 right-0 absolute w-[250px] rounded-lg p-5 z-50 text-sm bg-blue-800 flex flex-col drop-shadow-lg">
                    <CommonMenu setVista={setVista} setVisible={setVisible} />
                    <hr className="my-2" />
                    <UserMenu setVista={setVista} setVisible={setVisible} />
                    {isAdmin ? (
                        <>
                            <hr className="my-2" />
                            <AdminMenu
                                setVista={setVista}
                                setVisible={setVisible}
                            />
                            <hr className="my-2" />
                        </>
                    ) : (
                        <hr className="my-2" />
                    )}

                    <MenuAyuda />
                </ul>
            )}
        </div>
    );
};
