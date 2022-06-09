import * as yup from 'yup';

const validationSchemaCross = yup.object({
  currencyTitleBuy: yup
    .number()
    .required('Обязательно к заполнению'),
  currencyTitleSell: yup
    .number()
    .required('Обязательно к заполнению'),
  totalCash: yup
    .number(),
  crossCourse: yup
    .number(),
  comment: yup
    .string(),
  sum: yup
    .number()
    .required('Обязательно к заполнению')
});

export default validationSchemaCross;
