import releases from "./archive-releases.json";

export interface ArchivedRelease {
  id: string;
  title: string;
  releasedAt: string;
  description: string;
  sourceTag: string;
}

/**
 * Immutable portfolio releases that have been published to the static archive.
 * Add an entry only after its snapshot has been written to `archive-static/<id>`.
 */
export const archivedReleases: readonly ArchivedRelease[] = releases;
