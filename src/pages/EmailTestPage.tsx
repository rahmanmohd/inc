import EmailTest from "@/components/EmailTest";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function EmailTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email Service Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use this page to test the email sending functionality. This will help us debug 
            why confirmation emails aren't being received after form submissions.
          </p>
        </div>
        <EmailTest />
      </main>
      <Footer />
    </div>
  );
}
