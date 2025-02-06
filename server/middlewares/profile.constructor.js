import _ from 'lodash';

const _isNilOrEmpty = (value) => _.isNil(value) || _.isEmpty(value);

export const constructProfileData = (req, res, next) => {
    const body = _.get(req, 'body', {});
    const files = _.get(req, 'files', undefined);
    let fileUrls;
    if (files) {
        fileUrls = {
            frontDocument: _.get(files, 'frontDocumentFile[0].path', undefined),
            backDocument: _.get(files, 'backDocumentFile[0].path', undefined),
            videoDocument: _.get(files, 'videoDocumentFile[0].path', undefined),
            profileImage: _.get(files, 'profileImageFile[0].path', undefined),
            posterImage: _.get(files, 'posterImageFile[0].path', undefined),
            bannerImage: _.get(files, 'videoDocumentFile[0].path', undefined),
        }
    }

    const dirtyProfileData = {
        firstName: _.get(body, "firstName", undefined),
        lastName: _.get(body, "lastName", undefined),
        sex: _.toLower(_.get(body, "sex", undefined)),
        birthday: _.get(body, "birthday", undefined),
        document: _.get(body, "document", undefined),
        nationality: _.get(body, "nationality", undefined),
        residenceCountry: _.get(body, "residenceCountry", undefined),
        residenceCity: _.get(body, "residenceCity", undefined),
        phone: _.get(body, "phone", undefined),
        instagram: _.get(body, "instagram", undefined),
        timezone: _.get(body, "timezone", undefined),
        publicUserName: _.get(body, "publicUserName", undefined),
        basicSubscriptionCost: _.get(body, "basicSubscriptionCost", undefined),
        stageName: _.get(body, "stageName", undefined),
        ...fileUrls
    };

    const cleanProfileData = _.omitBy(dirtyProfileData, _isNilOrEmpty);
    req.profileData = cleanProfileData;
    next();
};