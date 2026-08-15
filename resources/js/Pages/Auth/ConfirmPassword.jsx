import GuestLayout from "@/Layouts/GuestLayout";

import { Head } from "@inertiajs/react";
import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";

export default function ConfirmPassword() {
    const isSmallScreen = usePantallaPequena();

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />
            {isSmallScreen ? (
                <Walkie form="confirm" />
            ) : (
                <Radio form="confirm" />
            )}
        </GuestLayout>
    );
}
