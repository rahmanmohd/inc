-- Make create_admin_notification robust across tables by using JSON accessors
-- Avoid direct references to columns that may not exist on every table

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
    COALESCE(
      to_jsonb(NEW)->>'contact_name',
      to_jsonb(NEW)->>'founder_name',
      to_jsonb(NEW)->>'applicant_name',
      'Unknown'
    ),
    COALESCE(
      to_jsonb(NEW)->>'startup_name',
      to_jsonb(NEW)->>'company_name',
      'N/A'
    ),
    'New ' || TG_TABLE_NAME || ' application submitted',
    'high'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
