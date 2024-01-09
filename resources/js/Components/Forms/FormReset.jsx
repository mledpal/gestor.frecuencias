import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export const FormReset = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"));
    };

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        // Obtener el valor del token y del email
        const token = url.pathname.split("/").pop(); // Obtener el último segmento de la URL como token
        const email = url.searchParams.get("email");

        // Hacer lo que necesites con el token y el email
        setData('email', email);
        setData('token', token);

    }, []);

    return (
        <form onSubmit={submit}>
            <div>
                <input type="hidden" id="token"></input>
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="email"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value="Contraseña" />

                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    isFocused={true}
                    onChange={(e) => setData("password", e.target.value)}
                />

                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel
                    htmlFor="password_confirmation"
                    value="Repita la contraseña"
                />

                <TextInput
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                />

                <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                />
            </div>

            <div className="flex items-center justify-end mt-4">
                <PrimaryButton className="ml-4" disabled={processing}>
                    Cambia la contraseña
                </PrimaryButton>
            </div>
        </form>
    );
};
