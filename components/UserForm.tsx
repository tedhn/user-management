"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PhoneInput } from "@/components/ui/phone-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, ArrowLeft, Save, Edit, Eye } from "lucide-react";
import { User, UserFormValues } from "@/types/type";
import { userFormSchema } from "@/zod/user";
import { useRouter } from "next/navigation";

interface UserFormProps {
  user?: User;
  onView?: () => void;
  handleApi: (data: UserFormValues) => Promise<void>;
}

const UserForm = (props: UserFormProps) => {
  const { user, handleApi, onView } = props;
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? user
      : {
          name: "",
          email: "",
          phoneNumber: "",
          avatar: "",
          role: undefined,
          active: true,
          bio: "",
        },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);

    await handleApi(data);

    setIsSubmitting(false);

    // Reset form after successful submission
    reset();
    setAvatarPreview("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => router.push("/user")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {user ? "Edit User" : "Add New User"}
              </h1>
              <p className="text-slate-600 mt-1">
                {user
                  ? "Update the user information"
                  : "Add a new user to the system"}
              </p>
            </div>
          </div>

          <Button onClick={onView} className="gap-2">
            <Eye className="h-4 w-4" />
            View User
          </Button>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Fill in the details below. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label>Avatar (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={avatarPreview || watch("avatar")}
                      alt="User avatar"
                    />
                    <AvatarFallback>
                      {watch("name")?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <label
                      htmlFor="avatar-upload"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      Or enter image URL below
                    </p>
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="https://example.com/avatar.jpg"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setAvatarPreview(e.target.value);
                          }}
                          className="mt-2"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input id="name" placeholder="John Doe" {...field} />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="phoneNumber"
                      placeholder="+1 (555) 000-0000"
                      {...field}
                      defaultCountry="US"
                    />
                  )}
                />
                <p className="text-sm text-slate-500">
                  Include country code (e.g., +1 for US)
                </p>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Status *</Label>
                  <p className="text-sm text-slate-500">
                    {watch("active") ? "User is active" : "User is inactive"}
                  </p>
                </div>
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  )}
                />
                <p className="text-sm text-slate-500">Maximum 500 characters</p>
                {errors.bio && (
                  <p className="text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting
                    ? "Saving..."
                    : user
                    ? "Update User"
                    : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setAvatarPreview("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserForm;
