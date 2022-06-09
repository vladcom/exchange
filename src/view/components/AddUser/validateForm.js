import * as yup from 'yup';
import moment from 'moment';
import parseMobile from 'libphonenumber-js/mobile';

const isValidPhoneNumber = (phoneNumber) => {
  const parsedPhoneNumber = parseMobile(phoneNumber, {
    extract: false
  });

  if (!parsedPhoneNumber) {
    return false;
  }

  return parsedPhoneNumber.isValid() && parsedPhoneNumber.getType() === 'MOBILE';
};

const validationSchemaNewUser = yup.object({
  lastname: yup
    .string()
    .max(24, 'Максимально 24 символа')
    .required('Обязательно к заполнению'),
  firstname: yup
    .string()
    .max(24, 'Максимально 24 символа')
    .required('Обязательно к заполнению'),
  patronymic: yup
    .string()
    .max(24, 'Максимально 24 символа')
    .required('Обязательно к заполнению'),
  phone: yup
    .string()
    .trim()
    .required('Обязательно к заполнению')
    .min(6, 'Номер слишком короткий')
    .max(15, 'Номер слишком длинный')
    .test('isValid phone', 'Телефон не валидный', (value) => {
      if (!(value?.startsWith('+') && /^[\d+]+$/.test(value))) {
        return false;
      }

      return isValidPhoneNumber(value);
    }),
  additionalContact: yup
    .string()
    .max(48, 'Не более 48 символов'),
  userType: yup
    .string()
    .required('Обязательно к заполнению'),
  dob: yup
    .string()
    .required('Обязательно к заполнению')
    .test(
      'dob',
      'Пожалуйста укажите правильную дату в формате ММ/ДД/ГГГГ',
      (value) => moment().diff(moment(value), 'years') > 17),
  access: yup
    .string()
    .required('Обязательно к заполнению'),
  login: yup
    .string()
    .max(12, 'Должен равен или менее 12 символов')
    .required('Обязательно к заполнению'),
  status: yup
    .string()
    .required('Обязательно к заполнению'),
  password: yup
    .string()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]{2,6}).{2,8}$/, 'Пароль не валидный')
    .max(8, 'Пароль должен содержать максимум 8 символов')
    .oneOf([yup.ref('confirmPassword'), null], 'Пароли не совпадают'),
  confirmPassword: yup
    .string()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]{2,6}).{2,8}$/, 'Пароль не валидный')
    .max(8, 'Пароль должен содержать максимум 8 символов')
    .oneOf([yup.ref('password'), null], 'Пароли не совпадают')
});

export default validationSchemaNewUser;
