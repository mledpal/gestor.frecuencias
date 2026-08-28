import { Head } from "@inertiajs/react";
import { CabeceraLCD } from "@/Components/Radio/CabeceraLCD";

import { AppContext } from "@/Components/AppProvider";
import { useContext, useEffect } from "react";
import { Vistas } from "../Vistas";

export const AppMain = ({ userDB, title, selects, busqueda }) => {
    const {
        isSmallScreen,
        setSelects,
        setUserDB,
        setTitle,
        setBusqueda,
        setVista,
    } = useContext(AppContext);

    useEffect(() => {
        setBusqueda(busqueda);
        setSelects(selects);
        setUserDB(userDB);
        setTitle(title);
    }, [busqueda]);

    useEffect(() => {
        if (isSmallScreen) {
            setVista((prev) => (prev === "main" ? "movil" : prev));
        } else {
            setVista((prev) => (prev === "movil" ? "main" : prev));
        }
    }, [isSmallScreen]);

    return (
        <div
            id="root"
            className="h-screen max-h-screen w-full max-w-full flex flex-col justify-between box-border overflow-hidden font-sans"
        >
            <Head title={title} />
            <CabeceraLCD userDB={userDB} />

            <main
                className={` ${
                    isSmallScreen
                        ? "h-full w-full overflow-y-auto"
                        : "h-4/5 max-[1280px]:h-[90%]"
                } flex flex-col w-full bg-gradient-to-b from-chasis to-chasisbajo top-[175px] `}
            >
                <Vistas />
            </main>

            {!isSmallScreen && (
                <footer className="sticky bottom-0 left-0 flex flex-row w-full h-[4%] justify-between items-center p-10 bg-transparent max-[1280px]:hidden">
                    {/* <h3>Miguel Ledesma Palacios</h3>
                    <h4>Proyecto DAW-D</h4> */}
                </footer>
            )}
        </div>
    );
};
