import { IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export interface ContactStatsDto {
  name: string;
  visitCount: number;
  avatarUrl: string;
}

export interface DailyContactsDto {
  date: string;
  people: number;
  companies: number;
}

export interface DashboardResponseDto {
  newContactsByDay: DailyContactsDto[];
  mostVisitedContacts: ContactStatsDto[];
  leastVisitedContacts: ContactStatsDto[];
}

export class DashboardQueryDto {
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : value;
    }
    return value;
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : value;
    }
    return value;
  })
  endDate?: string;
}