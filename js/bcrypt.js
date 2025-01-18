// Using bcryptjs for client-side password hashing
import bcrypt from 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js';

const SALT_ROUNDS = 10;

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function comparePasswords(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

export { hashPassword, comparePasswords };