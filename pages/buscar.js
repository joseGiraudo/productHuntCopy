import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProducto from '../hooks/useProducto';

// cambio para github
const Buscar = () => {

  const router = useRouter();
  const { query: { q }} = router;

  // todos los productos
  const { productos } = useProducto('creado');

  // state para los productos filtrados
  const [ resultado, setResultado ] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter(producto => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      )
    });
    setResultado(filtro);
  }, [ q, productos]);


  return(
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              { resultado.map(producto => (
                  <DetallesProducto
                    key={producto.id}
                    producto={producto}
                  />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Buscar;