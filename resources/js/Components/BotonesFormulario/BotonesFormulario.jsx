import { Button } from "@material-tailwind/react";

export const BotonesFormulario = ({
    actionSubmit,
    actionReset,
    actionExit,
}) => {
    const classButtons =
        "py-3 px-6 text-white duration-200 ease-in-out hover:bg-yellow-400 hover:text-black hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,.5)]";

    return (
        <>
            {actionSubmit ? (
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={actionSubmit}
                    className={`${classButtons} bg-blue-700`}
                >
                    <span>
                        Enviar <i className="fa-solid fa-paper-plane"></i>
                    </span>
                </Button>
            ) : (
                <div></div>
            )}

            {actionReset ? (
                <Button
                    variant="text"
                    color="light-green"
                    onClick={actionReset}
                    className={`${classButtons} bg-green-700`}
                >
                    <span>
                        Limpiar <i className="fa-solid fa-trash" />
                    </span>
                </Button>
            ) : (
                <div></div>
            )}

            {actionExit ? (
                <Button
                    variant="text"
                    color="red"
                    onClick={actionExit}
                    className={`${classButtons} bg-red-700`}
                >
                    <span>
                        Cerrar <i className="fa-solid fa-door-open"></i>
                    </span>
                </Button>
            ) : (
                <div></div>
            )}
        </>
    );
};
