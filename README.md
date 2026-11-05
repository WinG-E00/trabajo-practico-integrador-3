# Trabajo integrador Mongoose

## Modelos
* Category
    Relacionado con Modelo de Event 
* Event
  * Event relacionado con esquema embebido location, y con campo organizer relacionado mediante el id del modelo User
  * Relacion de muchos a muchos en el campo Categories: con el id de Category.
* User 
  * Con Esquema embebido de profile
  * Relacionado unicamente con Event

## Controladores y rutas

Todas las rutas de la API usan el prefijo `/api`.

### Auth
- `POST /api/auth/register`: Registra un usuario.
- `POST /api/auth/login`: Inicia sesion y crea una cookie.
- `GET /api/auth/profile`: Muestra el perfil propio.
- `PUT /api/auth/profile`: Actualiza el perfil propio.
- `POST /api/auth/logout`: Cierra la sesion.

### Users
- `GET /api/users`: Lista los usuarios activos.
- `GET /api/users/:id`: Muestra un usuario.
- `PUT /api/users/:id`: Actualiza un usuario.
- `DELETE /api/users/:id`: Desactiva un usuario y elimina sus eventos.

### Categories
- `POST /api/categories`: Crea una categoria.
- `GET /api/categories`: Lista las categorias.
- `GET /api/categories/:id`: Muestra una categoria y sus eventos.
- `PUT /api/categories/:id`: Actualiza una categoria.
- `DELETE /api/categories/:id`: Elimina una categoria y la quita de los eventos.

### Events
- `POST /api/events`: Crea un evento.
- `GET /api/events`: Lista los eventos.
- `GET /api/events/my`: Lista los eventos propios.
- `GET /api/events/:id`: Muestra un evento.
- `PUT /api/events/:id`: Actualiza un evento.
- `DELETE /api/events/:id`: Elimina un evento.




