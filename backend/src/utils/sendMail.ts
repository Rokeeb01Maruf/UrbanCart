import nodemailer from "nodemailer"

export const sendMail = async (to: string, subject: string, html: string) =>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.APP_USER,
            pass: process.env.APP_PASSWORD
        },
    })

    await transporter.sendMail({
        from: `"UrbanCart" <${process.env.APP_USER}>`,
        to,
        subject,
        html
    })
}