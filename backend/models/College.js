import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    gpaRequirement: { type: Number, required: true },
    creditsAccepted: { type: Number, required: true },
    tuition: { type: Number, required: true },
    deadline: { type: Date, required: false },
    financialAidAvailable: { type: Boolean, default: false }
});

const College = mongoose.model('College', collegeSchema);
export default College;
