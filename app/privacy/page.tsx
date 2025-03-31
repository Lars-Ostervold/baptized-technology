import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy | Baptized Technology",
  description: "Our commitment to protecting your privacy and data",
};

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      
      <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
        <p>
          Baptized Technology (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and safeguard your personal information 
          when you use our services.
        </p>
      </div>

      <div className="space-y-10">
        <PolicySection 
          title="1. Information We Collect" 
          content={
            <div className="space-y-4">
              <p>We collect the following types of information when you interact with our services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Personal Information:</span> Name and email address (collected during sign-up).</li>
                <li><span className="font-medium">Chat Interactions:</span> Conversations with our AI-powered study tool.</li>
                <li><span className="font-medium">Browsing Data:</span> We use analytics tools to track site usage and performance.</li>
              </ul>
            </div>
          }
        />

        <PolicySection 
          title="2. How We Collect Information" 
          content={
            <div className="space-y-4">
              <p>We gather data through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>User sign-ups and account creation.</li>
                <li>Chat interactions with our AI tool.</li>
                <li>Website analytics and tracking technologies.</li>
              </ul>
            </div>
          }
        />

        <PolicySection 
          title="3. How We Use Your Information" 
          content={
            <div className="space-y-4">
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve AI responses and enhance user experience.</li>
                <li>Monitor website performance and user engagement.</li>
                <li>Send relevant updates and communications.</li>
              </ul>
            </div>
          }
        />

        <PolicySection 
          title="4. Data Sharing & Third Parties" 
          content={
            <div className="space-y-4">
              <p>We do not sell or share your personal data with third-party advertisers. However, we use third-party services to operate our platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Stripe</span> (for payment processing)</li>
                <li><span className="font-medium">Supabase</span> (for data storage and security)</li>
                <li><span className="font-medium">Vercel Analytics</span> (for website performance tracking)</li>
                <li><span className="font-medium">OpenAI</span> (for AI-powered responses)</li>
              </ul>
              <p>These third-party providers have their own privacy policies, and we encourage you to review them.</p>
              <p>In the future, we may provide anonymized, aggregated insights to churches and organizations (e.g., &quot;The top three most common questions from your congregation are XYZ&quot;).</p>
            </div>
          }
        />

        <PolicySection 
          title="5. How We Protect Your Data" 
          content={
            <p>We store data on Supabase with security measures in place, including row-level security to protect access.</p>
          }
        />

        <PolicySection 
          title="6. Data Retention & Deletion" 
          content={
            <div className="space-y-4">
              <p>We retain user data indefinitely unless a deletion request is made.</p>
              <p>Users can delete their chat history or account, and their data will be permanently removed.</p>
            </div>
          }
        />

        <PolicySection 
          title="7. Your Rights" 
          content={
            <div className="space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request deletion of your personal data.</li>
                <li>Opt out of receiving communications.</li>
                <li>Access information about how your data is used.</li>
              </ul>
              <p>To request account deletion or data removal, please contact us at <a href="mailto:contact@baptizedtechnology.com" className="underline text-primary hover:text-primary/80">contact@baptizedtechnology.com</a>.</p>
            </div>
          }
        />

        <PolicySection 
          title="8. Children's Privacy" 
          content={
            <p>Our services are not intended for users under 18. We do not knowingly collect data from minors.</p>
          }
        />

        <PolicySection 
          title="9. International Use" 
          content={
            <p>We currently operate within the U.S. and do not comply with international data protection laws (e.g., GDPR).</p>
          }
        />

        <PolicySection 
          title="10. Changes to This Policy" 
          content={
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.</p>
          }
        />

        <PolicySection 
          title="11. Contact Us" 
          content={
            <p>If you have any questions, contact us at <a href="mailto:contact@baptizedtechnology.com" className="underline text-primary hover:text-primary/80">contact@baptizedtechnology.com</a>.</p>
          }
        />
      </div>
    </div>
  );
}

interface PolicySectionProps {
  title: string;
  content: React.ReactNode;
}

function PolicySection({ title, content }: PolicySectionProps) {
  return (
    <Card className="border border-border bg-card/50 hover:bg-card/80 transition-colors">
      <CardHeader>
        <h2 className="text-2xl font-bold">{title}</h2>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}