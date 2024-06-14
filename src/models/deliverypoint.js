import mongoose from "mongoose"


const colectionName = 'delivery_points'

const deliveryPointSchema = new mongoose.Schema({
    receiver:{
        type: String
    },
    address: {
        street: { type: String, required: true },
        streetNumber: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true },
        floor: { type: String },  // Piso
        apartment: { type: String }  // Departamento
    },
    coordinates: {
        latitude: { type: Number, required: true, default:null },
        longitude: { type: Number, required: true, default: null }
      },
    phones: [{   //Array de telefonos xq se puede tener mas de uno
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Expresión regular para validar números, espacios y caracteres + o -
                return /^[0-9 +\-]*$/.test(v);
            },
            message: props => `${props.value} no es un número de teléfono válido.`
        }
    }],
    type: {
        type: String,
        enum: [
          'Domicilio Residencial','Domicilio Laboral', 'Departamento', 'Oficina/Negocio',
          'Centro de Paquetería', 'Punto de Recolección Comunitario',
          'Hotel', 'Estación de Servicio', 'Casa Amiga/Familiar', 'Universidad/Escuela',
          'Gimnasio/Club Deportivo', 'Hospital/Clínica', 'Apartado Postal', 'Aeropuerto'
        ],
        required: true
      },
})

export const DeliveryPoint = new mongoose.model(colectionName, deliveryPointSchema)