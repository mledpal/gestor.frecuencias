import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import { useMediaQuery } from "@react-hook/media-query";

export default function Register({ status, canResetPassword }) {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");

    return (
        <GuestLayout>
            <Head title="Registro" />

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
