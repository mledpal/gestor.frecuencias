import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export const FormRegister = () => {
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

    const handleInputChange = (fieldName, value) => {
        setData({
            ...data,
            [fieldName]: value,
        });
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
                        onChange={(e) =>
                            handleInputChange("username", e.target.value)
                        }
                        placeholder="Usuario"
                        required
                    />

                    <InputError message={errors?.username?.username} className="mt-2" />
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
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        placeholder="E-mail"
                        required
                    />

                    <InputError message={errors?.email?.email} className="mt-2" />
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
                        onChange={(e) =>
                            handleInputChange("nombre", e.target.value)
                        }
                        placeholder="Nombre"
                        required
                    />

                    <InputError message={errors?.nombre?.nombre} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="apellidos" value="Apellidos" />

                    <TextInput
                        id="apellidos"
                        name="apellidos"
                        value={data.apellidos}
                        className="mt-1 block w-full"
                        autoComplete="apellidos"
                        onChange={(e) =>
                            handleInputChange("apellidos", e.target.value)
                        }
                        placeholder="Apellidos"
                        required
                    />

                    <InputError message={errors?.apellidos?.apellidos} className="mt-2" />
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
                        onChange={(e) =>
                            handleInputChange("password", e.target.value)
                        }
                        placeholder="Contraseña"
                        required
                    />

                    <InputError message={errors?.password} className="mt-2" />
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
                            handleInputChange(
                                "password_confirmation",
                                e.target.value
                            )
                        }
                        placeholder="Repita contraseña"
                        required
                    />

                    <InputError
                        message={errors?.password}
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 p-2 gap-5">
                <Link
                    href={route("password.request")}
                    className="underline text-sm text-gray-500 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                    ¿Olvidaste el password?
                </Link>

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
