import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRepository, IUserRepository } from '../repositories/UserRepository';
import { useAuthStore } from '../store/useAuthStore';
import { parseFirebaseError } from '../utils/errorUtils';
import { profileSchema, ProfileFormData } from '../utils/validationSchemas';

export const useProfileViewModel = (userRepo: IUserRepository = userRepository) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        displayName: user.displayName,
        bio: user.bio || '',
      });
    }
  }, [user, profileForm]);

  const handleUpdateProfile = profileForm.handleSubmit(async (data: ProfileFormData) => {
    if (!user) return;
    try {
      setIsLoading(true);
      await userRepo.updateUserProfile(user.id, {
        displayName: data.displayName,
        bio: data.bio,
      });

      const updatedUser = {
        ...user,
        displayName: data.displayName,
        bio: data.bio,
      };

      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  });

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    user,
    profileForm,
    handleUpdateProfile,
    isLoading,
    error,
    successMessage,
    clearMessages,
  };
};
