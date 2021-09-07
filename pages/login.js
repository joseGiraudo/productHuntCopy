import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarLogin from '../validacion/validarLogin';

// state inicial
const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {


  //state para mostrar errores
  const  [error, setError ] = useState(false);

  const { valores, errores, submitForm, handleSubmit, handleChange, handleBlur
  } = useValidacion(STATE_INICIAL, validarLogin, IniciarSesion);

  const { nombre, email, password } = valores;

  async function IniciarSesion(){
    try {
      await firebase.login(email, password);
      Router.push('/');

    } catch (error) {
      console.error('Hubo un error al autenticar el usuario ', error.message);
      setError(error.message);
    }
  }

    return (
      <div>
        <Layout>
          <>
          <h1 css={css`
            text-align: center;
            margin-top: 5rem;
          `}
          >Iniciar Sesión</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </Campo>

            { errores.email && <Error>{errores.email}</Error> }
            { error && <Error> {error} </Error> }
            
            <Campo>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </Campo>

            { errores.password && <Error>{errores.password}</Error> }

            <InputSubmit type="submit" value="Iniciar Sesión" />
          </Formulario>
          </>
        </Layout>
      </div>
    )
}

export default Login