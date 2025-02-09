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

export const createUserOneOrMoreSkillService = async (req: Request) => {
    const userId = Number(req.user.id);

    let { skills } = req.body;

    const newSkills = await SkillRepository.createQueryBuilder()
        .insert()
        .into(Skill)
        .values(skills.map((name) => ({ account: { id: userId }, name })))
        .returning('*')
        .execute();

    // const createdSkill = await SkillRepository.save(skill);
    // delete createdSkill.account;
    // const SkillReturned: { [key: string]: any } = { ...createdSkill };
    // SkillReturned.accountId = userId;
    return newSkills.raw;
};

export const deleteUserOneOrMoreSkillService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const { skillsId } = req.body;
        const foundedSkills = await SkillRepository.query(`
            select * from skill where id in (${skillsId.map((skill) => `${skill}`).join(', ')}) and account_id=${userId}  `);
        if (foundedSkills.length != skillsId.length) {
            throw new AppError('error while deleting skills', 400);
        }
        await SkillRepository.remove(foundedSkills);
    } catch (err) {
        throw err;
    }
};

export const createUserOneOrMoreLanguageService = async (req: Request) => {
    const userId = Number(req.user.id);

    let { languages } = req.body;
    console.log(`select * from language where
        name in (${languages.map((lang) => `${lang}`).join(', ')}) and account_id=${userId}  `);
    const foundedLanguages =
        await LanguageRepository.query(`select * from language where
        name in (${languages.map((lang) => `'${lang}'`).join(', ')}) and account_id=${userId}  `);
    if (foundedLanguages.length != 0) {
        throw new AppError('some languages already added', 400);
    }
    const newLanguages = await LanguageRepository.createQueryBuilder()
        .insert()
        .into(Language)
        .values(languages.map((name) => ({ account: { id: userId }, name })))
        .returning('*')
        .execute();

    return newLanguages.raw;
};

export const deleteUserOneOrMoreLanguageService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const { languagesId } = req.body;
        const foundedLanguages = await LanguageRepository.query(`
            select * from language where id in (${languagesId.map((lang) => `${lang}`).join(', ')}) and account_id=${userId}  `);
        if (foundedLanguages.length != languagesId.length) {
            throw new AppError('error while deleting languages', 400);
        }
        await LanguageRepository.remove(foundedLanguages);
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
    newResume.url = resumes[0].url;
    newResume.name = resumes[0].name;
    newResume.size = resumes[0].size;

    const createdResume = await ResumeRepository.save(newResume);
    delete createdResume.account;
    const ResumeReturned: { [key: string]: any } = { ...createdResume };
    ResumeReturned.accountId = userId;
    return ResumeReturned;
};

export const getAllUserResumesService = async (req: Request) => {
    const userId = Number(req.user.id);
    const resumes = await ResumeRepository.find({
        where: { account: { id: userId } },
    });
    return resumes;
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
        const startIndex = resume.url.indexOf('/uploads');

        const result = resume.url.substring(startIndex, resume.url.length);
        const resumePath = `src${result}`;
        console.log(resumePath);
        fs.unlink(resumePath, (c) => {
            // console.log(c);
        });
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
    const returnedUser = { ...updatedUser };
    (returnedUser as Account).address = {
        country: updatedUser.country,
        city: updatedUser.city,
    };
    delete returnedUser.country;
    delete returnedUser.city;
    (returnedUser as Account).phone = {
        country_code: updatedUser.country_code,
        number: updatedUser.number,
    };
    delete returnedUser.country_code;
    delete returnedUser.number;

    return returnedUser;
};
