import { urlObjectKeys } from 'next/dist/shared/lib/utils';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';



const useValidacion = (stateInicial, validar, fn) => {

    const [ valores, setValores ] = useState(stateInicial);
    const [ errores, setErrores ] = useState({});
    const[submitForm, setSubmitForm] = useState(false);

    // hook de routing para redireccionar
    const router = useRouter();

    useEffect(() => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores) {
                fn(); // fn es una funcion libre a cada formulario
            }
            setSubmitForm(false);
        }
    }, [errores]);

    // funcion que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    // funcion que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
        setSubmitForm(true);
        router.push('/');
    }

    // cuando se realiza el evento de blur
    const handleBlur = e => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        submitForm,

        handleSubmit,
        handleChange,
        handleBlur
    }
}
 
export default useValidacion;