import { Request } from 'express';
import { HrRole } from '../enums/HrRole';

export interface HrDashboardUserInfo {
    toBeProcessedUserId?: number;
    role?: HrRole;
}
export type RequestWithHrDashboard = Request & {
    hrDashboardUserInfo?: HrDashboardUserInfo;
};
