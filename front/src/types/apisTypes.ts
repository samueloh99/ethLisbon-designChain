export interface DesignProps {
  content: {
    reward: string;
    description: string;
    title: string;
  };
  cid: string;
  id: string;
  designId: string;
  image: {
    name: string;
    content: string;
  };
  owner: string;
}

interface ProfileStats {
  totalFollowers: number;
  totalFollowing: number;
  totalPosts: number;
  totalComments: number;
  totalMirrors: number;
  totalPublications: number;
  totalCollects: number;
  __typename: string;
}

export interface LensProfile {
  id: string;
  name: string | null;
  bio: string | null;
  isDefault: boolean;
  attributes: any[];
  followNftAddress: string | null;
  metadata: string | null;
  handle: string;
  picture: string | null;
  coverPicture: string | null;
  ownedBy: string;
  dispatcher: string | null;
  stats: ProfileStats;
  followModule: string | null;
  __typename: string;
}
