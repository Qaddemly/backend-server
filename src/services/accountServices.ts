import { AccountRepository } from '../Repository/accountRepository';
import { FollowBusiness } from '../entity/FollowBusiness';
import { BusinessRepository } from '../Repository/businessRepository';
import { FollowBusinessRepository } from '../Repository/followBusinessRepository';

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

    if (checkFollowBusiness) {
        throw new Error('Business already followed');
    }
    console.log(checkFollowBusiness);

    const followBusiness = new FollowBusiness();
    followBusiness.account = account;
    followBusiness.business = business;
    return FollowBusinessRepository.save(followBusiness);
};
