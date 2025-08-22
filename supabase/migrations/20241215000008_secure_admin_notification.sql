-- Recreate create_admin_notification as SECURITY DEFINER to bypass RLS on admin_notifications
-- Ensures trigger can insert notifications even when caller is not an admin

CREATE OR REPLACE FUNCTION public.create_admin_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Ensure function is owned by postgres so it bypasses RLS
ALTER FUNCTION public.create_admin_notification() OWNER TO postgres;

-- (Optional hardening) Do not expose execution to PUBLIC
REVOKE ALL ON FUNCTION public.create_admin_notification() FROM PUBLIC;
