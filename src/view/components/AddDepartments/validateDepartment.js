import * as yup from 'yup';

const validationSchemaNewDepartment = yup.object({
  title: yup
    .string()
    .max(128, 'Максимально 128 символа')
    .required('Обязательно к заполнению'),
  city: yup
    .string()
    .required('Обязательно к заполнению'),
  filial: yup
    .string()
    .required('Обязательно к заполнению'),
  zo: yup
    .array(),
  zp: yup
    .string()
    .required('Обязательно к заполнению'),
  token: yup
    .string()
    .required('Обязательно к заполнению'),
  tokenArray: yup
    .array()
    .max(2, 'Максимум 2 токена')
    .required('Обязательно к заполнению'),
  changeRate: yup
    .string()
    .required('Обязательно к заполнению'),
  type: yup
    .string()
    .required('Обязательно к заполнению'),
  limit: yup
    .string(),
  address: yup
    .string()
    .required('Обязательно к заполнению'),
  comment: yup
    .string()
    .max(255, 'Не более 255 символов')
    .required('Обязательно к заполнению'),
  status: yup
    .string()
    .required('Обязательно к заполнению'),
  currency: yup
    .string()
    .required('Обязательно к заполнению')
});

export default validationSchemaNewDepartment;
