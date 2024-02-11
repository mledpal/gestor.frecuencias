import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="max-h-screen max-w-screen flex flex-col sm:justify-center items-center sm:pt-0 bg-colorbg">
            <div>
                <Link href="/" className="max-[1280px]:hidden block">
                    {/* <img
                        src="/img/logo.webp"
                        className="w-[150px] h-[150px] text-gray-500 mb-10 max-[1280px]:mt-10 max-[1280px]:w-[75px] max-[1280px]:h-[75px]"
                    /> */}
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                </Link>
            </div>

            {children}
        </div>
    );
}
