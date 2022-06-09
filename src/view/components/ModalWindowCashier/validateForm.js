import * as yup from 'yup';

const validationSchemaNewUser = yup.object({
  minutes: yup
    .string()
    .required('Обязательно к заполнению'),
  hours: yup
    .string()
    .required('Обязательно к заполнению')
});

export default validationSchemaNewUser;
