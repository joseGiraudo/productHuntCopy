// reglas de validacion propias de la creacion de un nuevo producto

export default function validarCrearProducto(valores) {

    let errores = {};

    // validar el nombre de usuario
    if(!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

    // validar empresa
    if(!valores.empresa) {
        errores.empresa = "La empresa es obligatoria";
    }

    // validar url
    if(!valores.url) {
        errores.url = "La URL del producto es obligatoria";
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "URL mal formateada o no válida";
    }

    // validar descripcion
    if(!valores.descripcion) {
        errores.descripcion = "Agrega una descripcion de tu producto";
    }

    
    return errores;
}