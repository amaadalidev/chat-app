import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { STORAGE_PATHS } from '../constants/collections';
import { storage } from '../firebase/firebase';

export interface IStorageRepository {
  uploadAvatar(userId: string, fileUri: string): Promise<string>;
  uploadChatImage(conversationId: string, fileUri: string): Promise<string>;
}

export class StorageRepository implements IStorageRepository {
  async uploadAvatar(userId: string, fileUri: string): Promise<string> {
    const filename = `${STORAGE_PATHS.AVATARS}/${userId}_${Date.now()}.jpg`;
    return this.uploadFile(filename, fileUri);
  }

  async uploadChatImage(conversationId: string, fileUri: string): Promise<string> {
    const filename = `${STORAGE_PATHS.CHAT_IMAGES}/${conversationId}/${Date.now()}.jpg`;
    return this.uploadFile(filename, fileUri);
  }

  private async uploadFile(storagePath: string, fileUri: string): Promise<string> {
    const storageRef = ref(storage, storagePath);

    // Fetch the image as a Blob for Firebase SDK compatibility
    const response = await fetch(fileUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  }
}

export const storageRepository = new StorageRepository();
