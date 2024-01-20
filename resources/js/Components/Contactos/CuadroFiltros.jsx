import { Switch } from "../Switch";

export const CuadroFiltros = ({ filtros, handleCheck }) => {
    const classFiltro = "p-2 w-full flex flex-row items-center justify-between";

    return (
        <div
            id="cuadroFiltros"
            className="absolute scale-75 left-0 top-0 mt-[-40px] ml-[45px] bg-blue-950 flex-col w-[260px] rounded-lg
            shadow-[5px_5px_10px_rgba(0,0,0,.8),inset_3px_3px_8px_rgba(255,255,255,.5)] items-center justify-between p-2"
        >
            {[
                { label: "Comprobados", key: "comprobado" },
                { label: "Desconocidos", key: "nocomprobado" },
                { label: "Públicos", key: "publico" },
                { label: "Privados", key: "privado" },
                { label: "Aviación", key: "aviacion" },
                { label: "Emisoras", key: "emisora" },
                { label: "Empresas", key: "empresa" },
                { label: "Eventos", key: "evento" },
                { label: "Particulares", key: "particular" },
                { label: "Servicios", key: "servicio" },

            ].map(({ label, key }) => (
                <div className={classFiltro} key={key}>
                    <span className="w-full text-right">{label}</span>
                    <span className="w-full flex items-start">
                        <Switch
                            name={key}
                            handleCheck={() => handleCheck(key)}
                            checked={filtros[key]}
                        />
                    </span>
                </div>
            ))}
        </div>
    );
};
