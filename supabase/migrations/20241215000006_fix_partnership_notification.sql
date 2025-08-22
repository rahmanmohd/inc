-- Fix the create_admin_notification function to handle partnership_requests correctly
-- The partnership_requests table uses 'contact_name' instead of 'founder_name'

CREATE OR REPLACE FUNCTION create_admin_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (
    type,
    application_id,
    application_type,
    applicant_name,
    startup_name,
    message,
    priority
  ) VALUES (
    'new_application',
    NEW.id,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_TABLE_NAME = 'partnership_requests' THEN COALESCE(NEW.contact_name, 'Unknown')
      ELSE COALESCE(NEW.founder_name, NEW.applicant_name, 'Unknown')
    END,
    CASE 
      WHEN TG_TABLE_NAME = 'partnership_requests' THEN COALESCE(NEW.company_name, 'N/A')
      ELSE COALESCE(NEW.startup_name, NEW.company_name, 'N/A')
    END,
    'New ' || TG_TABLE_NAME || ' application submitted',
    'high'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
