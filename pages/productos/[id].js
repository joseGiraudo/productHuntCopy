import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import es from 'date-fns/locale/es';

import { FirebaseContext } from '../../firebase';

const Contenedor = styled.div`
    @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: 0%.5rem 2rem;
    color: #DA552F;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    // state del componente
    const [ producto, setProducto ] = useState({});
    const [ error, setError] = useState(false);
    const [ comentario, setComentario ] = useState({});
    const [ consultarDB, setConsultarDB ] = useState(true);

    // routing para obtener el id actual
    const router = useRouter();
    const { query: { id }} = router;

    // context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB){
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists ) {
                    setProducto(producto.data() );
                    setConsultarDB(false);
                } else {
                    setError(true);
                    setConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, votoUsuario } = producto;

    // Administrar y validar los votos de un producto
    const votarProducto = () => {
        if(!usuario) {
            return router.push('/login');
        }
        // verificar si el usuario actual ha votado 
        if(votoUsuario.includes(usuario.uid)) return;

        // obtener y sumar un voto
        const nuevoTotal = votos + 1;


        // guardar el id del usuario que vota
        const hanVotado = [...votoUsuario, usuario.uid]

        // actualizar BD
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            votoUsuario: hanVotado
        });

        // actualizar state
        setProducto({
            ...producto,
            votos: nuevoTotal
        });
        // volver a cargar el componente y consultar a la BD
        setConsultarDB(true);
    }

    // funciones para crear comentarios
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        });
    }

    // identificar el comentario del creador
    const esCreador = id => {
        if(creador.id === id) {
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();
        // verificar si esta autenticado
        if(!usuario) {
            return router.push('/login');
        }
        // informacion del comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // tomar copia de comentarios y agregarlos
        const nuevosComentarios = [
            ...comentarios,
            comentario
        ];

        // actualizar la BD
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        });
        // actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });
        // volver a cargar el componente y consultar a la BD
        setConsultarDB(true);
    }

    // funcion que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true;
        }
    }
    // elimina un producto de la BD
    const eliminarProducto = async () => {
        // verificar si esta autenticado
        if(!usuario) {
            return router.push('/login');
        }
        if(creador.id !== usuario.uid) {
            return router.push('/login');
        }
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log('hubo un error: ', error)
        }
    }

    return ( 
        <Layout>
            <>
            {error ? <Error404 /> : (

                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}>
                        {nombre}
                    </h1>

                    <Contenedor>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es} )}</p>
                            <p>Por: <b>{creador.nombre}</b> en nombre de <b>{empresa}</b></p>

                            <img src={urlimagen} />
                            <p>{descripcion}</p>

                            { usuario && (
                                <>
                                    <h2>Agrega un comentario</h2>
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input
                                                type="text"
                                                name="mensaje"
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type="submit"
                                            value="Agregar Comentario"
                                        />
                                    </form>
                                </>
                            )}

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>

                            {comentarios.length === 0 ? (<p>Aun no hay comentarios</p>) : (
                                <ul>
                                    { comentarios.map((comentario, i) => (
                                        <li 
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                        `}>
                                            <p>{comentario.mensaje}</p>
                                            <p css={css`
                                                text-align: right;
                                                margin-right: 3px;
                                            `}>Escrito por: {''}
                                            <span css={css`
                                                font-weight: bold;
                                            `}>{comentario.usuarioNombre}</span></p>

                                            { esCreador(comentario.usuarioId) && 
                                                <CreadorProducto>Es Creador</CreadorProducto> }
                                        </li>
                                    ))}
                                </ul>
                            )}

                            
                        </div>
                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar URL</Boton>

                            <div css={css`
                                margin-top: 5rem;
                            `}>
                                <p css={css`
                                    text-align: center;
                                    padding: 2rem;
                                    border: 1px solid #e1e1e1;
                                    border-radius: 10%;
                                `}>{votos} Votos</p>
                                
                                {usuario && (
                                    <Boton css={css`
                                        text-align: center;
                                        &:hover {
                                            background-color: #e1e1e1;
                                        }
                                        `}
                                        onClick={votarProducto}
                                    >Votar</Boton>
                                )}
                            </div>

                        </aside>
                    </Contenedor>

                    { puedeBorrar() && 
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar producto</Boton>
                    }
                </div>

            )}

            

            </>
        </Layout>
     );
}
 
export default Producto;