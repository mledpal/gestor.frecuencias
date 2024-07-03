export const Minipaypal = () => {
    return (
        <div className="h-full flex flex-row items-center justify-start">
            <div className="h-full flex flex-col items-center justify-center border-2">
                <img
                    src="/img/qrcode.png"
                    className={`h-[40%] aspect-square rounded-xl my-auto`}
                />
            </div>
            <article className="h-full flex flex-col items-start justify-start font-sans text-left border-2">
                <p className="text-lg leading-3">
                    El uso de esta aplicación es totalmente libre
                    <span
                        className={`text-sm text-center p-2 font-thin text-gray-200`}
                    >
                        pero cualquier{" "}
                        <a href="https://paypal.me/migueldj80?country.x=ES&locale.x=es_ES">
                        <strong className="font-bold color-white">
                            donación
                        </strong>{" "}</a>
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
