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
