// Add these lines to your queries.ts file

export interface Design {
  id: string;
  designId: string;
  owner: string;
  title: string;
}

export interface GetDesigns {
  designs: Design[];
}

export interface GetMyEntitiesVariables {
  first: number;
}
