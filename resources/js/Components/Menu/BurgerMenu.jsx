import { useContext, useEffect, useRef, useState } from "react";
import { CommonMenu, UserMenu } from ".";
import { AdminMenu } from "./AdminMenu";
import { MenuAyuda } from "./MenuAyuda";
import { AppContext } from "../AppProvider";

export const BurgerMenu = () => {
    const { isAdmin, setVista } = useContext(AppContext);

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
            <i
                className={`fa-solid fa-bars fa-2xl cursor-pointer duration-150 ease-linear ${
                    visible ? "text-black" : ""
                }`}
                onClick={() => setVisible((prev) => !prev)}
            ></i>

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
