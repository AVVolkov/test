const router = require('express').Router();
const {
  celebrate, Joi, Segments,
} = require('celebrate');
const entityService = require('../services/entityService');

const paramsGenerator = () => {
  const result = {
    id: Joi.string().required(),
    name: Joi.string().required(),
  };

  for (let i = 1; i <= 20; i += 1) {
    result[`p${i}`] = Joi.number();
  }

  return result;
};

router.post('/upsert', celebrate({
  [Segments.BODY]: Joi.object().keys(paramsGenerator()),
}), async (req, res) => {
  try {
    const result = await entityService.upsert(req.body);
    return res.answer(result);
  } catch (err) {
    return res.error(err);
  }
});

module.exports = router;
