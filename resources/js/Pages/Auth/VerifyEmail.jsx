import GuestLayout from "@/Layouts/GuestLayout";

import { Head } from "@inertiajs/react";
import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import { usePantallaPequena } from "@/hooks/usePantallaPequena";

export default function VerifyEmail({ status }) {
    const isSmallScreen = usePantallaPequena();

    return (
        <GuestLayout>
            <Head title="Verificar email" />
            {isSmallScreen ? (
                <Walkie form="verify" status={status} />
            ) : (
                <Radio form="verify" status={status} />
            )}
        </GuestLayout>
    );
}
