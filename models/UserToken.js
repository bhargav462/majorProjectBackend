const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const loginTypes = require('./../config/loginTypes')

const userTokenSchema = new Schema({
   userId: {
      type: ObjectId,
      required: true
   },
   tokens:[{
      token:{
          type:String      
      }
   }],
   loginType: {
      type: String,
      default: loginTypes.NORMAL
   },
   createdAt: {
      type: Date,
      default : Date.now(),
      expires : '1d'
   }
})

module.exports = mongoose.model('userToken', userTokenSchema);