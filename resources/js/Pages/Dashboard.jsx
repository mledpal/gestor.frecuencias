import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight bg-colorbg">
                    Panel de Usuario
                </h2>
            }
        >
            <Head title="Panel de Usuario" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 max-[1280px]:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            ¡Estás logueado {auth.user.username}!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
