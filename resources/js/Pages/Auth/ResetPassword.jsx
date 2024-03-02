import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { Radio } from "@/Components/Radio/Radio";
import { useMediaQuery } from "@react-hook/media-query";
import { Walkie } from "@/Components/Walkie/Walkie";

export default function ResetPassword({ token, email }) {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");
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
