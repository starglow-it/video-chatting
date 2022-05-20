import { Profile } from '../../types';

export const initialProfileState: Profile = {
    id: '',
    fullName: '',
    position: '',
    profileAvatar: {
        url: '',
        size: 0,
        mimeType: '',
    },
    companyName: '',
    email: '',
    contactEmail: '',
    description: '',
    languages: [],
    socials: [],
    businessCategories: [],
    templates: [],
    signBoard: 'default'
};
