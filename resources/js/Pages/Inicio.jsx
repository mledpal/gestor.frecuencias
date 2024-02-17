import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import { useMediaQuery } from "@react-hook/media-query";

import { UserImage } from "@/Components/Images/UserImage";
import { BurgerMenu } from "@/Components/Menu/BurgerMenu";
import { Vistas } from "./Vistas";
import { AppProvider } from "../Components/AppProvider/AppProvider";

export default function Inicio({ userDB, title, selects, busqueda }) {
    const [vista, setVista] = useState("main");
    const isSmallScreen = useMediaQuery("(max-width: 900px)");
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (isSmallScreen) setVista("movil");
    }, []);

    useEffect(() => {
        setAdmin(userDB.roles.some((rol) => rol.nombre === "admin"));
    }, []);

    return (
        <AppProvider value={{ userDB, selects, busqueda }}>
            <div
                id="root"
                className="h-screen max-h-screen w-screen flex flex-col justify-between box-border overflow-hidden font-sans"
            >
                <Head title={title} />
                <header className="px-3 relative flex flex-row items-center justify-between py-2 w-full h-[10%] bg-colorbg max-[1280px]:h-[10%]">
                    {!isSmallScreen ? (
                        <img
                            src="/img/logo.webp"
                            className="w-[100px] h-[100px] cursor-pointer max-[1280px]:w-[50px] max-[1280px]:h-[50px]"
                        />
                    ) : (
                        ""
                    )}
                    <UserImage userDB={userDB} link="/profile" />
                    <BurgerMenu
                        isAdmin={isAdmin}
                        setVista={setVista}
                        isSmallScreen={isSmallScreen}
                    />
                </header>

                <main
                    className={` ${
                        isSmallScreen
                            ? "h-full w-full overflow-y-auto"
                            : "h-4/5 max-[1280px]:h-[90%]"
                    } flex flex-col w-full bg-gradient-to-br bg-blue-900 from-blue-950 top-[175px] `}
                >
                    <Vistas
                        vista={vista}
                        setVista={setVista}
                        selects={selects}
                        isAdmin={isAdmin}
                        busqueda={busqueda}
                        userDB={userDB}
                    />
                </main>

                {!isSmallScreen && (
                    <footer className="flex flex-row w-full h-[4%] justify-between items-center p-10 bg-transparent max-[1280px]:hidden">
                        <h3>Miguel Ledesma Palacios</h3>
                        <h4>Proyecto DAW-D</h4>
                    </footer>
                )}
            </div>
        </AppProvider>
    );
}
