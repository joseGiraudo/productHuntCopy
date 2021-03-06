import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, {useRouter} from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import Error404 from '../components/layout/404';

import { FirebaseContext } from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

// state inicial
const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  //state para mostrar errores
  const [error, setError ] = useState(false);

  // state para imagenes
  const [ imagen, setImagen] = useState(null);

  const { valores, errores, submitForm, handleSubmit, handleChange, handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, url, descripcion } = valores;

  // hook de routing para redireccionar
  const router = useRouter();

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  const handleFile = e => {
    if(e.target.files[0]){
      console.log(e.target.files[0])
      setImagen(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    const uploadTask = await firebase.storage.ref(`products/${imagen.lastModified}${imagen.name}`).put(imagen);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL

  }

  async function crearProducto() {

    //si el usuario no esta autenticado, llevar al login
    if( !usuario ) {
      return router.push('/login');
    }

    // crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen: await handleUpload(),
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre : usuario.displayName
      },
      votoUsuario: []
    }

    // insertarlo en la DB
    await firebase.db.collection('productos').add(producto);
  }


  return (
    <div>
      <Layout>
        { !usuario ? <Error404 /> : (

          <>
          <h1 css={css`
            text-align: center;
            margin-top: 5rem;
          `}
          >Publica un Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >

            <fieldset>
              <legend>Informaci??n General</legend>
            
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del Producto"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              { errores.nombre && <Error>{errores.nombre}</Error> }

              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Nombre de la Empresa"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              { errores.empresa && <Error>{errores.empresa}</Error> }

              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  id="imagen"
                  name="imagen"
                  onInput={(e) => handleFile(e)}
                  />
              </Campo>
              { errores.imagen && <Error>{errores.imagen}</Error> }

              <Campo>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  placeholder="url del producto"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              { errores.url && <Error>{errores.url}</Error> }
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor="descripcion">Descripci??n</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              { errores.descripcion && <Error>{errores.descripcion}</Error> }
            </fieldset>

            

            { error && <Error> {error} </Error> }
            
            
            <InputSubmit type="submit" value="Crear y Publicar" />
          </Formulario>
          </>

        )}
        
      </Layout>
    </div>
  )
}

export default NuevoProducto;
  