import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  Briefcase,
  Save,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  profileApi,
  Profile as ProfileType,
  UpdateProfileData,
  ChangePasswordData,
} from "../../../api/endpoints/profile.api";
import { useAuth } from "../../../ctx/AuthContext";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      setProfile(data);
      updateUser(data);
      setProfileSuccess("Profile updated successfully!");
      setProfileError("");
      setTimeout(() => setProfileSuccess(""), 3000);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      setProfileError(
        err.response?.data?.error?.message || "Failed to update profile",
      );
      setProfileSuccess("");
      setTimeout(() => setProfileError(""), 3000);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => profileApi.changePassword(data),
    onSuccess: () => {
      setPasswordSuccess("Password changed successfully!");
      setPasswordError("");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(""), 3000);
    },
    onError: (err: any) => {
      const response = err.response?.data;
      if (response?.error?.fieldErrors) {
        setPasswordError(response.error.message || "Validation error");
      } else {
        setPasswordError(
          response?.error?.message || "Failed to change password",
        );
      }
      setPasswordSuccess("");
      setTimeout(() => setPasswordError(""), 3000);
    },
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updateData: UpdateProfileData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      position: profile.position,
      phone: profile.phone || "",
      avatar: profile.avatar || "",
    };

    updateProfileMutation.mutate(updateData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      setTimeout(() => setPasswordError(""), 3000);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setTimeout(() => setPasswordError(""), 3000);
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-[#0f172b] animate-spin" />
          <span className="text-sm text-gray-500">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {(error as any)?.response?.data?.error?.message ||
            "Failed to load profile"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My profile</h1>
      <p className="text-gray-500 text-sm mb-6">
        Manage your details and sign-in password.
      </p>

      {/* Personal details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Personal details
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Update how your name and contact details appear to your colleagues.
        </p>

        <form onSubmit={handleProfileSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Contact an administrator to change your email or role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="position"
                value={profile.position}
                onChange={handleProfileChange}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleProfileChange}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                placeholder="+1 555-0101"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              name="avatar"
              value={profile.avatar || ""}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              placeholder="https://i.pravatar.cc/150?u=1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank to show your initials instead.
            </p>
          </div>

          {profileSuccess && (
            <div className="mt-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {profileError}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-[#0f172b] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a2744] transition text-sm font-medium disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose a strong password you do not use anywhere else.
        </p>

        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              At least 8 characters, with upper and lower case and a number.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {passwordSuccess && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="bg-[#0f172b] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a2744] transition text-sm font-medium disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {changePasswordMutation.isPending
              ? "Changing..."
              : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
