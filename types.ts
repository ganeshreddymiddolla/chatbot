
export type Role = 'user' | 'model';

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  sources?: GroundingSource[];
}
