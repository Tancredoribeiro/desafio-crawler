import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      search: Yup.string().required('O parametro  search é obrigatório'),
      limit: Yup.number().min(1, 'O limite deve ser maior ou igual a ${min}' ).required('O parametro limit é obrigatório')
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Erro de validação', messages: err.inner });
  }
};