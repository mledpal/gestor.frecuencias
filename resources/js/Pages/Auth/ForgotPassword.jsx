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
                <title>Recuperar Contraseña</title>
                <meta
                    name="description"
                    content="Recupera el acceso a tu cuenta de Gestor de Frecuencias."
                />
            </Head>
            {isSmallScreen ? (
                <Walkie
                    status={status}
                    canResetPassword={canResetPassword}
                    form="forgot"
                />
            ) : (
                <Radio
                    status={status}
                    canResetPassword={canResetPassword}
                    form="forgot"
                />
            )}
        </GuestLayout>
    );
}
