export interface SanityImageAsset {
  _id?: string;
  _ref?: string;
  url?: string;
}

export interface SanityImageLike {
  _type?: "image";
  asset?: SanityImageAsset;
  alt?: string;
}

export interface ProjectMediaItem {
  _type: "mediaItem";
  _key?: string;
  file?: SanityImageLike;
  video?: string;
  caption?: string;
}

export interface ProjectDualMedia {
  _type: "dualMedia";
  _key?: string;
  left?: SanityImageLike;
  right?: SanityImageLike;
}

export type ProjectContentBlock =
  | ProjectMediaItem
  | ProjectDualMedia
  // Portable Text and unknown Sanity content blocks.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>;

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  projectNumber: string;
  category: string;
  services: string;
  year: string;
  coverImage: SanityImageLike | string | null;
  coverColor?: string;
  content?: ProjectContentBlock[];
}
