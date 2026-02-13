const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    // Definizione dei campi utente
    name: {
        type: String,
        required: [true, 'Il nome è obbligatorio'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'L\'email è obbligatoria'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'L\'email non è valida']
    },
    password: {
        type: String,
        required: [true, 'La password è obbligatoria'],
        minlength: [6, 'La password deve contenere almeno 6 caratteri']
    }
}, { timestamps: true });

// Middleware di Mongoose per hashare la password prima di salvare
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Metodo di istanza per confrontare la password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);