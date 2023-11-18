import { BurgerMenu } from "@/Components/Menu/BurgerMenu";
import { MenuLateral } from "@/Components/Menu/MenuLateral";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Inicio({ userDB, title, roles }) {
    const [user, setUser] = useState({});
    const [userRoles, setRoles] = useState([]);
    const [isAdmin, setAdmin] = useState(0);

    useEffect(() => {
        fetch("/api/user")
            .then((response) => response.json())
            .then((data) => setUser(data));
    }, []);

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
            className="left-0 max-w-screen w-full min-h-screen flex flex-col justify-between"
        >
            <Head title={title} />
            <header className="relative flex flex-row items-center justify-between w-full h-[100px] bg-colorbg">
                <img
                    src="/img/logo.webp"
                    className="w-[100px] h-[100px] cursor-pointer"
                />
                <h1 className="font-extralight text-5xl p-2 font-ethno drop-shadow-lg">
                    Gestor de Frecuencias
                </h1>
                <BurgerMenu isAdmin={isAdmin} />
            </header>

            <nav className="relative flex flex-row w-full h-[75px] justify-end items-center bg-colorbg300">
                <h2 className="mr-10">
                    {user.username} | {isAdmin ? "Administrador" : ""}
                </h2>
            </nav>

            <div className=" top-[175px] w-full h-max grow flex flex-row ">
                <MenuLateral isAdmin={isAdmin} />
                <main className="flex flex-col w-full p-[20px] bg-black">
                    <h2>Cuerpo Principal</h2>
                </main>
            </div>

            <footer className="flex flex-row w-full h-[75px]  justify-between items-center p-10  bg-colorbg300">
                <h3>Miguel Ledesma Palacios</h3>
                <h4>Proyecto DAW-D</h4>
            </footer>
        </div>
    );
}
