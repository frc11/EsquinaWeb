export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  projectNumber: string;
  category: string;
  services: string;
  year: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage: any;
  coverColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any[];
}

export interface FunGalleryImage {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  alt?: string;
}
