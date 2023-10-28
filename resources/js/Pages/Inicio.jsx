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
                <i className="fa-solid fa-bars fa-2xl mr-10 cursor-pointer"></i>
            </header>

            <nav className="relative flex flex-row w-full h-[75px] justify-center items-center bg-colorbg300">
                <h2>Menu Navegación</h2>
            </nav>

            <div className=" top-[175px] w-full h-max grow flex flex-row ">
                <aside className="w-[250px] p-[20px] text-xl font-light">
                    <ul className="h-full flex flex-col justify-between items-start">
                        <div id="options" className="w-full">
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i className="fa-solid fa-house" />
                                Inicio
                            </li>
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                Buscar
                            </li>

                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i className="fa-solid fa-walkie-talkie"></i>
                                Frecuencias
                            </li>
                        </div>

                        <div id="user" className="w-full">
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i class="fa-sharp fa-solid fa-right-to-bracket"></i>
                                Conectar
                            </li>
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i className="fa-sharp fa-solid fa-user"></i>
                                Mi cuenta
                            </li>
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i className="fa-solid fa-address-book"></i>
                                Contactos
                            </li>
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i className="fa-solid fa-gear"></i>
                                Configuración
                            </li>
                            <li className="p-2 w-full flex flex-row items-center justify-between cursor-pointer rounded-xl hover:bg-colorbg300 duration-300 ">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                Desconectar
                            </li>
                        </div>
                    </ul>
                </aside>
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
