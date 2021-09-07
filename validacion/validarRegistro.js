// reglas de validacion propias del registro de una cuenta en la pagina

export default function validarRegistro(valores) {

    let errores = {};

    // validar el nombre de usuario
    if(!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

    // validar el email
    if(!valores.email) {
        errores.email = "El email es obligatorio";
    } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
        errores.email = "Email no válido";
    }

    // validar el password de usuario
    if(!valores.password) {
        errores.password = "El password es obligatorio";
    } else if(valores.password.length < 6 ) {
        errores.password = "El password debe contener al menos 6 caracteres";
    }

    return errores;
}