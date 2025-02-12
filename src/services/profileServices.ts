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

import {
    createProjectDTO,
    createVolunteeringDTO,
    updateProjectDTO,
    updateVolunteeringDTO,
} from '../dtos/userDto';
import { AccountProjectRepository } from '../Repository/accountProjectRepository';
import { AccountProject } from '../entity/AccountProject';
import { AccountVolunteering } from '../entity/AccountVolunteering';
import { AccountVolunteeringRepository } from '../Repository/accountVolunteeringRepository';

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
    const educationId = Number(req.params.id);
    const updatedEducation = await EducationRepository.updateEducation(
        educationId,
        req.body,
        userId,
    );
    if (!updatedEducation) {
        throw new AppError('No education found with that ID', 404);
    }
    return updatedEducation;
};

export const createUserOneEducationService = async (req: Request) => {
    const userId = Number(req.user.id);

    // const foundedEducation = await EducationRepository.findOneBy({
    //     account_id: userId,
    // });
    // if (foundedEducation) {
    //     throw new AppError('user already has education', 409);
    // }
    // let {
    //     university,

    //     field_of_study,

    //     gpa,

    //     start_date,

    //     end_date,
    // } = req.body;

    // const user = await AccountRepository.findOneBy({ id: userId });
    // const education = new Education();
    // // education.account_id = userId;
    // education.gpa = gpa;
    // education.university = university;
    // education.field_of_study = field_of_study;
    // education.start_date = start_date;
    // education.end_date = end_date;
    const createdEducation = await EducationRepository.createOneEducation(
        userId,
        req.body,
    );
    return createdEducation[0];
};

export const deleteUserOneEducationService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const educationId = Number(req.params.id);
        const education = await EducationRepository.findOneBy({
            account: { id: userId },
            id: educationId,
        });
        if (!education) {
            throw new AppError('No education found with that ID', 404);
        }

        await EducationRepository.remove(education);
    } catch (err) {
        throw err;
    }
};

export const createUserOneOrMoreSkillService = async (req: Request) => {
    const userId = Number(req.user.id);
    let { skills } = req.body;
    const newSkills = await SkillRepository.createSkills(userId, skills);
    return newSkills;
};

export const deleteUserOneOrMoreSkillService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const { skillsId } = req.body;
        await SkillRepository.deleteSkills(userId, skillsId);
    } catch (err) {
        throw err;
    }
};

export const createUserOneOrMoreLanguageService = async (req: Request) => {
    const userId = Number(req.user.id);

    let { languages } = req.body;
    const foundedLanguages =
        await LanguageRepository.query(`select * from language where
        name in (${languages.map((lang) => `'${lang}'`).join(', ')}) and account_id=${userId}  `);
    if (foundedLanguages.length != 0) {
        throw new AppError('some languages already added', 400);
    }
    const newLanguages = await LanguageRepository.createLanguages(
        userId,
        languages,
    );

    return newLanguages;
};

