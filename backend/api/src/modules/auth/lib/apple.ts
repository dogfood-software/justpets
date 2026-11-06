import { importPKCS8, SignJWT } from "jose";

/**
 * Apple requires a JWT signed with the private key for authentication.
 *
 * This JWT must expire within 180 days. As such we generate it in realtime during startup.
 *
 * @see https://developer.apple.com/documentation/signinwithapplerestapi/authenticating_users_with_sign_in_with_apple
 * @see https://developer.apple.com/documentation/accountorganizationaldatasharing/creating-a-client-secret
 * @see https://better-auth.com/docs/authentication/apple
 */
export async function generateAppleClientSecret({
  clientId,
  teamId,
  keyId,
  privateKey,
}: {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}) {
  const key = await importPKCS8(privateKey, "ES256");
  const now = Math.floor(Date.now() / 1000);
  return (
    new SignJWT({})
      .setProtectedHeader({ alg: "ES256", kid: keyId })
      .setIssuer(teamId)
      .setSubject(clientId)
      .setAudience("https://appleid.apple.com")
      .setIssuedAt(now)
      // 180 days, less than 15777000 seconds but not by much
      .setExpirationTime(now + 180 * 24 * 60 * 60)
      .sign(key)
  );
}
