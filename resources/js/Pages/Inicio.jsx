import { UserImage } from "@/Components/Images/UserImage";
import { BurgerMenu } from "@/Components/Menu/BurgerMenu";
import { MenuLateral } from "@/Components/Menu/MenuLateral";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { MainPage } from "./Zonas/MainPage";

export default function Inicio({ userDB, title, roles, contactos }) {
    const [userRoles, setRoles] = useState([]);
    const [isAdmin, setAdmin] = useState(0);

    const styleUserImg = isAdmin
        ? "w-10 h-10 rounded-full mr-10 border-white border-2"
        : "w-10 h-10 rounded-full mr-10";

    useEffect(() => {
        const userRolesArray = [];
        roles.forEach((r) => {
            userRolesArray.push(r.nombre);
            r.nombre === "admin" ? setAdmin(1) : "";
        });
        setRoles(userRolesArray);
    }, []);

    return (
        <div
            id="root"
            className="max-[100vw] w-[100%] min-h-screen max-h-screen flex flex-col justify-between box-border"
        >
            <Head title={title} />
            <header className="relative flex flex-row items-center justify-between w-full h-[100px] bg-colorbg">
                <img
                    src="/img/logo.webp"
                    className="w-[100px] h-[100px] cursor-pointer"
                />
                <UserImage isAdmin={isAdmin} userDB={userDB} />
                <BurgerMenu isAdmin={isAdmin} />
            </header>


            {/* <MenuLateral isAdmin={isAdmin} /> */}
            <main className="flex flex-col w-[100%] min-h-max p-[20px] bg-black top-[175px] grow">
                <MainPage contactos={contactos} />
            </main>


            <footer className="flex flex-row w-full h-[75px] justify-between items-center p-10  bg-colorbg300">
                <h3>Miguel Ledesma Palacios</h3>
                <h4>Proyecto DAW-D</h4>
            </footer>
        </div>
    );
}
