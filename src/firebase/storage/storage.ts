import {
    ref as fbRef,
    uploadString as fbUploadString,
    getDownloadURL as fbGetDownloadURL,
    deleteObject as fbDeleteObject,
    StorageReference,
} from 'firebase/storage';
import { storage } from '~firebase/firebaseInstance';
import { v4 as uuidV4 } from 'uuid';

const storageRef = (userId: string) => fbRef(storage, `${userId}/${uuidV4()}`);

export const uploadByAttachmentUrl = async (userId: string, attachmentUrl: string) =>
    await fbUploadString(storageRef(userId), attachmentUrl, 'data_url');

export const getDownloadURL = async (ref: StorageReference) => fbGetDownloadURL(ref);

export const deleteAttachmentByUrl = async (attachmentUrl: string) => fbDeleteObject(fbRef(storage, attachmentUrl));
