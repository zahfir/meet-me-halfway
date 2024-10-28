export type OverpassResponse = {
  center: { lat: number; lon: number };
  tags: OverpassTags;
};

export type OverpassTags = {
  name: string;
  [key: string]: string;
};
