import { useContext } from "react";
import { AppContext } from "../AppProvider";

export const Paypal = () => {
    const { isSmallScreen } = useContext(AppContext);

    return (
        <div
            className={`p-4 w-full flex ${
                isSmallScreen ? " flex-col" : "flex-row"
            }  items-center justify-between`}
        >
            <div className="w-full h-1/3 flex items-center justify-center p-4 ">
                <img
                    src="/img/qrcode.png"
                    className={` ${
                        isSmallScreen
                            ? "h-[100px] w-[100px]"
                            : "h-[200px] w-[200px]"
                    } rounded-xl`}
                />
            </div>
            <article className="w-10/12 h-2/3 flex flex-col items-center justify-around font-sans text-center">
                <p className={` ${isSmallScreen ? "text-lg" : "text-xl"} `}>
                    El uso de esta aplicación es totalmente libre
                    <span
                        className={` ${
                            isSmallScreen ? "text-sm" : "text-lg"
                        } text-center p-2 font-thin text-gray-400`}
                    >
                        pero cualquier <strong className="font-bold color-white">donación</strong> será bienvenida
                        para poder mantener los costes del hosting.
                    </span>
                </p>
                <p
                    className={` ${
                        isSmallScreen ? "text-xs" : "text-sm"
                    } text-center p-2 font-thin text-white`}
                >
                    Gracias por usar esta aplicación. 😊
                </p>
            </article>
        </div>
    );
};
