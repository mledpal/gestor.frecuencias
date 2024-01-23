import { UserImage } from "@/Components/Images/UserImage";
import { BurgerMenu } from "@/Components/Menu/BurgerMenu";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { MainPage } from "./Zonas/MainPage";


export default function Inicio({ userDB, title, roles, selects }) {
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
            className="h-screen max-h-screen w-screen flex flex-col justify-between box-border overflow-hidden font-sans"
        >
            <Head title={title} />
            <header className="relative flex flex-row items-center justify-between w-full h-[10%] bg-colorbg">
                <img
                    src="/img/logo.webp"
                    className="w-[100px] h-[100px] cursor-pointer"
                />
                <UserImage isAdmin={isAdmin} userDB={userDB} />
                <BurgerMenu isAdmin={isAdmin} />
            </header>

            <main className="flex flex-col w-full  bg-gradient-to-br bg-blue-900 from-blue-950 top-[175px]  h-4/5">
                <MainPage selects={selects} />
            </main>

            <footer className="flex flex-row w-full h-[5%] justify-between items-center p-10  bg-transparent">
                <h3>Miguel Ledesma Palacios</h3>
                <h4>Proyecto DAW-D</h4>
            </footer>
        </div>
    );
}
