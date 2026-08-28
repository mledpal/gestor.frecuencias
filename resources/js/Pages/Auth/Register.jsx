import { AppContext } from "@/Components/AppProvider";
import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";

import { useContext } from "react";

export default function Register({ status, canResetPassword }) {
    const isSmallScreen = usePantallaPequena();

    return (
        <GuestLayout>
            <Head>
                <title>Crear Cuenta</title>
                <meta
                    name="description"
                    content="Únete a la comunidad de radioaficionados de Gestor de Frecuencias. Registra tus contactos, comparte frecuencias y conecta con otros radioescuchas."
                />
            </Head>

            {isSmallScreen ? (
                <Walkie
                    form="register"
                    status={status}
                    canResetPassword={canResetPassword}
                />
            ) : (
                <Radio
                    form="register"
                    status={status}
                    canResetPassword={canResetPassword}
                />
            )}
        </GuestLayout>
    );
}
