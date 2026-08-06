/**
 * Password hashing — PRD §21 forbids storing passwords in plain text.
 *
 * bcrypt rather than a bare SHA: it is deliberately slow and salts every hash,
 * so two admins choosing the same password still get different rows and an
 * offline attack on a leaked dump stays expensive.
 */
import "server-only";

import bcrypt from "bcryptjs";

/**
 * 12 rounds ≈ 250ms on the hardware Vercel gives a serverless function. Slow
 * enough to be a real cost to an attacker, fast enough that a login does not
 * feel broken.
 */
const COST = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * A bcrypt comparison against a throwaway hash.
 *
 * Called when the submitted email matches no account, so that the response
 * takes about as long as a real password check. Without it, "unknown email"
 * returns in microseconds while "wrong password" takes ~250ms, and that gap
 * alone tells an attacker which emails are registered.
 *
 * The hash below must be a real, well-formed bcrypt digest: measured on this
 * machine, comparing against a malformed one returns in 0ms and burns nothing,
 * while this one costs the same ~250ms as a genuine check. It hashes a fixed
 * throwaway string and guards nothing, so it is not a secret.
 */
const TIMING_DECOY_HASH =
  "$2b$12$djBeEngzJTGNccX0r88wW.23SQbEux1XyLmY83q8Y8K3eqgqMWfXq";

export async function burnTimingBudget(): Promise<void> {
  await bcrypt.compare("tidak-ada-akun-dengan-email-ini", TIMING_DECOY_HASH);
}
