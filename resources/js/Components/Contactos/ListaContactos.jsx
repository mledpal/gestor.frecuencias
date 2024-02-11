import { RotatingLines } from "react-loader-spinner";
import { Contacto } from "./Contacto";

export const ListaContactos = ({ contactos, setDatos }) => {
    return (
        <>
            <div className="h-full w-full flex flex-col items-center p-1">
                {contactos.length > 0 ? (
                    contactos.map((c) => (
                        <Contacto key={c.id} datos={c} setDatos={setDatos} />
                    ))
                ) : (
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
                )}{" "}
            </div>
        </>
    );
};
