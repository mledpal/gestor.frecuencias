import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";

export default function ({ status, canResetPassword }) {
    const isSmallScreen = usePantallaPequena();

    return (
        <GuestLayout>
            <Head>
                <title>Iniciar Sesión</title>
                <meta
                    name="description"
                    content="Accede a tu cuenta en Gestor de Frecuencias para consultar tus contactos de radioaficionado, repetidores y frecuencias compartidas."
                />
            </Head>
            {isSmallScreen ? (
                <Walkie
                    status={status}
                    canResetPassword={canResetPassword}
                    form="login"
                />
            ) : (
                <Radio
                    status={status}
                    canResetPassword={canResetPassword}
                    form="login"
                />
            )}
        </GuestLayout>
    );
}
