# Gestor de Frecuencias

## Proyecto para fin del ciclo de DAW

### Instalación del proyecto

- *git clone https://github.com/mledpal/gestor.frecuencias.git*
- *composer install*
- *yarn install*
- *php artisan key:generate*
- *php artisan storage:link*
- Crear la base de datos *frecuencias*
- *php artisan migrate --seed*

### Para la ejecución del proyecto

- En una consola, ejecutar **php artisan serve**
- En una segunda consola, ejecutar **yarn dev**
- Acceder a [localhost](http://localhost:8000) en un navegador


### Pasos realizados
- Creación de usuarios
- Recuperación de contraseña olvidada
- Imagen de perfil
- Edición de contactos
- Sistema de filtros de contactos

### Estado actual

- Finalizando la creación de nuevos contactos y el sistema de búsqueda

### Próximos pasos

- Crear vistas y controladores para visualizar los mensajes de usuarios acerca de una frecuencia/contacto
- Crear vistas y controladores para los Mensajes entre usuarios
- Crear vistas y controladores para visualizar los contactos en una lista