export const deleteUserOneOrMoreLanguageService = async (req: Request) => {
    try {
        const userId = Number(req.user.id);
        const { languagesId } = req.body;
        await LanguageRepository.deleteLanguages(userId, languagesId);
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
        links,
        about_me,
        subtitle,
    } = req.body;
    const userId = req.user.id;

    const updatedUser = await AccountRepository.updateUserBasicInfo(
        req.body,
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
/**
 * Phone
 * */

export const createProjectService = async (
    userId: number,
    projectDTO: createProjectDTO,
) => {
    const user = await AccountRepository.findOneBy({ id: userId });
    if (!user) {
        throw new AppError('No user found with that ID', 404);
    }

    const project = new AccountProject();
    project.name = projectDTO.name;
    project.account = { id: userId } as Account;
    if (projectDTO.description) project.description = projectDTO.description;
    if (projectDTO.skills) project.skills = projectDTO.skills;
    if (projectDTO.start_date) project.start_date = projectDTO.start_date;
    if (projectDTO.end_date) project.end_date = projectDTO.end_date;
    if (projectDTO.still_working)
        project.still_working = projectDTO.still_working;
    if (projectDTO.link) project.link = projectDTO.link;
    return await AccountProjectRepository.save(project);
};
export const getProjectByIdService = async (projectId: number) => {
    const project = await AccountProjectRepository.findOneBy({ id: projectId });
    if (!project) {
        throw new AppError('No project found with that ID', 404);
    }
    return project;
};
export const getProjectsOfUserIdService = async (userId: number) => {
    const account = await AccountRepository.findOneBy({ id: userId });
    if (!account) {
        throw new AppError('No user found with that ID', 404);
    }

    return await AccountProjectRepository.find({
        where: { account: { id: userId } },
    });
};
export const getProjectsOfLoggedInUserService = async (userId: number) => {
    return await AccountProjectRepository.find({
        where: { account: { id: userId } },
    });
};
export const updateProjectService = async (
    userId: number,
    projectId: number,
    updateProjectDTO: updateProjectDTO,
) => {
    const project = await AccountProjectRepository.findOneBy({
        account: { id: userId },
        id: projectId,
    });
    if (!project) {
        throw new AppError('No project found with that ID', 404);
    }
    if (updateProjectDTO.name) project.name = updateProjectDTO.name;
    if (updateProjectDTO.description)
        project.description = updateProjectDTO.description;
    if (updateProjectDTO.skills) project.skills = updateProjectDTO.skills;
    if (updateProjectDTO.start_date)
        project.start_date = updateProjectDTO.start_date;
    if (updateProjectDTO.end_date) project.end_date = updateProjectDTO.end_date;
    if (updateProjectDTO.still_working)
        project.still_working = updateProjectDTO.still_working;
    if (updateProjectDTO.link) project.link = updateProjectDTO.link;
    return await AccountProjectRepository.save(project);
};
export const deleteProjectService = async (
    userId: number,
    projectId: number,
) => {
    const project = await AccountProjectRepository.findOneBy({
        account: { id: userId },
        id: projectId,
    });
    if (!project) {
        throw new AppError('No project found with that ID', 404);
    }
    await AccountProjectRepository.remove(project);
};

export const createVolunteeringService = async (
    userId: number,
    createVolunteeringDTO: createVolunteeringDTO,
) => {
    const volunteering = new AccountVolunteering();
    volunteering.account = { id: userId } as Account;
    volunteering.organization = createVolunteeringDTO.organization;
    volunteering.role = createVolunteeringDTO.role;
    if (createVolunteeringDTO.description)
        volunteering.description = createVolunteeringDTO.description;
    if (createVolunteeringDTO.start_date)
        volunteering.start_date = createVolunteeringDTO.start_date;
    if (createVolunteeringDTO.end_date)
        volunteering.end_date = createVolunteeringDTO.end_date;
    return await AccountVolunteeringRepository.save(volunteering);
};
export const getVolunteeringByIdService = async (volunteeringId: number) => {
    const volunteering = await AccountVolunteeringRepository.findOneBy({
        id: volunteeringId,
    });
    if (!volunteering) {
        throw new AppError('No volunteering found with that ID', 404);
    }
    return volunteering;
};
export const getVolunteeringsOfUserByIdService = async (userId: number) => {
    const account = await AccountRepository.findOneBy({ id: userId });
    if (!account) {
        throw new AppError('No user found with that ID', 404);
    }
    return await AccountVolunteeringRepository.find({
        where: { account: { id: userId } },
    });
};
export const getVolunteeringsOfLoggenInUserService = async (userId: number) => {
    return await AccountVolunteeringRepository.find({
        where: { account: { id: userId } },
    });
};
export const updateVolunteeringService = async (
    userId: number,
    volunteeringId: number,
    updateVolunteeringDTO: updateVolunteeringDTO,
) => {
    const volunteering = await AccountVolunteeringRepository.findOneBy({
        account: { id: userId },
        id: volunteeringId,
    });
    if (!volunteering) {
        throw new AppError('No volunteering found with that ID', 404);
    }
    if (updateVolunteeringDTO.organization)
        volunteering.organization = updateVolunteeringDTO.organization;
    if (updateVolunteeringDTO.role)
        volunteering.role = updateVolunteeringDTO.role;
    if (updateVolunteeringDTO.description)
        volunteering.description = updateVolunteeringDTO.description;
    if (updateVolunteeringDTO.start_date)
        volunteering.start_date = updateVolunteeringDTO.start_date;
    if (updateVolunteeringDTO.end_date)
        volunteering.end_date = updateVolunteeringDTO.end_date;
    return await AccountVolunteeringRepository.save(volunteering);
};
export const deleteVolunteeringService = async (
    userId: number,
    volunteeringId: number,
) => {
    const volunteering = await AccountVolunteeringRepository.findOneBy({
        account: { id: userId },
        id: volunteeringId,
    });
    if (!volunteering) {
        throw new AppError('No volunteering found with that ID', 404);
    }
    await AccountVolunteeringRepository.remove(volunteering);
};
