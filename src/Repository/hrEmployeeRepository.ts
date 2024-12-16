import { Repository } from 'typeorm';
import { HrEmployee } from '../entity/HrEmployee';
import { AppDataSource } from '../data-source';
import { HrRole } from '../enums/HrRole';

class HrEmployeeRepositoryClass extends Repository<HrEmployee> {
    async checkPermission(
        accountId: number,
        businessId: number,
        roles: HrRole[],
    ): Promise<boolean> {
        const HrBusinesses = await this.createQueryBuilder('hr_employee')
            .where('hr_employee.account = :account', { account: accountId })
            .andWhere('hr_employee.business = :business', {
                business: businessId,
            })
            .andWhere('hr_employee.role IN (:...roles)', {
                roles: [HrRole.OWNER, HrRole.SUPER_ADMIN],
            })
            .getMany();
        return HrBusinesses.length !== 0;
    }
    async checkIfUserHasRoleInBusiness(accountId: number, businessId: number) {
        return await this.query(
            `SELECT * FROM hr_employee WHERE account_id = ${accountId} AND business_id = ${businessId}`,
        );
    }
}

export const HrEmployeeRepository = AppDataSource.getRepository(
    HrEmployee,
).extend(HrEmployeeRepositoryClass.prototype);
