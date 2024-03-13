/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./utils/lucia").Auth;
  type DatabaseUserAttributes = {
    address: string;
    avatar: string | null;
    cover: string | null;
    username: string | null;
    email: string | null;
    email_to_verify: string | null;
    email_verified: boolean;
    email_verification_token: string | null;
    email_verification_token_expires_at: string | null;
    email_verification_sent_at: string | null;
    email_verified_at: string | null;
  };
  type DatabaseSessionAttributes = {};
}