import type { Tool, InputConfig, InputOption, FormSectionConfig } from './types';
import { Sun } from 'lucide-react';
import { getValidationSchema } from './toolValidation';

const fitzpatrickOptions: InputOption[] = [
  { value: 1, label: 'Type I: Always burns, never tans (pale white)' },
  { value: 2, label: 'Type II: Usually burns, tans minimally (white)' },
  { value: 3, label: 'Type III: Sometimes mild burn, tans uniformly (light brown)' },
  { value: 4, label: 'Type IV: Burns minimally, always tans well (moderate brown)' },
  { value: 5, label: 'Type V: Very rarely burns, tans very easily (dark brown)' },
  { value: 6, label: 'Type VI: Never burns, deeply pigmented (black)' },
];

export const fitzpatrickSkinTypeTool: Tool = {
  id: 'fitzpatrick_skin_type',
  name: 'Fitzpatrick Skin Type Classification',
  acronym: 'Fitzpatrick Scale',
  description:
    'A categorical system to classify skin based on its response to UV radiation (burning and tanning). It is used to guide phototherapy dosing, predict photodamage risk, and inform cosmetic procedure selection.',
  condition: 'Skin Typing',
  keywords: [
    'fitzpatrick',
    'skin type',
    'sun sensitivity',
    'uv',
    'tanning',
    'photodamage',
    'phototherapy',
  ],
  sourceType: 'Research',
  icon: Sun,
  displayType: 'staticList',
  rationale:
    'The Fitzpatrick Skin Type Classification was developed to categorize individuals based on their skin’s response to ultraviolet (UV) radiation, specifically their tendency to burn and ability to tan. Its primary clinical applications include guiding phototherapy dosing, predicting risk for photodamage and skin cancer, and informing the selection and expected outcomes of cosmetic procedures. The rationale for its development was to provide a practical, clinically relevant method for estimating UV sensitivity, particularly in the context of psoriasis phototherapy, and to stratify risk for adverse outcomes related to sun exposure. The original system was introduced by Thomas B. Fitzpatrick in 1975.',
  clinicalPerformance:
    'The Fitzpatrick system is not a diagnostic test, so sensitivity and specificity are not applicable. Reliability studies demonstrate moderate inter-rater agreement (kappa 0.4–0.7), with higher reliability when administered by trained dermatologists compared to self-assessment. The system’s accuracy is limited in ethnically diverse populations, particularly for types V and VI, due to conflation of skin color, ethnicity, and photoreactivity. Objective methods such as reflectance spectrophotometry have been proposed as alternatives, showing good correlation with clinician-assigned Fitzpatrick type. Validation studies confirm moderate reliability and highlight the need for local adaptation and standardization, especially in diverse populations. The Fitzpatrick system’s main limitations are its subjectivity, moderate reliability, and limited generalizability to non-White populations. The system conflates skin color, ethnicity, and photoreactivity, leading to potential misclassification.',
  formSections: [
    {
      id: 'fitzpatrick_type',
      label: 'Fitzpatrick Skin Type Categories',
      type: 'select',
      options: fitzpatrickOptions,
      defaultValue: 3,
      validation: getValidationSchema('select', fitzpatrickOptions, 1, 6),
    },
  ],
  calculationLogic: (inputs) => {
    const type = Number(inputs.fitzpatrick_type);
    const typeDescriptionObj = fitzpatrickOptions.find((opt) => opt.value === type);
    const typeDescription = typeDescriptionObj
      ? typeDescriptionObj.label
      : 'Invalid type selected.';
    const score = type;
    const interpretation = `Fitzpatrick Skin Type ${type}. Description: ${typeDescription}`;
    return { score, interpretation, details: { classification_description: typeDescription } };
  },
  references: [
    'Gupta V, Sharma VK. Skin Typing: Fitzpatrick Grading and Others. Clinics in Dermatology. 2019 Sep - Oct;37(5):430-436. doi:10.1016/j.clindermatol.2019.07.010.',
    'Harvey VM, Alexis A, Okeke CAV, et al. Integrating Skin Color Assessments Into Clinical Practice and Research: A Review of Current Approaches. Journal of the American Academy of Dermatology. 2024;91(6):1189-1198. doi:10.1016/j.jaad.2024.01.067.',
    'Roberts WE. Skin Type Classification Systems Old and New. Dermatologic Clinics. 2009;27(4):529-33, viii. doi:10.1016/j.det.2009.08.006.',
    'Eilers S, Bach DQ, Gaber R, et al. Accuracy of Self-report in Assessing Fitzpatrick Skin Phototypes I Through VI. JAMA Dermatology. 2013;149(11):1289-94. doi:10.1001/jamadermatol.2013.6101.',
    "Pershing LK, Tirumala VP, Nelson JL, et al. Reflectance Spectrophotometer: The Dermatologists' Sphygmomanometer for Skin Phototyping?. The Journal of Investigative Dermatology. 2008;128(7):1633-40. doi:10.1038/sj.jid.5701238.",
    'Sharma VK, Gupta V, Jangid BL, Pathak M. Modification of the Fitzpatrick System of Skin Phototype Classification for the Indian Population, and Its Correlation With Narrowband Diffuse Reflectance Spectrophotometry. Clinical and Experimental Dermatology. 2018;43(3):274-280. doi:10.1111/ced.13365.',
    'Trakatelli M, Bylaite-Bucinskiene M, Correia O, et al. Clinical Assessment of Skin Phototypes: Watch Your Words!. European Journal of Dermatology : EJD. 2017;27(6):615-619. doi:10.1684/ejd.2017.3129.',
    'Santiago S, Brown R, Shao K, Hooper J, Perez M. Modified Fitzpatrick Scale-Skin Color and Reactivity. Journal of Drugs in Dermatology : JDD. 2023;22(7):641-646. doi:10.36849/JDD.6859.',
  ],
};
