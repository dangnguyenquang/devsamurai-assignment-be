import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ContactType } from '@prisma/client';
import { startOfDay, endOfDay, subDays, format, parseISO } from 'date-fns';

@Injectable()
export class ContactsService {
  constructor(private database: DatabaseService) {}

  async getNewContactsByDay(userId: string, startDate?: string, endDate?: string) {
    let start: Date;
    let end: Date;

    if (startDate && endDate) {
      start = parseISO(startDate);
      end = parseISO(endDate);
    } else if (startDate) {
      start = parseISO(startDate);
      end = new Date(); 
    } else if (endDate) {
      end = parseISO(endDate);
      start = subDays(end, 30); 
    } else {
      end = new Date();
      start = subDays(end, 30);
    }

    if (start > end) {
      [start, end] = [end, start];
    }

    const contacts = await this.database.contact.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay(start),
          lte: endOfDay(end),
        },
      },
      select: {
        type: true,
        createdAt: true,
      },
    });

    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const groupedByDay: Record<string, { people: number; companies: number }> = {};

    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = format(date, 'yyyy-MM-dd');
      groupedByDay[dateStr] = { people: 0, companies: 0 };
    }

    contacts.forEach((contact) => {
      const dateStr = format(contact.createdAt, 'yyyy-MM-dd');
      if (groupedByDay[dateStr]) {
        if (contact.type === ContactType.PERSON) {
          groupedByDay[dateStr].people++;
        } else {
          groupedByDay[dateStr].companies++;
        }
      }
    });

    return Object.entries(groupedByDay)
      .map(([date, counts]) => ({
        date,
        people: counts.people,
        companies: counts.companies,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getMostVisitedContacts(userId: string, limit: number = 6, startDate?: string, endDate?: string) {
    const visitWhereClause: any = { userId };
    
    if (startDate || endDate) {
      visitWhereClause.visitedAt = {};
      
      if (startDate) {
        visitWhereClause.visitedAt.gte = startOfDay(parseISO(startDate));
      }
      
      if (endDate) {
        visitWhereClause.visitedAt.lte = endOfDay(parseISO(endDate));
      }
    }

    const contacts = await this.database.contact.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        visits: {
          where: visitWhereClause,
          select: {
            id: true,
          },
        },
      },
    });

    const contactsWithCounts = contacts
      .map((contact) => ({
        name: contact.name,
        visitCount: contact.visits.length,
        avatarUrl: contact.avatarUrl,
      }))
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, limit);

    return contactsWithCounts;
  }

  async getLeastVisitedContacts(userId: string, limit: number = 6, startDate?: string, endDate?: string) {
    const visitWhereClause: any = { userId };
    
    if (startDate || endDate) {
      visitWhereClause.visitedAt = {};
      
      if (startDate) {
        visitWhereClause.visitedAt.gte = startOfDay(parseISO(startDate));
      }
      
      if (endDate) {
        visitWhereClause.visitedAt.lte = endOfDay(parseISO(endDate));
      }
    }

    const contacts = await this.database.contact.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        visits: {
          where: visitWhereClause,
          select: {
            id: true,
          },
        },
      },
    });

    const contactsWithCounts = contacts
      .map((contact) => ({
        name: contact.name,
        visitCount: contact.visits.length,
        avatarUrl: contact.avatarUrl,
      }))
      .sort((a, b) => a.visitCount - b.visitCount)
      .slice(0, limit);

    return contactsWithCounts;
  }
}