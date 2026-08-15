import PrimaryButton from "../PrimaryButton";
import { Link, useForm } from "@inertiajs/react";

export const FormVerify = ({ status }) => {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <form onSubmit={submit}>
            <p className="text-xs text-rotulo mb-2 text-center">
                Te hemos enviado un enlace de verificación a tu correo. Si no
                lo has recibido, podemos reenviarlo.
            </p>

            {status === "verification-link-sent" && (
                <p className="text-xs text-ledrx mb-2 text-center">
                    Se ha enviado un nuevo enlace de verificación.
                </p>
            )}

            <div className="flex items-center justify-between mt-4 p-2 gap-5">
                <PrimaryButton disabled={processing}>
                    Reenviar verificación
                </PrimaryButton>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="underline text-sm text-rotulo hover:text-lcd rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rotulo"
                >
                    Desconectar
                </Link>
            </div>
        </form>
    );
};
