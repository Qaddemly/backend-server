import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { AccountCertificate } from '../../entity/Account/AccountCertificate';
import { createCertificateDto } from '../../dtos/certificateDto';

class CertificateRepositoryClass extends Repository<AccountCertificate> {
    async createNewCertificate(
        account_id: number,
        createCertificateDto: createCertificateDto,
    ) {
        const result = await this.query(
            `insert into account_certificate (account_id,title,issuing_organization,start_date,end_date,media) values (${account_id},'${createCertificateDto.title}','${createCertificateDto.issuing_organization}','${createCertificateDto.start_date}','${createCertificateDto.end_date}','${createCertificateDto.media}') returning *`,
        );
        return result[0];
    }
    async updateOneCertificate(
        certificateId: number,
        updateCertificateDto: { [key: string]: any },
        accountId: number,
    ) {
        const result = await this.createQueryBuilder()
            .update(AccountCertificate)
            .set(updateCertificateDto)
            .where('account_id = :accountId', { accountId })
            .andWhere('id = :certificateId', { certificateId })
            .returning('*')
            .execute();
        return result.raw[0];
    }
    async getOneCertificate(certificateId: number) {
        const result = await this.query(
            `select * from account_certificate where id =${certificateId}`,
        );
        return result[0];
    }
    async getAllCertificatesByAccountId(accountId: number) {
        const result = await this.query(
            `select * from account_certificate where account_id = ${accountId}`,
        );
        return result;
    }
}

export const CertificateRepository = AppDataSource.getRepository(
    AccountCertificate,
).extend(CertificateRepositoryClass.prototype);
