import { supabase } from '../lib/supabase';

export interface EmailRequest {
  type: string;
  email: string;
  name?: string;
  formData?: any;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: any;
}

class EmailService {
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      console.log('EmailService: Sending email request:', request);
      
      const { data, error } = await supabase.functions.invoke('send-hackathon-email', {
        body: request
      });

      console.log('EmailService: Supabase response:', { data, error });

      if (error) {
        console.error('EmailService: Error from Supabase:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('EmailService: Email sent successfully');
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('EmailService: Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Specific email methods for different form types
  async sendHackathonRegistrationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'hackathon_registration',
      email,
      name,
      formData
    });
  }

  async sendIncubationApplicationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'incubation_application',
      email,
      name,
      formData
    });
  }

  async sendInvestmentApplicationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'investment_application',
      email,
      name,
      formData
    });
  }

  async sendProgramApplicationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'program_application',
      email,
      name,
      formData
    });
  }

  async sendMentorApplicationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'mentor_application',
      email,
      name,
      formData
    });
  }

  async sendConsultationRequestEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'consultation_request',
      email,
      name,
      formData
    });
  }

  async sendStatusUpdateEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'status_update',
      email,
      name,
      formData
    });
  }

  async sendContactFormEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'contact_form',
      email,
      name,
      formData
    });
  }

  async sendGrantApplicationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'grant_application',
      email,
      name,
      formData
    });
  }

  async sendPartnershipRequestEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'partnership_request',
      email,
      name,
      formData
    });
  }

  async sendRegistrationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'registration',
      email,
      name,
      formData
    });
  }

  async sendCofounderPostEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'cofounder_post',
      email,
      name,
      formData
    });
  }

  async sendDealApplicationEmail(email: string, name: string, formData: any): Promise<EmailResponse> {
    return this.sendEmail({
      type: 'deal_application',
      email,
      name,
      formData
    });
  }
}

export default new EmailService();
