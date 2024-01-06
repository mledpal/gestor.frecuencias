import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export const FormRegister = ({ status }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        nombre: "",
        apellidos: "",
        email: "",
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

        post(route("register"));
    };

    return (
        <form onSubmit={submit} encType="multipart/form-data" className="grid ">
            <div className="w-full flex flex-row place-content-center gap-10">
                <div>
                    <InputLabel htmlFor="username" value="Usuario" />

                    <TextInput
                        id="username"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                        placeholder="Usuario"
                        required
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="E-mail"
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>

            <div className="w-full flex flex-row place-content-center gap-10">
                <div>
                    <InputLabel htmlFor="nombre" value="Nombre" />

                    <TextInput
                        id="nombre"
                        name="nombre"
                        value={data.nombre}
                        className="mt-1 block w-full"
                        autoComplete="nombre"
                        isFocused={true}
                        onChange={(e) => setData("nombre", e.target.value)}
                        placeholder="Nombre"
                        required
                    />

                    <InputError message={errors.nombre} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="apellidos" value="Apellidos" />

                    <TextInput
                        id="apellidos"
                        name="apellidos"
                        value={data.apellidos}
                        className="mt-1 block w-full"
                        autoComplete="apellidos"
                        isFocused={true}
                        onChange={(e) => setData("apellidos", e.target.value)}
                        placeholder="Apellidos"
                        required
                    />

                    <InputError message={errors.apellidos} className="mt-2" />
                </div>
            </div>

            <div className="w-full flex flex-row place-content-center gap-10">
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Contraseña"
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Repita la contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        placeholder="Repita contraseña"
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href={route("login")}
                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    ¿Ya registrado?
                </Link>

                <PrimaryButton className="ml-4" disabled={processing}>
                    Registro
                </PrimaryButton>
            </div>
        </form>
    );
};
