import { ObjectId } from 'mongodb';

export interface findById {
  _id: string | ObjectId;
  select?: string[];
}
