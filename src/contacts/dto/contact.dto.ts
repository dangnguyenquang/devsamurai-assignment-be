import { ContactType } from '@prisma/client';

export interface ContactDto {
  id: string;
  name: string;
  type: ContactType;
  avatarUrl: string;
  visitCount: number;
  createdAt: Date;
  updatedAt: Date;
}