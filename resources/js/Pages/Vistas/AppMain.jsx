import { Head } from "@inertiajs/react";
import { UserImage } from "@/Components/Images/UserImage";
import { BurgerMenu } from "@/Components/Menu/BurgerMenu";

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
        if (isSmallScreen) setVista("movil");
    }, []);

    return (
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
                <BurgerMenu />
            </header>

            <main
                className={` ${
                    isSmallScreen
                        ? "h-full w-full overflow-y-auto"
                        : "h-4/5 max-[1280px]:h-[90%]"
                } flex flex-col w-full bg-gradient-to-br bg-blue-900 from-blue-950 top-[175px] `}
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
