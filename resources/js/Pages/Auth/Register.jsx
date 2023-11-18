import { Radio } from "@/Components/Radio/Radio";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Register({ status, canResetPassword }) {
    return (
        <GuestLayout>
            <Head title="Register" />

            <Radio
                form="register"
                status={status}
                canResetPassword={canResetPassword}
            />
        </GuestLayout>
    );
}
