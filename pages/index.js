import React from 'react'
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';

import useProducto from '../hooks/useProducto';

export default function Home() {

  const { productos } = useProducto('creado');

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              { productos.map(producto => (
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
