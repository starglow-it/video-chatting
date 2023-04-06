import { readFileSync } from "fs";
import { join } from "path";

export const BUSINESS_CATEGORIES = [
  { key: 'cozy', value: 'Cozy', color: '#2915a0' },
  { key: 'funky', value: 'Funky', color: '#2f3edc' },
  { key: 'therapy', value: 'Therapy', color: '#914b50' },
  { key: 'soothing', value: 'Soothing', color: '#1f2418' },
  { key: 'calming', value: 'Calming', color: '#a698c0' },
  { key: 'private', value: 'Private', color: '#43e220' },
  { key: 'asmr', value: 'ASMR', color: '#603f50' },
  { key: 'teamMeeting', value: 'Team meeting', color: '#deb550' },
  { key: 'legal', value: 'Legal', color: '#6912a0' },
  { key: 'mediation', value: 'Mediation', color: '#dc7e10' },
  { key: 'focused', value: 'Focused', color: '#7a785b' },
  { key: 'energizing', value: 'Energizing', color: '#b4c9e0' },
  { key: 'counselling', value: 'Counselling', color: '#ea392f' },
  { key: 'nature', value: 'Nature', color: '#9ecd50' },
  { key: 'restorative', value: 'Restorative', color: '#da2690' },
  { key: 'secluded', value: 'Secluded', color: '#5734fd' },
  { key: 'consulting', value: 'Consulting', color: '#517f60' },
  { key: 'therapeutic', value: 'Therapeutic', color: '#5ba555' },
  { key: 'sounds', value: 'Sounds', color: '#1ee510' },
  { key: 'retreat', value: 'Retreat', color: '#3219ad' },
  { key: 'casual', value: 'Casual', color: '#a698c0' },
  { key: 'celebration', value: 'Celebration', color: '#43e220' },
  { key: 'coaching', value: 'Coaching', color: '#603f50' },
  { key: 'fire', value: 'Fire', color: '#deb550' },
  { key: 'fun', value: 'Fun', color: '#6912a0' },
  { key: 'indoor', value: 'Indoor', color: '#dc7e10' },
  { key: 'outdoor', value: 'Outdoor', color: '#7a785b' },
  { key: 'ocean', value: 'Ocean', color: '#b4c9e0' },
  { key: 'original', value: 'Original', color: '#ea392f' },
  { key: 'plain', value: 'Plain', color: '#9ecd50' },
  { key: 'professional', value: 'Professional', color: '#517f60' },
  { key: 'sales', value: 'Sales', color: '#5ba555' },
  { key: 'wellness', value: 'Wellness', color: '#1ee510' },
  {
    key: 'office',
    value: 'Office',
    color: '#5ba555'
  },
  {
    key: 'flower',
    value: 'Flower',
    color: '#1ee510'
  },
  {
    key: 'univer',
    value: 'Univer',
    color: '#1ee510'
  },
];

export const BUSINESS_FILE_PATH = [
  './src/public/office_1.jpeg',
  './src/public/office_2.jpeg',
  './src/public/office_3.jpeg',
  './src/public/office_4.jpeg',
  './src/public/flower_1.jpeg',
  './src/public/flower_2.jpeg',
  './src/public/univer_1.jpeg',
  './src/public/univer_2.jpeg',
  './src/public/univer_3.jpeg',
]
