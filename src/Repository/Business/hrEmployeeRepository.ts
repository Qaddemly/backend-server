import { Repository } from 'typeorm';
import { HrEmployee } from '../../entity/Business/HrEmployee';
import { AppDataSource } from '../../data-source';
import { HrRole } from '../../enums/HrRole';

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
                roles: roles,
            })
            .getMany();
        return HrBusinesses.length !== 0;
    }
    async checkIfUserHasRoleInBusiness(accountId: number, businessId: number) {
        const res = await this.query(
            `SELECT * FROM hr_employee WHERE account_id = ${accountId} AND business_id = ${businessId}`,
        );

        return res.length !== 0;
    }
    async updateRole(accountId: number, businessId: number, role: HrRole) {
        const res = await this.query(
            `UPDATE hr_employee
             SET role = '${role}'
             WHERE account_id = ${accountId}
               AND business_id = ${businessId}`,
        );
        return res[1];
    }
    async deleteRole(accountId: number, businessId: number) {
        const res = await this.query(
            `DELETE FROM hr_employee
             WHERE account_id = ${accountId}
               AND business_id = ${businessId}`,
        );
        return res[1];
    }
    async getRole(accountId: number, businessId: number) {
        const role = await this.query(
            `SELECT role FROM hr_employee
             WHERE account_id = ${accountId}
               AND business_id = ${businessId}`,
        );
        if (role.length === 0) {
            return null;
        }
        return role[0].role;
    }
    async getAllHrOfBusiness(businessId: number) {
        return await this.query(
            `SELECT account.id AS account_id,
                    account.email AS account_email,
                    account.first_name AS account_first_name,
                    account.last_name AS account_last_name,
                    account.profile_picture AS account_profile_picture,
                    hr_employee.role AS role,
                    hr_employee.created_at AS created_at,
                    hr_employee.updated_at AS updated_at
                FROM hr_employee JOIN account ON (hr_employee.account_id = account.id AND business_id = ${businessId})`,
        );
    }
}

export const HrEmployeeRepository = AppDataSource.getRepository(
    HrEmployee,
).extend(HrEmployeeRepositoryClass.prototype);
