import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen min-w-screen w-[100vw] flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-colorbg dark:bg-colorbg300">
            <div>
                <Link href="/">
                    <img
                        src="/img/logo.webp"
                        className="w-[150px] h-[150px] text-gray-500"
                    />
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                </Link>
            </div>

            {children}
        </div>
    );
}
