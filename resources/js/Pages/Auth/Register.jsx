import { AppContext } from "@/Components/AppProvider";
import { Radio } from "@/Components/Radio/Radio";
import { Walkie } from "@/Components/Walkie/Walkie";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

import { useContext } from "react";

export default function Register({ status, canResetPassword }) {
    const { isSmallScreen } = useContext(AppContext);

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
