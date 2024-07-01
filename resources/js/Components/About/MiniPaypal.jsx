export const Minipaypal = () => {
    return (
        <div className="absolute w-1/3 top-0 right-0 flex flex-row p-3">
            <div className="w-1/3 flex flex-row items-center justify-center">
                <img
                    src="/img/qrcode.png"
                    className={`w-[100px] h-[100px] rounded-xl`}
                />
            </div>
            <article className="w-2/3 flex flex-col items-start justify-start font-sans text-left">
                <p className={` text-lg `}>
                    El uso de esta aplicación es totalmente libre
                    <span
                        className={`text-sm text-center p-2 font-thin text-gray-200`}
                    >
                        pero cualquier{" "}
                        <strong className="font-bold color-white">
                            donación
                        </strong>{" "}
                        será bienvenida para poder mantener los costes del
                        hosting.
                    </span>
                </p>
                <p className={`text-sm text-left p-2 font-thin text-white`}>
                    Gracias por usar esta aplicación. 😊
                </p>
            </article>
        </div>
    );
};
