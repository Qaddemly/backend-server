import { AccountRepository } from '../Repository/Account/accountRepository';
import { FollowBusiness } from '../entity/General/FollowBusiness';
import { BusinessRepository } from '../Repository/Business/businessRepository';
import { FollowBusinessRepository } from '../Repository/General/followBusinessRepository';

export const followBusiness = async (accountId: number, businessId: number) => {
    const account = await AccountRepository.findOneBy({ id: accountId });
    if (!account) {
        throw new Error('Account not found');
    }
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        throw new Error('Business not found');
    }
    const checkFollowBusiness =
        await FollowBusinessRepository.checkIfUserFollowBusiness(
            accountId,
            businessId,
        );

    console.log(checkFollowBusiness);

    if (checkFollowBusiness) {
        throw new Error('Business already followed');
    }

    const followBusiness = new FollowBusiness();
    followBusiness.account = account;
    followBusiness.business = business;
    return FollowBusinessRepository.save(followBusiness);
};

export const getFollowedBusinesses = async (accountId: number) => {
    return await FollowBusinessRepository.getFollowedBusinesses(accountId);
};

export const unfollowBusiness = async (
    accountId: number,
    businessId: number,
) => {
    const account = await AccountRepository.findOneBy({ id: accountId });
    if (!account) {
        throw new Error('Account not found');
    }
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        throw new Error('Business not found');
    }
    const checkFollowBusiness =
        await FollowBusinessRepository.checkIfUserFollowBusiness(
            accountId,
            businessId,
        );

    console.log(checkFollowBusiness);

    if (!checkFollowBusiness) {
        throw new Error('Business not followed');
    }

    return await FollowBusinessRepository.unfollowBusiness(
        accountId,
        businessId,
    );
};

export const getNumberOfUsersService = async () => {
    const count =
        await AccountRepository.createQueryBuilder('account').getCount();
    return count;
};

export const getAllUserInformationForAI = async (accountId:number) => {
    const { password, password_changed_at, is_activated, ...user } =
        await AccountRepository.createQueryBuilder('account')
            .leftJoinAndSelect('account.skills', 'skills')
            .leftJoinAndSelect('account.languages', 'languages')
            .leftJoinAndSelect('account.certificates', 'certificates')
            .leftJoinAndSelect('account.educations', 'educations')
            .leftJoinAndSelect('account.experiences', 'experiences')
            .leftJoinAndSelect('account.projects', 'projects')
            .where('account.id = :id', { id: accountId })
            .getOne();

    return user;
};