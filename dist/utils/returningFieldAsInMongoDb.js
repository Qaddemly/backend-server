"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returningPhone = exports.returningDateOfBirth = exports.returningLastName = exports.returningFirstName = exports.returningLanguage = exports.returningEducation = exports.returningExperiences = void 0;
var returningExperiences = function (experience_) {
    var experienceJson = {
        companyName: experience_.company_name,
        employmentType: experience_.employment_type,
        location: experience_.location,
        stillWorking: experience_.still_working,
        locationType: experience_.location_type,
        jobTitle: experience_.job_title,
        startDate: experience_.start_date,
        endDate: experience_.end_date,
    };
    return experienceJson;
};
exports.returningExperiences = returningExperiences;
var returningEducation = function (education_) {
    var educationJson = {
        university: education_.university,
        fieldOfStudy: education_.field_of_study,
        gpa: education_.gpa,
        startDate: education_.start_date,
        endDate: education_.end_date,
    };
    return educationJson;
};
exports.returningEducation = returningEducation;
var returningLanguage = function (language_) {
    var languageJson = language_.name;
    return languageJson;
};
exports.returningLanguage = returningLanguage;
var returningFirstName = function (first_name) {
    var firstName = first_name;
    return firstName;
};
exports.returningFirstName = returningFirstName;
var returningLastName = function (last_name) {
    var lastName = last_name;
    return lastName;
};
exports.returningLastName = returningLastName;
var returningDateOfBirth = function (date_of_birth) {
    var dateOfBirth = date_of_birth;
    return dateOfBirth;
};
exports.returningDateOfBirth = returningDateOfBirth;
var returningPhone = function (phone) {
    var phone_ = {
        countryCode: phone.country_code,
        number: phone.number,
    };
    return phone_;
};
exports.returningPhone = returningPhone;
//# sourceMappingURL=returningFieldAsInMongoDb.js.map