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
