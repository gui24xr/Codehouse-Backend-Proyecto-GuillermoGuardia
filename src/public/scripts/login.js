
alert('Script Sessions cargado !')

function getFormValues(receivedForm){
    //Devuelve un objeto prop-valor con los nombres y valores de cada campo del form pasado por parametro.
    const formData = new FormData(receivedForm)
    return Object.fromEntries(formData)
}


//--- MANEJO LOGIN LADO VISTAS

const loginForm = document.getElementById('main-login-form')
loginForm.addEventListener('submit',async (e)=>{
    //Prevenimos el comportamiento por defecto.
    e.preventDefault()
    //Obtenemos los valores del form.
    const queryParamsFromForm = getFormValues(e.target)
     fetch('/api/sessions/login',{
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryParamsFromForm)
    })
    .then( res => {
        console.log(res)
        if (res.ok){
            //Salio OK entonces ya el token fue entregado al cliente
            //Redirigimos a home y en home el token sera leido y redirigira donde corresponda.
            window.location.href ='/'
        }
        else{
            //Mediante notificacion avisamos que algo salio mal y damos el error.
            res.json()
            .then( res => {
                Swal.fire({icon: 'error',title: 'Login fallido',text: res.message});
            })
        }
    })
})

/*
//--- MANEJO REGISTROUSUARIOS LADO VISTAS
const registerForm = document.getElementById('main-register-form')
registerForm.addEventListener('submit',(e)=>{
    alert('submit')
    e.preventDefault() //Evito comportamiento por default.
    const queryParamsFromForm = getFormValues(e.target) //Obtengo parametros del form.
    console.log(queryParamsFromForm)
    //Hago la peticion al api 
    fetch('/api/sessions/register',{
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryParamsFromForm)
    })
    .then( res => {
        console.log(res)
        if (res.ok){
            //Salio OK entonces ya el token fue entregado al cliente
            //Mostramos notificacion y Redirigimos a login
            Swal.fire({
                icon: 'success',
                title: 'Login exitoso',
                showConfirmButton: false,
                timer: 1500
              });
            window.location.href ='/views/login'
        }
        else{
            //Mediante notificacion avisamos que algo salio mal y damos el error.
            res.json()
            .then( res => {
                Swal.fire({icon: 'error',title: 'Registro fallido',text: res.message});
            })
        }
    })
})



*/




