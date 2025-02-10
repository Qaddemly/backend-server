import { AppDataSource } from '../data-source';
import { PublicObject } from '../types/types';

export const insertValuesInToOneToManyRelationsWithAccount = async (
    account_id: number,
    entity: any,
    data: PublicObject[] | string[],
) => {
    const result = await AppDataSource.createQueryBuilder()
        .insert()
        .into(entity)
        .values(
            data.map((d) => ({
                account: { id: account_id },
                ...d,
            })),
        )
        .returning('*')
        .execute();
    return result.raw;
};
