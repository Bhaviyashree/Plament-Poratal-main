import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'placement_staff', 'student', 'company'],
      required: [true, 'Role is required'],
    },
    profileImage: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    resume: {
      type: String,
      default: '',
    },
    skills: [{
      type: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      credential: String,
    }],
    experience: [{
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }],
    education: [{
      degree: String,
      department: String,
      institution: String,
      passedOutYear: Number
    }],
    applications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    }],
    placementStatus: {
      type: String,
      enum: ['not_placed', 'placed', 'offer_received'],
      default: 'not_placed',
    },
    // company 
    about: {
      type: String,
    },
    address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },
    website: {
      type: String,
    },
    logo: {
      type: String, // Store image path or URL
    },
    companySize: {
      type: String, // Example: "1-10", "11-50", "51-200"
    },
    companyType: {
      type: String, // Example: "Private", "Public", "Startup", etc.
    },
    hrContact: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    jobs:[{
      type: String,
      ref: 'Job',
    }],
  },
  
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
