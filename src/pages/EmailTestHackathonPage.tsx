import React from 'react';
import EmailTestHackathon from '../components/EmailTestHackathon';

const EmailTestHackathonPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🐛 Hackathon Email Debug Center
          </h1>
          <p className="text-gray-600">
            Comprehensive testing for hackathon status update emails
          </p>
        </div>
        
        <EmailTestHackathon />
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">📚 Debugging Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-800 mb-2">✅ When Emails Work:</h3>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>You receive test emails within 1-2 minutes</li>
                <li>Console shows "Email sent successfully"</li>
                <li>No errors in Supabase function logs</li>
                <li>SendGrid dashboard shows successful delivery</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-800 mb-2">❌ When Emails Don't Work:</h3>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Check browser console for error messages</li>
                <li>Verify SENDGRID_API_KEY in Supabase settings</li>
                <li>Check spam/junk folder</li>
                <li>Review Supabase function logs</li>
                <li>Verify SendGrid account status</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🔧 Quick Fixes:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Go to Supabase Dashboard → Settings → Environment Variables</li>
              <li>Ensure SENDGRID_API_KEY and FROM_EMAIL are set</li>
              <li>Test with a different email address (not Gmail)</li>
              <li>Check SendGrid API key permissions</li>
              <li>Verify your domain isn't blacklisted</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestHackathonPage;
