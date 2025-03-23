import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Terms of Service | Baptized Technology',
  description: 'Terms of Service for using Baptized Technology\'s AI platform',
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="space-y-4 text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      
      <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
        <p>
          Welcome to Baptized Technology! These Terms of Service (&quot;Terms&quot;) govern your access to and use of our 
          AI-powered platform, website, and services. By using our services, you agree to these Terms. If you do not agree, 
          please do not use our platform.
        </p>
      </div>

      <div className="space-y-10">
        <PolicySection 
          title="1. Overview of Services" 
          content={
            <p>Baptized Technology provides AI-powered tools designed to help users engage with Christian scholarship and resources.</p>
          }
        />

        <PolicySection 
          title="2. Eligibility" 
          content={
            <p>You must be at least 18 years old to use our services. By using our platform, you confirm that you meet this requirement.</p>
          }
        />

        <PolicySection 
          title="3. Acceptable Use" 
          content={
            <div className="space-y-4">
              <p>By using our services, you agree that you will NOT:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for unlawful, harmful, or abusive activities.</li>
                <li>Attempt to interfere with or disrupt our services.</li>
                <li>Use AI-generated content as a replacement for pastoral or theological counsel.</li>
                <li>Misrepresent or falsely attribute AI responses as official theological doctrine.</li>
              </ul>
            </div>
          }
        />

        <PolicySection 
          title="4. User Accounts & Data" 
          content={
            <div className="space-y-4">
              <p>You are responsible for maintaining the security of your account and credentials.</p>
              <p>We collect and store user data as outlined in our Privacy Policy.</p>
              <p>If you choose to delete your account, your data (including chat history) will be permanently removed.</p>
            </div>
          }
        />

        <PolicySection 
          title="5. AI Limitations & Disclaimer" 
          content={
            <div className="space-y-4">
              <p>The AI-generated responses are study tools only and should not be considered authoritative theological, legal, or pastoral advice.</p>
              <p>AI models process and summarize information but may contain inaccuracies.</p>
              <p>We are not responsible for how users interpret or apply AI-generated content.</p>
            </div>
          }
        />

        <PolicySection 
          title="6. Payments & Subscriptions" 
          content={
            <div className="space-y-4">
              <p>Any payments made for premium features (if applicable) are handled by Stripe. We do not store or process payment information.</p>
              <p>Refund policies, if applicable, will be communicated at the point of purchase.</p>
            </div>
          }
        />

        <PolicySection 
          title="7. Data Usage & Privacy" 
          content={
            <div className="space-y-4">
              <p>We collect and use data as described in our Privacy Policy.</p>
              <p>We do not sell personal data, but we may provide anonymized usage statistics to churches and organizations.</p>
            </div>
          }
        />

        <PolicySection 
          title="8. Termination of Use" 
          content={
            <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          }
        />

        <PolicySection 
          title="9. Intellectual Property" 
          content={
            <div className="space-y-4">
              <p>All AI-generated content, platform design, and technology belong to Baptized Technology.</p>
              <p>You retain ownership of any original content you contribute but grant us a limited license to use it for improving our services.</p>
            </div>
          }
        />

        <PolicySection 
          title="10. Third-Party Services" 
          content={
            <p>Our platform integrates with third-party services (e.g., OpenAI, Supabase, Stripe, Vercel Analytics). We are not responsible for their terms, policies, or security practices.</p>
          }
        />

        <PolicySection 
          title="11. Limitation of Liability" 
          content={
            <div className="space-y-4">
              <p>We provide our services &quot;as is&quot; without warranties of any kind.</p>
              <p>We are not liable for damages, losses, or misuse of AI-generated content.</p>
            </div>
          }
        />

        <PolicySection 
          title="12. Changes to These Terms" 
          content={
            <p>We may update these Terms periodically. Continued use of our services after an update constitutes acceptance of the new Terms.</p>
          }
        />

        <PolicySection 
          title="13. Governing Law" 
          content={
            <p>These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles.</p>
          }
        />

        <PolicySection 
          title="14. Contact Information" 
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