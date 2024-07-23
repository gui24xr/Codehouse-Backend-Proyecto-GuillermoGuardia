import swaggerJSDoc from 'swagger-jsdoc'


//Creo y exporto un objeto de configuracion.

export const swaggerOptions = {
    definition:{
        openapi : "3.0.1",
        info: {
            title: "G-Commerce",
            description: "Proyecto Backend de una app e commerce para curso.",
        }
    },

    apis: ["./src/docs/**/*.yaml"]
}

export const specs = swaggerJSDoc(swaggerOptions)