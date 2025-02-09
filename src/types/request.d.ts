import { Request } from 'express';
import { HrRole } from '../enums/HrRole';

export interface HrDashboardUserInfo {
    toBeProcessedUserId?: number;
    authenticatedUserRole?: HrRole;
}
