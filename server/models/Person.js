const {Schema, model} = require("mongoose");


const personSchema = new Schema({
    email:{type:String, required:true, unique:true},
    password: {type:String, require:true},
    name: {type:String, required:true},
    role: {type: String, enum: ["admin", "user", "bosh admin"], default:"user", required: true},
    isAbleToChangeRoles: {type: Boolean, default: false},
    // isAddingAllPeople: {type:Boolean, default:false},
    // isDeletingUsers: {type:Boolean, default:false},
    // isDeletingAdmins: {type:Boolean, default:false},
}, {timestamps:true, collection: "Users"})

personSchema.pre('save', function (next) {
    if (this.isNew) { // Only run logic on new documents (not updates)
        if (this.role === 'admin') {
            // this.isDeletingUsers = true;
            // this.isDeletingAdmins = false;
        } else if (this.role === 'bosh admin') {
            this.isAbleToChangeRoles = true;
            // this.isDeletingUsers = true;
            // this.isDeletingAdmins = true;
        } else if (this.role === 'user') {
            this.isAbleToChangeRoles = false;
            // this.isDeletingUsers = false;
            // this.isDeletingAdmins = false;
        }
    }
    next();
});

module.exports = model( "Person", personSchema)