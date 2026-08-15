import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { Radio } from "@/Components/Radio/Radio";

import { Walkie } from "@/Components/Walkie/Walkie";

import { usePantallaPequena } from "@/hooks/usePantallaPequena";

export default function ResetPassword({ token, email }) {
    const isSmallScreen = usePantallaPequena();

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"));
    };

    return (
        <GuestLayout>
            <Head title="Reiniciar Contraseña" />
            {isSmallScreen ? <Walkie form="reset" /> : <Radio form="reset" />}
        </GuestLayout>
    );
}
