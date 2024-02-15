export const TipoCodificacion = ({ t, delTipo, editTipo }) => {
    return (
        <div
            key={t.id}
            className={`w-full flex flex-row items-center justify-between px-5 h-[60px]`}
        >
            <span className="w-4/5">{t.nombre}</span>

            <div className="w-1/5 flex flex-col h-full items-center justify-around">
                <i
                    className="fa-solid fa-pencil text-white hover:scale-150 duration-200 cursor-pointer"
                    onClick={() => {
                        editTipo(t);
                    }}
                ></i>
                <i
                    className="fa-solid fa-trash-can text-red-500 hover:scale-150 duration-200 cursor-pointer"
                    onClick={() => {
                        delTipo(t.id);
                    }}
                ></i>
            </div>
        </div>
    );
};
