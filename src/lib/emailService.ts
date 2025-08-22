import { supabase } from './supabase'

export interface EmailData {
  type: 'hackathon_registration' | 'hackathon_status_update' | 'incubation_application' | 'incubation_status_update'
  email: string
  name?: string
  formData?: Record<string, unknown>
  [key: string]: unknown
}

export interface HackathonData {
  title: string
  [key: string]: unknown
}

export interface UserData {
  email: string
  full_name?: string
  [key: string]: unknown
}

export interface FormData {
  [key: string]: unknown
}

export class EmailService {
  private static edgeFunctionUrl: string

  static async initialize() {
    // Get the Edge Function URL from environment or construct it
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ysxtcljsclkoatngtihl.supabase.co'
    this.edgeFunctionUrl = `${supabaseUrl}/functions/v1/email-service`
  }

  static async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // Initialize if not already done
      if (!this.edgeFunctionUrl) {
        await this.initialize()
      }

      // Get the anon key from the Supabase client
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return { success: result.success, error: result.error }
    } catch (error) {
      console.error('Email service error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  static async sendHackathonRegistrationConfirmation(hackathon: HackathonData, user: UserData, formData: FormData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      type: 'hackathon_registration',
      email: user.email,
      name: user.full_name || user.email?.split('@')[0],
      formData: formData,
      hackathon_title: hackathon.title
    })
  }

  static async sendHackathonStatusUpdate(hackathon: HackathonData, user: UserData, oldStatus: string, newStatus: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      type: 'hackathon_status_update',
      email: user.email,
      full_name: user.full_name,
      oldStatus: oldStatus,
      newStatus: newStatus,
      hackathon_title: hackathon.title
    })
  }

  static async sendIncubationApplicationConfirmation(program: HackathonData, user: UserData, formData: FormData): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      type: 'incubation_application',
      email: user.email,
      founder_name: formData.founder_name || user.full_name,
      startup_name: formData.startup_name,
      phone: formData.phone,
      industry: formData.industry,
      stage: formData.stage,
      team_size: formData.team_size,
      program_title: program.title
    })
  }

  static async sendIncubationStatusUpdate(program: HackathonData, user: UserData, oldStatus: string, newStatus: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      type: 'incubation_status_update',
      email: user.email,
      founder_name: user.full_name, // Assuming full_name is the correct field for founder_name in this context
      startup_name: user.startup_name, // Assuming startup_name is the correct field for startup_name in this context
      oldStatus: oldStatus,
      newStatus: newStatus,
      program_title: program.title
    })
  }

  // Legacy methods for backward compatibility
  static async sendRegistrationConfirmation(hackathon: HackathonData, user: UserData): Promise<{ success: boolean; error?: string }> {
    return this.sendHackathonRegistrationConfirmation(hackathon, user, {})
  }

  static async sendStatusUpdate(hackathon: HackathonData, user: UserData, oldStatus: string, newStatus: string): Promise<{ success: boolean; error?: string }> {
    return this.sendHackathonStatusUpdate(hackathon, user, oldStatus, newStatus)
  }
}

// Initialize the service when the module is imported
EmailService.initialize().catch(console.error)
