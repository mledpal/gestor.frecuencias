import { useAdminUsuarios } from "@/hooks/useAdminUsuarios";
import { User } from "./User";
import { RotatingLines } from "react-loader-spinner";
import { useState } from "react";
import Modal from "@/Components/Modal";
import { MapaFrecuencias } from "@/Components/GPSMap/MapaFrecuencias";

export const Users = ({ isSmallScreen, userDB }) => {
    const { usuarios, deleteUser, swapAdmin, getFrecuenciasUsuario } =
        useAdminUsuarios();
    const [vista, setVista] = useState("administradores");
    const [usuarioMapa, setUsuarioMapa] = useState(null);
    const [frecuenciasMapa, setFrecuenciasMapa] = useState([]);
    const [cargandoMapa, setCargandoMapa] = useState(false);

    const abrirMapa = (user) => {
        setUsuarioMapa(user);
        setFrecuenciasMapa([]);
        setCargandoMapa(true);
        getFrecuenciasUsuario(user.id)
            .then((res) => setFrecuenciasMapa(res ?? []))
            .catch((err) => console.error(err))
            .finally(() => setCargandoMapa(false));
    };

    const cerrarMapa = () => {
        setUsuarioMapa(null);
        setFrecuenciasMapa([]);
        setCargandoMapa(false);
    };

    const visibles =
        usuarios?.filter((user) => user.id !== userDB.id && !user.isRoot) ?? [];
    const administradores = visibles.filter((user) => user.isAdmin);
    const normales = visibles.filter((user) => !user.isAdmin);

    const lista = vista === "administradores" ? administradores : normales;

    return (
        <div className="flex flex-col w-full max-w-full h-full items-center justify-stretch overflow-y-scroll">
            <header
                className={`h-[75px] p-6 sticky top-0 z-20 w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-indigo-700`}
            >
                <h2>Administración de usuarios</h2>
            </header>
            <main className="w-full flex bg-gradient-to-br from-indigo-950 to-indigo-800 items-center justify-center">
                <div
                    className={`${
                        isSmallScreen ? "w-full" : "w-3/4"
                    } min-h-screen flex flex-col gap-6 py-4`}
                >
                    <div className="flex flex-row items-center justify-center gap-4 px-4">
                        <button
                            onClick={() => setVista("administradores")}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold duration-200 ${
                                vista === "administradores"
                                    ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(255,255,0,.5)]"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            <i className="fa-solid fa-shield-halved"></i>
                            Administradores ({administradores.length})
                        </button>
                        <button
                            onClick={() => setVista("usuarios")}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold duration-200 ${
                                vista === "usuarios"
                                    ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,.5)]"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            <i className="fa-solid fa-users"></i>
                            Usuarios ({normales.length})
                        </button>
                    </div>

                    {usuarios ? (
                        lista.length > 0 ? (
                            <div className="grid gap-x-4 gap-y-10 p-4 pt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {lista.map((user) => (
                                    <User
                                        key={user.id}
                                        user={user}
                                        isSmallScreen={isSmallScreen}
                                        deleteUser={deleteUser}
                                        swapAdmin={swapAdmin}
                                        onShowMap={abrirMapa}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="p-4 text-center text-sm font-thin text-gray-400 italic">
                                No hay {vista}
                            </p>
                        )
                    ) : (
                        <div className="h-full w-full grid place-items-center p-1">
                            <RotatingLines
                                visible={true}
                                height="96"
                                width="96"
                                color="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                ariaLabel="rotating-lines-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    )}
                </div>
            </main>

            <Modal
                show={!!usuarioMapa}
                maxWidth="full"
                onClose={cerrarMapa}
            >
                <div className="flex flex-col bg-gray-800 text-white w-[95vw] h-[90vh]">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                        <h3 className="font-bold text-lg">
                            Frecuencias de {usuarioMapa?.username}
                        </h3>
                        <i
                            className="fa-solid fa-xmark text-gray-400 hover:text-white cursor-pointer text-xl"
                            onClick={cerrarMapa}
                            title="Cerrar"
                        ></i>
                    </div>
                    <div className="flex-1 w-full p-3 min-h-0">
                        {cargandoMapa ? (
                            <div className="h-full w-full grid place-items-center">
                                <RotatingLines
                                    visible={true}
                                    height="96"
                                    width="96"
                                    color="grey"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    ariaLabel="rotating-lines-loading"
                                />
                            </div>
                        ) : frecuenciasMapa.length > 0 ? (
                            <MapaFrecuencias frecuencias={frecuenciasMapa} />
                        ) : (
                            <div className="h-full w-full grid place-items-center">
                                <p className="text-sm font-thin text-gray-400 italic">
                                    No hay frecuencias con ubicación
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
