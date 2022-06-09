import * as yup from 'yup';

const validationSchemaSellBuy = yup.object({
  currencyTitle: yup
    .string()
    .required('Обязательно к заполнению'),
  currencyValue: yup
    .number()
    .required('Обязательно к заполнению'),
  totalCash: yup
    .number(),
  sum: yup
    .number()
    .required('Обязательно к заполнению'),
  comment: yup
    .string()
});

export default validationSchemaSellBuy;
