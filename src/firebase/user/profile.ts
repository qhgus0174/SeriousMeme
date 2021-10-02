import React from 'react';
import { updateProfile as fbUpdateProfile, User } from 'firebase/auth';

interface IUserProfile {
    displayName?: string | null;
    photoURL?: string | null;
}

export const updateProfile = async (user: User, { displayName, photoURL }: IUserProfile) =>
    await fbUpdateProfile(user, { displayName, photoURL });
