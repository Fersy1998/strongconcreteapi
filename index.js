const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());


const nodemailer=require('nodemailer')
const {google}=require('googleapis')


const CLIENT_ID='918940753814-7u95d4ljr82en2r2mmp22nta4i5q9hc1.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04-sexKZix4VkCgYIARAAGAQSNwF-L9Ir783sqkroOI314mvqAuQk3SrSq7W32BzLaET9gxouHen4EXsYXKYHZxKlnEPjfPi2P2I'

const oAuth2Client=new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

app.post('/api/send-mail', async function (req, res) {
    
    try {
        const accessToken= await oAuth2Client.getAccessToken()
        const transport =nodemailer.createTransport({
            service:'gmail', 
            auth:{
                type:'OAuth2',
                user:'strongconcrete.info@gmail.com' ,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions={
            from:req.body.email,
            to: 'strongconcrete.info@gmail.com',
            subject: `Mensaje Desde Strong Concrete:  ${req.body.name}` + ` ${req.body.lastname}`,
            text: req.body.message + " | Numero telefono: " + req.body.tel + " | Enviado De: " + req.body.email,
            html: `<div>${req.body.message}</div><p>Numero telefono: ${req.body.tel}</p><p>Enviado desde el correo: ${req.body.email}</p>`
        }
        const result=await transport.sendMail(mailOptions)
        res.send('Mensaje enviado');
    } catch (error) {
        
        console.log(error)
        res.send('Error');
    }
})
const port=process.env.PORT || 4001
app.listen( port , ()=>{
    console.log(`Corriendo en el puerto ${ port}`);
})