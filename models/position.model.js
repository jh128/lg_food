const db = require('../utils/mongo.util')

const PositionSchema = db.Schema({
  companyLogo: { type: String, require: true},
  companyName: { type: String, required: true },
  positionName: { type: String, required: true },
  city: { type: String, required: true },
  salary: { type: String, required: true },
  degree: { type: String, required: true },
  type: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  createTime: { type: String, require: true }
  // createTime: { type: String }
})

// PositionSchema.virtual('createTime').get(function () {
//   return moment().format('YYYY-MM-DD h:mm');
// });

const Position = db.model('Positions', PositionSchema)

const save = (data) => {
  let pos = new Position(data)
  return pos.save().then((result) => {
    return result
  }).catch((err) => {
    return false
  })
}

const findAll = () => {
  return Position.find({}).sort({_id: -1}).then(result => result)
}

const find = async ({start, count}) => {
  let total = (await findAll()).length
  return Position.find({}).skip(+start).limit(+count).sort({_id: -1}).then(result => {
    return {
      result,
      total
    }
  })
}

const findById = (id) => {
  return Position.findById(id).then(result => result)
}

const remove = (id) => {
  return Position.findByIdAndRemove(id)
    .then(result => result)
}

const update = (data, id) => {
  return Position.findByIdAndUpdate(id, data)
    .then(result => result)
    .catch(err => err.msg)
}

const findAllByKeywords = (keywords) => {
  return Position.find({
    positionName: new RegExp(keywords, 'gi')
  })
    .sort({_id: -1})
    .then(result => result)
}

const findByKeywords = async ({keywords, start, count}) => {
  let total = (await findAllByKeywords(keywords)).length

  return Position.find({
    positionName: new RegExp(keywords, 'gi')
  })
    .skip(+start)
    .limit(+count)
    .sort({_id: -1})
    .then(result => {
      return {
        result,
        total
      }
    })
    .catch(err => err.msg)
}

module.exports = {
  save,
  findAll,
  remove,
  findById,
  update,
  find,
  findByKeywords
}
