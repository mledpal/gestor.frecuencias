import { BurgerMenu } from "@/Components/Menu/BurguerMenu";
import { MenuLateral } from "@/Components/Menu/MenuLateral";

export default function Inicio() {
    return (
        <div
            id="root"
            className="left-0 max-w-screen w-full min-h-screen flex flex-col justify-between"
        >
            <header className="relative flex flex-row items-center justify-between w-full h-[100px] bg-colorbg">
                <img
                    src="/img/logo.webp"
                    className="w-[100px] h-[100px] cursor-pointer"
                />
                <h1 className="font-bold text-2xl p-2">
                    Gestor de Frecuencias
                </h1>
                <BurgerMenu />
            </header>

            <nav className="relative flex flex-row w-full h-[75px] justify-center items-center bg-colorbg300">
                <h2>Menu Navegación</h2>
            </nav>

            <div className=" top-[175px] w-full h-max grow flex flex-row ">
                <MenuLateral />
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
