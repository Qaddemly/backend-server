import { Request } from 'express';
import catchAsync from 'express-async-handler';
import AppError from '../utils/appError';
import { ExperienceRepository } from '../Repository/experineceRepository';
import { updateExperienceData } from '../types/documentTypes';
import { Experience } from '../entity/Experience';

export const updateUserOneExperienceService = async (req: Request) => {
    const userId = Number(req.user.id);
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

    if (stillWorking === true) {
        endDate = null;
    }

    const experience = new Experience();
    experience.account.id = userId;
    experience.job_title = jobTitle;
    experience.employment_type = employmentType;
    experience.company_name = companyName;
    experience.location = location;
    experience.location_type = locationType;
    experience.still_working = stillWorking;
    experience.start_date = startDate;
    experience.end_date = endDate;

    await ExperienceRepository.save(experience);

    return experience;
};
