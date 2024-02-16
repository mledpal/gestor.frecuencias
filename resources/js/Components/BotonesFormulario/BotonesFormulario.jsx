import { Button } from "@material-tailwind/react";

export const BotonesFormulario = ({
    actionSubmit,
    textSubmit,
    colorSubmit,
    actionReset,
    textReset,
    colorReset,
    actionExit,
    textExit,
    colorExit,
    classBtn,
    classText,
}) => {
    const classButtons = ` w-[100px] h-[40px] py-3 px-0 text-white duration-200 ease-in-out hover:bg-yellow-400 hover:text-black hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,.5)] ${classBtn}`;

    return (
        <>
            {actionSubmit ? (
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={actionSubmit}
                    className={`${classButtons} ${
                        colorSubmit ?? "bg-blue-700"
                    }`}
                >
                    <span className={`${classText ?? ""}`}>
                        {textSubmit ? textSubmit : "Enviar"}
                        <i className="ml-2 fa-solid fa-paper-plane"></i>
                    </span>
                </Button>
            ) : (
                ""
            )}

            {actionReset ? (
                <Button
                    variant="text"
                    color="light-green"
                    onClick={actionReset}
                    className={`${classButtons} ${
                        colorReset ?? "bg-green-700"
                    }`}
                >
                    <span className={`${classText ?? ""}`}>
                        {textReset ? textReset : "Reset"}
                        <i className="ml-2 fa-solid fa-trash" />
                    </span>
                </Button>
            ) : (
                ""
            )}

            {actionExit ? (
                <Button
                    variant="text"
                    color="red"
                    onClick={actionExit}
                    className={`${classButtons} ${colorExit ?? "bg-red-700"}`}
                >
                    <span className={`${classText ?? ""}`}>
                        {textExit ? textExit : "Cerrar"}
                        <i className="ml-2 fa-solid fa-door-open"></i>
                    </span>
                </Button>
            ) : (
                ""
            )}
        </>
    );
};
