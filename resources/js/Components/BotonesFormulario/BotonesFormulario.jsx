/**
 * Componente que renderiza botones para formularios
 */


import { Button } from "@material-tailwind/react";
import { AppContext } from "../AppProvider";
import { useContext } from "react";


export const BotonesFormulario = ({
    actionApply,
    colorApply,
    textApply,
    iconApply,
    actionSubmit,
    textSubmit,
    colorSubmit,
    iconSubmit,
    actionReset,
    textReset,
    colorReset,
    iconReset,
    actionExit,
    iconExit,
    textExit,
    colorExit,
    classBtn,
    classText,
}) => {
    const { isSmallScreen } = useContext(AppContext);

    const classButtons = ` ${
        isSmallScreen ? "scale-75" : "scale-100"
    } w-[100px] h-[40px] py-3 px-0 text-white duration-200 ease-in-out hover:bg-yellow-400 hover:text-black hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,.5)] ${classBtn}`;

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
                        <i
                            className={`ml-2 fa-solid ${
                                iconSubmit ? iconSubmit : "fa-paper-plane"
                            }`}
                        ></i>
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
                        <i
                            className={`ml-2 fa-solid ${
                                iconReset ? iconReset : "fa-trash"
                            }`}
                        />
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
                        <i
                            className={`ml-2 fa-solid ${
                                iconExit ? iconExit : "fa-door-open"
                            }`}
                        ></i>
                    </span>
                </Button>
            ) : (
                ""
            )}

            {actionApply ? (
                <Button
                    variant="text"
                    color="blue"
                    onClick={actionApply}
                    className={`${classButtons} ${
                        colorApply ?? "bg-indigo-600"
                    }`}
                >
                    <span className={`${classText ?? ""}`}>
                        {textApply ? textApply : "Aplicar"}
                        <i
                            className={`ml-2 fa-solid ${
                                iconApply ? iconApply : "fa-check"
                            }`}
                        ></i>
                    </span>
                </Button>
            ) : (
                ""
            )}
        </>
    );
};
