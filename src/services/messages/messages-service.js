import nodemailer from 'nodemailer'
import twilio from 'twilio';
import handlebars from 'handlebars';
import fs from 'fs'



const twilioAuth ={
    accountSid : 'ACb421537986a169eef222f739c4d3daed',
    authToken : 'ecd24146e94438fcb1e7f0e2da63fc6a'
}

const appEmail = ''

const twilioClient = twilio(twilioAuth.accountSid, twilioAuth.authToken);

//Cliente twilio para wtsp
const gmailClientPass = 'logi unrv nrfj adpo'

//cliente gmail para emails
const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user : 'gui24xr.dev@gmail.com',
        pass: gmailClientPass
    }
})


// Leer la plantilla HTML desde un archivo
const source = fs.readFileSync('email.handlebars', 'utf8');
// Compilar la plantilla HTML usando Handlebars
const template = handlebars.compile(source);
const ticketData = {
    titulo: 'Nuevo ticket creado',
    nombre: 'Juan',
    asunto: 'Problema con el servicio',
    descripcion: 'No puedo acceder al sistema. Por favor, ayúdenme.'
};

// Renderizar la plantilla HTML con los datos del ticket
const html = template(ticketData);


export class MessagesService{

    static sendWtsp(content,destinationPhoneNumber){
       
        twilioClient.messages.create({
            body: content,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${destinationPhoneNumber}`
        })
        .then(message => console.log(message.sid))
        //Cuando configure sandbox podria guardar en BD la respuesta    
    }

    static async sendMail(htmlcontent,destinationMail,subject){
        transport.sendMail({
                from: 'G-Commerce Gui24xr.dev',
                to: destinationMail,
                subject:subject,
                html:html,//Lo generan desde afuera
                attachments:[] //Aca van los archivos adjuntos...

            })
            .then ( res => console.log('Respuesta de email: ', res))
            //Con esto puedo manejar las confirmaciones de llegada, etc
        }


    
      


}