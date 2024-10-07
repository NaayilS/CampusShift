import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creditsCompleted: { type: Number, required: true },
    currentGPA: { type: Number, required: true },
    preferredLocation: { type: String },
});

const User = mongoose.model('User', userSchema);
export default User;
