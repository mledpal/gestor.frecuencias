import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <>
            {/* <Minipaypal /> */}
            {/* Centrado que antes hacía div#app en Radio.css (global, contaminaba
                cualquier página con id="app"); ahora vive en el layout que
                realmente lo necesita. bg-login: imagen declarada en
                tailwind.config.js desde el principio, nunca usada. */}
            <div className="relative w-screen min-h-screen grid place-content-center text-center bg-chasis bg-login bg-cover bg-center">
                <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

                <div className="relative">
                    <Link href="/" className="max-[1280px]:hidden block">
                        {/* <img
                        src="/img/logo.webp"
                        className="w-[150px] h-[150px] text-gray-500 mb-10 max-[1280px]:mt-10 max-[1280px]:w-[75px] max-[1280px]:h-[75px]"
                    /> */}
                        {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                    </Link>
                </div>

                <div className="relative">{children}</div>
            </div>
        </>
    );
}
