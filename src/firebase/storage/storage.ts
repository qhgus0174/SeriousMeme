import {
    ref as fbRef,
    uploadString as fbUploadString,
    getDownloadURL as fbGetDownloadURL,
    deleteObject as fbDeleteObject,
    StorageReference,
} from 'firebase/storage';
import { storage } from '~firebase/firebaseInstance';
import { v4 as uuidV4 } from 'uuid';

const basicStorageRef = (userId: string) => fbRef(storage, `board/${userId}/${uuidV4()}`);
const profileStorageRef = (userId: string) => fbRef(storage, `profile/${userId}`);

export const uploadByAttachmentUrlBoard = async (userId: string, attachmentUrl: string) =>
    await fbUploadString(basicStorageRef(userId), attachmentUrl, 'data_url');

export const uploadByAttachmentUrlProfile = async (userId: string, attachmentUrl: string) =>
    await fbUploadString(profileStorageRef(userId), attachmentUrl, 'data_url');

export const getDownloadURL = async (ref: StorageReference) => fbGetDownloadURL(ref);

export const deleteAttachmentByUrl = async (attachmentUrl: string) => fbDeleteObject(fbRef(storage, attachmentUrl));
