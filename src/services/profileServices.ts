import { Request } from 'express';
import catchAsync from 'express-async-handler';
import AppError from '../utils/appError';
import { ExperienceRepository } from '../Repository/experineceRepository';
import { updateExperienceData } from '../types/documentTypes';
import { Experience } from '../entity/Experience';
import { AccountRepository } from '../Repository/accountRepository';
import { Account } from '../entity/Account';
import AccountTempData from '../models/accountModel';
import { Skill } from '../entity/Skill';
import { SkillRepository } from '../Repository/skillRepository';
import { Language } from '../entity/Language';
import { LanguageRepository } from '../Repository/languageRepository';
import { EducationRepository } from '../Repository/educationRepository';
import { Education } from '../entity/Education';
import { Resume } from '../entity/Resume';
import { ResumeRepository } from '../Repository/resumeRepository';
import fs from 'fs';
import path from 'path';

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

export const updateUserOneEducationService = async (req: Request) => {
    const userId = req.user.id;
    const education = await EducationRepository.findOneBy({
        account_id: userId,
    });
    if (!education) {
        throw new AppError('user don`t have education', 404);
    }

    let {
        university,

        field_of_study,

        gpa,

        start_date,

        end_date,
    } = req.body;

    const updatedData = {
        university,

        field_of_study,

        gpa,

        start_date,

        end_date,
    };
    const updatedEducation = await EducationRepository.updateEducation(
        updatedData,
        userId,
    );
    return updatedEducation;
};

export const createUserOneEducationService = async (req: Request) => {
    const userId = Number(req.user.id);

    const foundedEducation = await EducationRepository.findOneBy({
        account_id: userId,
    });
    if (foundedEducation) {
        throw new AppError('user already has education', 409);
    }
    let {
        university,

        field_of_study,

        gpa,

        start_date,

        end_date,
    } = req.body;

    const user = await AccountRepository.findOneBy({ id: userId });
    const education = new Education();
    education.account_id = userId;
    education.gpa = gpa;
    education.university = university;
    education.field_of_study = field_of_study;
    education.start_date = start_date;
    education.end_date = end_date;
    const createdEducation = await EducationRepository.save(education);
    return createdEducation;
};

export const deleteUserOneEducationService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const educationId = Number(req.params.id);
        const education = await EducationRepository.findOneBy({
            account_id: userId,
        });
        if (!education) {
            throw new AppError('user don`t have education', 404);
        }
        await EducationRepository.remove(education);
    } catch (err) {
        throw err;
    }
};

export const createUserOneSkillService = async (req: Request) => {
    const userId = Number(req.user.id);

    let { name } = req.body;

    const user = await AccountRepository.findOneBy({ id: userId });
    const skill = new Skill();
    skill.account = user;
    skill.name = name;

    const createdSkill = await SkillRepository.save(skill);
    delete createdSkill.account;
    const SkillReturned: { [key: string]: any } = { ...createdSkill };
    SkillReturned.accountId = userId;
    return SkillReturned;
};

export const deleteUserOneSkillService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const skillId = Number(req.params.id);
        const skill = await SkillRepository.findOneBy({
            account: { id: userId },
            id: skillId,
        });
        if (!skill) {
            throw new AppError('No skill found with that ID', 404);
        }
        await SkillRepository.remove(skill);
    } catch (err) {
        throw err;
    }
};

export const createUserOneLanguageService = async (req: Request) => {
    const userId = Number(req.user.id);

    let { name } = req.body;

    const user = await AccountRepository.findOneBy({ id: userId });
    const language = new Language();
    language.account = user;
    language.name = name;

    const createdLanguage = await LanguageRepository.save(language);
    delete createdLanguage.account;
    const LanguageReturned: { [key: string]: any } = { ...createdLanguage };
    LanguageReturned.accountId = userId;
    return LanguageReturned;
};

export const deleteUserOneLanguageService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const languageId = Number(req.params.id);
        const language = await LanguageRepository.findOneBy({
            account: { id: userId },
            id: languageId,
        });
        if (!language) {
            throw new AppError('No language found with that ID', 404);
        }
        await LanguageRepository.remove(language);
    } catch (err) {
        throw err;
    }
};

export const addUserOneResumeService = async (req: Request) => {
    const userId = Number(req.user.id);

    let { resumes } = req.body;
    if (!resumes) {
        throw new AppError('No resumes provided', 400);
    }

    const user = await AccountRepository.findOneBy({ id: userId });
    const newResume = new Resume();
    newResume.account = user;
    newResume.url = resumes;

    const createdResume = await ResumeRepository.save(newResume);
    delete createdResume.account;
    const ResumeReturned: { [key: string]: any } = { ...createdResume };
    ResumeReturned.accountId = userId;
    return ResumeReturned;
};

export const deleteUserOneResumeService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const resumeId = Number(req.params.id);
        const resume = await ResumeRepository.findOneBy({
            account: { id: userId },
            id: resumeId,
        });
        if (!resume) {
            throw new AppError('No resume found with that ID', 404);
        }

        await ResumeRepository.remove(resume);
        // const startIndex = resume.url.indexOf('/uploads');

        // const result = resume.url.substring(startIndex, -1);
        // console.log(result);
        // const rootPath = path.resolve(__dirname, '../');
        // const resumePath = `src/${result}`;
        // await fs.unlink(resumePath, (c) => {
        //     console.log(c);
        // });
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

export const updateAccountBasicInfoService = async (req: Request) => {
    const {
        address,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        profile_picture,
    } = req.body;
    const userId = req.user.id;
    const updatedData = {
        address,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        profile_picture,
    };
    const updatedUser = await AccountRepository.updateUserBasicInfo(
        updatedData,
        userId,
    );
    return updatedUser;
};
