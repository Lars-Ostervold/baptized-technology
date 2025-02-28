import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Github, FileText } from "lucide-react"
import WaterBackground from "@/components/water-background"

export default function SupportPage() {
  return (
    <div className="container max-w-7xl py-20 relative z-10">
      <WaterBackground />
      
      <section className="space-y-6 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Support Baptized Technology
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Help us build tools that bring people closer to Jesus
        </p>
      </section>

      <section className="max-w-3xl mx-auto bg-muted/30 p-8 rounded-lg border border-border mb-20">
        <div className="space-y-6 text-center">
          <Heart className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-3xl font-bold">Coming Soon</h2>
          <p className="text-lg text-muted-foreground">
            We're not currently accepting financial contributions while we're building our initial tools.
            Check back soon for ways to support this mission financially.
          </p>
          <p className="text-muted-foreground">
            In the meantime, you can support us by:
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="bg-background/50 border-border">
              <CardContent className="pt-6 space-y-4 text-center">
                <Github className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Open Source Contributions</h3>
                <p className="text-muted-foreground">
                  Help improve our tools by contributing to our GitHub repositories
                </p>
                <Button variant="outline" asChild>
                  <a href="https://github.com/baptizedtechnology" target="_blank" rel="noopener noreferrer">
                    Visit GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-background/50 border-border">
              <CardContent className="pt-6 space-y-4 text-center">
                <FileText className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Spread the Word</h3>
                <p className="text-muted-foreground">
                  Share these tools with others who might benefit from them
                </p>
                <Button variant="outline" asChild>
                  <Link href="/chatbots">
                    Explore Tools
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 
      // FUTURE IMPLEMENTATION: DONATION SYSTEM
      // 1. Install required packages:
      // npm install @stripe/stripe-js @stripe/react-stripe-js stripe

      import { loadStripe } from '@stripe/stripe-js';
      import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
      
      // Initialize Stripe
      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      
      // Donation form component
      function DonationForm() {
        const stripe = useStripe();
        const elements = useElements();
        const [amount, setAmount] = useState(25);
        const [isRecurring, setIsRecurring] = useState(false);
        const [isProcessing, setIsProcessing] = useState(false);
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        
        const handleSubmit = async (e) => {
          e.preventDefault();
          setIsProcessing(true);
          
          if (!stripe || !elements) {
            return;
          }
          
          // Create payment method
          const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
          });
          
          if (stripeError) {
            setError(stripeError.message);
            setIsProcessing(false);
            return;
          }
          
          // Submit payment to your API
          try {
            const { error, clientSecret } = await fetch('/api/donate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                amount: amount * 100, // convert to cents
                recurring: isRecurring,
                paymentMethodId: paymentMethod.id
              })
            }).then(r => r.json());
            
            if (error) {
              setError(error);
              setIsProcessing(false);
              return;
            }
            
            // Confirm payment if needed (for subscription or complex payments)
            if (clientSecret) {
              const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
              if (confirmError) {
                setError(confirmError.message);
                setIsProcessing(false);
                return;
              }
            }
            
            setSuccess(true);
            setIsProcessing(false);
          } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsProcessing(false);
          }
        };
        
        if (success) {
          return (
            <div className="text-center py-8 space-y-4">
              <div className="rounded-full bg-green-100 p-3 w-fit mx-auto">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium">Thank you for your support!</h3>
              <p className="text-muted-foreground">
                Your contribution helps us continue building tools that bring people closer to Jesus.
              </p>
              <Button onClick={() => setSuccess(false)} variant="outline">
                Make Another Donation
              </Button>
            </div>
          );
        }
        
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium">Donation Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={amount === value ? "default" : "outline"}
                    onClick={() => setAmount(value)}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
              <div className="flex items-center mt-2">
                <span className="mr-2">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="font-medium block mb-2">Payment Details</label>
              <div className="rounded-md border border-input p-3 bg-background">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="recurring">Make this a monthly donation</label>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <Button type="submit" disabled={isProcessing || !stripe} className="w-full">
              {isProcessing ? "Processing..." : "Donate"}
            </Button>
          </form>
        );
      }
      
      // You'll also need to create a server-side API route at /api/donate
      // filepath: /app/api/donate/route.ts
      
      import { NextResponse } from "next/server";
      import Stripe from "stripe";

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      export async function POST(req: Request) {
        try {
          const { amount, recurring, paymentMethodId } = await req.json();
          
          // For one-time donations
          if (!recurring) {
            const paymentIntent = await stripe.paymentIntents.create({
              amount,
              currency: "usd",
              payment_method: paymentMethodId,
              confirmation_method: "manual",
              confirm: true,
              return_url: `${process.env.NEXT_PUBLIC_URL}/support/thank-you`,
            });
            
            return NextResponse.json({ 
              clientSecret: paymentIntent.client_secret 
            });
          }
          
          // For recurring donations (subscriptions)
          // 1. Create or get customer
          let customer;
          // You'd typically check if the user already has a customer ID in your database
          
          customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email: "customer@example.com", // You'd get this from authenticated user
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          });
          
          // 2. Create subscription
          const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Monthly Donation',
                  },
                  unit_amount: amount,
                  recurring: {
                    interval: 'month',
                  },
                },
              },
            ],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });
          
          return NextResponse.json({ 
            clientSecret: subscription.latest_invoice.payment_intent.client_secret 
          });
        } catch (error) {
          console.error('Donation error:', error);
          return NextResponse.json(
            { error: error.message || "Payment failed" }, 
            { status: 400 }
          );
        }
      }
      
      // In your actual page component, wrap the form with Stripe Elements
      function DonationSection() {
        return (
          <section className="max-w-md mx-auto bg-muted/30 p-8 rounded-lg border border-border mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Support Our Mission</h2>
              <p className="text-muted-foreground text-center">
                Your donation helps us build better tools for encountering Jesus through Scripture
              </p>
              <Elements stripe={stripePromise}>
                <DonationForm />
              </Elements>
            </div>
          </section>
        );
      }
      */}
    </div>
  )
}