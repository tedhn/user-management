"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { User } from "@/types/type";
import { useRouter } from "next/navigation";
import { getRoleBadgeVariant } from "@/lib/utils";

interface UserDetailViewProps {
  user: User;
  onEdit?: () => void;
}

const UserDetailView = ({ user, onEdit }: UserDetailViewProps) => {
  const router = useRouter();

  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/user")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                User Details
              </h1>
              <p className="text-slate-600 mt-1">
                Complete information about this user
              </p>
            </div>
            <Button onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit User
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-slate-200">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-3xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="text-sm px-3 py-1"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {user.active ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <a
                        href={`mailto:${user.email}`}
                        className="font-medium hover:text-blue-600 transition-colors"
                      >
                        {user.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <Phone className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <a
                        href={`tel:${user.phoneNumber}`}
                        className="font-medium hover:text-blue-600 transition-colors"
                      >
                        {user.phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Card */}
        {user.bio && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Biography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {user.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Information Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              System and account related information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="space-y-1">
                <p className="text-sm text-slate-500 font-medium">User ID</p>
                <p className="text-slate-900 font-mono text-sm bg-slate-100 px-3 py-2 rounded">
                  {user.id}
                </p>
              </div>

              {/* Created At */}
              {user.createdAt && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </p>
                  <p className="text-slate-900">{formatDate(user.createdAt)}</p>
                </div>
              )}

              {/* Account Status */}
              <div className="space-y-1">
                <p className="text-sm text-slate-500 font-medium">
                  Account Status
                </p>
                <div className="flex items-center gap-2">
                  {user.active ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-slate-900">
                        Account is active and functional
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-slate-900">
                        Account is currently inactive
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button onClick={onEdit} className="flex-1 gap-2">
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/user")}
            className="flex-1"
          >
            View All Users
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailView;
