import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseUtil } from '../common/utils/response.util';
import { DashboardQueryDto } from './dto/dashboard-response.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  async getDashboardData(
    @CurrentUser() user: any,
    @Query() query: DashboardQueryDto
  ) {
    const data = await this.dashboardService.getDashboardData(
      user.id,
      query.startDate,
      query.endDate
    );
    return ResponseUtil.success(
      data, 
      'Dashboard data retrieved successfully'
    );
  }

  @Get('stats')
  async getStats(
    @CurrentUser() user: any,
    @Query() query: DashboardQueryDto
  ) {
    const data = await this.dashboardService.getDashboardData(
      user.id,
      query.startDate,
      query.endDate
    );
    return ResponseUtil.success(
      data, 
      'Dashboard statistics retrieved successfully'
    );
  }
}