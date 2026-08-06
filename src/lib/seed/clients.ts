import type { Client } from "@/lib/types";

/**
 * Intentionally empty.
 *
 * DesignRHF §21 forbids displaying client names or logos without permission,
 * and PRD §11.9 specifies the fallback: show general trust copy until consent
 * is on record. Leaving this empty means the site ships with the safe default
 * and the empty-state path is what renders.
 *
 * Add entries here (or through the admin panel in round 2) only once the
 * client has agreed to be named.
 */
export const CLIENTS: Client[] = [];

/** Client types RHF has served, safe to show without naming anyone — DesignRHF §21. */
export const CLIENT_TYPES = [
  "Acara Keluarga",
  "Sekolah",
  "Kantor",
  "Rapat Instansi",
  "Dinas",
  "Pengajian",
  "Pelatihan",
];
