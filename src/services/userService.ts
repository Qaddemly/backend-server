import { Request } from 'express';
import catchAsync from 'express-async-handler';
import AppError from '../utils/appError';
import { ExperienceRepository } from '../Repository/experineceRepository';
import { updateExperienceData } from '../types/documentTypes';
import { Experience } from '../entity/Experience';
import { AccountRepository } from '../Repository/accountRepository';
import { Account } from '../entity/Account';
import AccountTempData from '../models/accountModel';

export const updateUserOneExperienceService = async (req: Request) => {
    const userId = req.user.id;
    const experienceId = Number(req.params.id);
    let {
        jobTitle,
        employmentType,
        companyName,
        location,
        locationType,
        stillWorking,
        startDate,
        endDate,
    } = req.body;

    if (stillWorking === true) {
        endDate = null;
    }

    const updateData: updateExperienceData = {
        job_title: jobTitle,
        employment_type: employmentType,
        company_name: companyName,
        location: location,
        location_type: locationType,
        still_working: stillWorking,
        start_date: startDate,
        end_date: endDate,
    };
    const experience = await ExperienceRepository.updateOneExperience(
        experienceId,
        userId,
        updateData,
    );
    if (!experience) {
        throw new AppError('No experience found with that ID', 404);
    }
    return experience;
};

export const createUserOneExperienceService = async (req: Request) => {
    const userId = Number(req.user.id);

    let {
        jobTitle,
        employmentType,
        companyName,
        location,
        locationType,
        stillWorking,
        startDate,
        endDate,
    } = req.body;

    const user = await AccountRepository.findOneBy({ id: userId });
    const experience = new Experience();
    experience.account = user;
    experience.job_title = jobTitle;
    experience.employment_type = employmentType;
    experience.company_name = companyName;
    experience.location = location;
    experience.location_type = locationType;
    experience.still_working = stillWorking;
    experience.start_date = startDate;
    experience.end_date = endDate;

    const createdExperience = await ExperienceRepository.save(experience);
    delete createdExperience.account;
    const experienceReturned: { [key: string]: any } = { ...createdExperience };
    experienceReturned.accountId = userId;
    return experienceReturned;
};

export const deleteUserOneExperienceService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const experienceId = Number(req.params.id);
        const experience = await ExperienceRepository.findOneBy({
            account: { id: userId },
            id: experienceId,
        });
        if (!experience) {
            throw new AppError('No experience found with that ID', 404);
        }
        await ExperienceRepository.remove(experience);
    } catch (err) {
        throw err;
    }
};

export const deleteMeService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        await AccountRepository.delete({ id: userId });
        await AccountTempData.deleteOne({ accountId: userId });
    } catch (err) {
        throw err;
    }
};
