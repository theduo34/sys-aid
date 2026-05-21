-- Stores a one-way SHA-256 hash of each OTP code at the moment it is
-- successfully verified. The plain-text code is never stored.
-- Even if this table is fully compromised, the codes cannot be recovered.

CREATE TABLE public.verification_codes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        NOT NULL,
  code_hash   text        NOT NULL,   -- SHA-256(code || email) — irreversible
  verified_at timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_verification_codes_email ON public.verification_codes(email);

-- RLS enabled with no policies: only the service-role key (used by API routes)
-- can read or write this table. No client-side access whatsoever.
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
