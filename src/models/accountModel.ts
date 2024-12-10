import * as mongoose from 'mongoose';

export interface userDoc extends mongoose.Document {
    accountId: number;
    activationCode?: string;
    activationCodeExpiresIn?: Date;
    activationToken?: string;
    passwordChangedAt?: Date;
    passwordResetCode?: string;
    passwordResetCodeExpires?: Date;
    passwordResetVerificationToken?: string;
    passwordResetToken?: string;
    googleId?: string;
    refreshTokens: string[];
}

const userSchema = new mongoose.Schema<userDoc>(
    {
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetCodeExpires: Date,
        passwordResetVerificationToken: String,
        passwordResetToken: String,
        googleId: String,
        accountId: { type: Number, unique: true },
        refreshTokens: [String],
        activationCode: String,
        activationCodeExpiresIn: Date,
        activationToken: String,
    },
    {
        timestamps: true,
    },
);

const AccountTempData = mongoose.model<userDoc>('AccountTempData', userSchema);

export default AccountTempData;
