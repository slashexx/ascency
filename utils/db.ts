import {Schema, model} from "mongoose"
import { json } from "stream/consumers"

const userSchema = new Schema({
    email:{type:String, require:true},
    name:{type: String, require:true},
    imageUrl:{type:String, require:true},
    socials:[String],
    location: {type:String},
    bio:{type:String},
    followers:{type:Number},
    following:{type:Number},
    Achiverments:[String],
    Organizations:[String],
})

const skillSchmea = new Schema({
   content:json
})

export const User = model('User', userSchema)
export const Sill = model('Skill', skillSchmea)
