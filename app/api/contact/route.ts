import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    
    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" }, 
        { status: 400 }
      );
    }
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Baptized Technology Contact <lars@baptizedtechnology.com>", // You'll need to verify this domain in Resend
      to: "lars@baptizedtechnology.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      // You can also use HTML for a nicer formatted email
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    });
    
    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json(
        { message: "Failed to send email" }, 
        { status: 500 }
      );
    }
    
    console.log("Email sent successfully:", data);
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Something went wrong with your request" },
      { status: 500 }
    );
  }
}