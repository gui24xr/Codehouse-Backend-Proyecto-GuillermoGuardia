import nodemailer from 'nodemailer'
import twilio from 'twilio';


/*

const appEmail = ''

const twilioClient = twilio(twilioAuth.accountSid, twilioAuth.authToken);
*/
//Cliente twilio para wtsp


//cliente gmail para emails
const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user : process.env.gmailClientUser,
        pass: process.env.gmailClientPass
    }
})

//cliente twilio (Inicializa con accountSid y authtoken)
const twilioClient = twilio(process.env.twilioAccountSid,process.env.twilioAuthToken)









export class MessagesService{

    
    static async sendMail(textContent,destinationMail,subject){

            transport.sendMail({
                from: 'G-Commerce Gui24xr.dev',
                to: destinationMail,
                subject:subject,
                text:textContent,//Lo generan desde afuera
                attachments:[] //Aca van los archivos adjuntos...
            })
            //.then ( res => console.log('Respuesta de email: ', res))
            //Con esto puedo manejar las confirmaciones de llegada, etc
        }


    static async sendHtmlMail(destinationMail,subject,html){

               
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


    static sendWtsp(content,destinationPhoneNumber){
       
        twilioClient.messages.create({
            body: content,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${destinationPhoneNumber}`
        })
        //.then(message => console.log(message))
        //Cuando configure sandbox podria guardar en BD la respuesta    
    }
    


    
      


}