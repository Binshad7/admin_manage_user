const nodemailer = require('nodemailer')
const dotenv =  require('dotenv')
dotenv.config()
const sendVeriFyMail =async (name,mail,id)=>{
    try{
     const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:process.env.MY_EMAIL,
            pass:process.env.MY_secrete_password
        }
     })
     const mailOptions = {
        from:process.env.MY_EMAIL,
        to:mail,
        subject:'For Verification mail',
        html:`
       <table width="100%" style="margin: 0; padding: 0; border-collapse: collapse;">
            <tr>
                <td align="center" style="background-color: #f5f5f5; padding: 20px;">
                    <table width="600" style="border: 1px solid #ccc; border-radius: 5px; overflow: hidden; background-color: #ffffff;">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <h1 style="font-family: 'Mukta', sans-serif; margin: 0;">Welcome to <span style="color: #FF6B18;">#1</span> SHOPPING</h1>
                                <div>
                                  
                                </div>
                                <div style="font-family: 'Titillium Web', sans-serif; margin-top: 20px;">
                                    <p style="margin: 0;">Dear ${name},</p>
                                    <p style="margin: 20px 0;">Thank you for registering with <span style="color: #FF6B18;">#1 SHOPPING CART</span>,your go-to platform for innovative e-commerce solutions. To ensure the security of your account and provide you with seamless access to our services, please verify your email address by clicking the link below.</p>
                                    <p>
                                        <a href="http://localhost:5050/mailVerify/${id}" style="display: inline-block; background-color: #FF6B18; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">VERIFY</a>
                                    </p>
                                    <p style="margin: 10px 0; color: orange;">#1ShoppingCart.com</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
       
        `
     }
     transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log('Email has been Send',info.response);
            
        }
     })
    }catch(error){
         console.error(error);
    }
}

module.exports = { sendVeriFyMail}