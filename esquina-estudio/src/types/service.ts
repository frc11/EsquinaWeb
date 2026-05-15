export interface Service {
  _id: string;
  title: string;
  description: string;
  items: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery?: any[];
}
