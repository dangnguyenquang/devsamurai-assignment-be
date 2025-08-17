import { Injectable } from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private contactsService: ContactsService) {}

  async getDashboardData(userId: string, startDate?: string, endDate?: string): Promise<DashboardResponseDto> {
    const [newContactsByDay, mostVisitedContacts, leastVisitedContacts] = await Promise.all([
      this.contactsService.getNewContactsByDay(userId, startDate, endDate),
      this.contactsService.getMostVisitedContacts(userId, 6, startDate, endDate),
      this.contactsService.getLeastVisitedContacts(userId, 6, startDate, endDate),
    ]);

    return {
      newContactsByDay,
      mostVisitedContacts,
      leastVisitedContacts,
    };
  }
}