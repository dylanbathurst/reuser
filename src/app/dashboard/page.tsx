"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CopyButton from "@/Components/CopyButton";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

interface TestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isCheckedOut: boolean;
  checkedOutBy?: User;
  checkedOutAt?: string;
}

interface Organization {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  organizationId: string;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orgId = searchParams.get("orgId");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateOrgForm, setShowCreateOrgForm] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [newOrg, setNewOrg] = useState({
    name: "",
  });

  useEffect(() => {
    fetchSession();
    fetchOrganizations();
    if (orgId) {
      fetchCurrentOrganization();
      fetchTestUsers();
    }
  }, [orgId]);

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user);
        // If no orgId in URL but user has an org, redirect to their org
        if (!orgId && data.user.organizationId) {
          router.push(`/dashboard?orgId=${data.user.organizationId}`);
        }
      } else {
        // Not logged in, redirect to login with return URL
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      router.push("/login");
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const orgs = await response.json();
        setOrganizations(orgs);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchCurrentOrganization = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgId}`);
      if (response.ok) {
        const org = await response.json();
        setCurrentOrganization(org);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  const fetchTestUsers = async () => {
    try {
      const response = await fetch(`/api/test-users?orgId=${orgId}`);
      if (response.ok) {
        const users = await response.json();
        setTestUsers(users);
      }
    } catch (error) {
      console.error("Error fetching test users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/test-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newUser,
          organizationId: orgId,
        }),
      });

      if (response.ok) {
        setNewUser({ firstName: "", lastName: "", email: "", password: "" });
        setShowCreateForm(false);
        fetchTestUsers();
      }
    } catch (error) {
      console.error("Error creating test user:", error);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrg),
      });

      if (response.ok) {
        const newOrganization = await response.json();
        setNewOrg({ name: "" });
        setShowCreateOrgForm(false);
        fetchOrganizations();
        // Switch to the new organization
        router.push(`/dashboard?orgId=${newOrganization.id}`);
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const handleOrganizationChange = (newOrgId: string) => {
    router.push(`/dashboard?orgId=${newOrgId}`);
  };

  const handleCheckout = async (userId: string) => {
    try {
      const response = await fetch(`/api/test-users/${userId}/checkout`, {
        method: "POST",
      });

      if (response.ok) {
        fetchTestUsers();
      }
    } catch (error) {
      console.error("Error checking out user:", error);
    }
  };

  const handleCheckin = async (userId: string) => {
    try {
      const response = await fetch(`/api/test-users/${userId}/checkin`, {
        method: "POST",
      });

      if (response.ok) {
        fetchTestUsers();
      }
    } catch (error) {
      console.error("Error checking in user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this test user?")) {
      try {
        const response = await fetch(`/api/test-users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchTestUsers();
        }
      } catch (error) {
        console.error("Error deleting test user:", error);
      }
    }
  };

  if (!orgId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Select an Organization
          </h1>
          {organizations.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Choose an organization to manage:
              </p>
              <div className="space-y-2">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleOrganizationChange(org.id)}
                    className="block w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-4 text-left transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                No organizations found. Create your first one!
              </p>
              <button
                onClick={() => setShowCreateOrgForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Create Organization
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="relative">
                  <select
                    value={orgId || ""}
                    onChange={(e) => handleOrganizationChange(e.target.value)}
                    className="bg-white text-3xl rounded-md font-bold focus:outline-none focus:ring-0"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-gray-600">Manage your test users</p>
            </div>
            <div className="flex space-x-4 items-center">
              <Button
                variant="secondary"
                onClick={() => setShowCreateOrgForm(!showCreateOrgForm)}
              >
                {showCreateOrgForm ? "Cancel" : "New Organization"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCreateOrgForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Organization
            </h2>
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create Test User
            </h2>
            <form
              onSubmit={handleCreateUser}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        )}

        <Card className="w-full overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Test Users</CardTitle>
              <CardDescription>
                See all your test users, and check them in and out
              </CardDescription>
            </div>
            <CardAction>
              <Button
                size={"sm"}
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? "Cancel" : "Add Test User"}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {testUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No test users yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>
                    See all your test users, and check them in and out
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <input
                              contentEditable={false}
                              readOnly={true}
                              type="email"
                              defaultValue={user.email}
                              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <CopyButton
                              text={user.email}
                              isLocked={
                                user.checkedOutBy?.id === currentUser?.id
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <input
                              contentEditable={false}
                              readOnly={true}
                              type="password"
                              defaultValue={user.password}
                              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <CopyButton
                              text={user.password}
                              isLocked={
                                user.checkedOutBy?.id === currentUser?.id
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {user.isCheckedOut ? (
                            <span className="relative inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Checked out
                              <img
                                alt={user.checkedOutBy?.email}
                                title={user.checkedOutBy?.email}
                                src={`https://avatar.vercel.sh/${
                                  user.checkedOutBy?.email.split("@")[0]
                                }.svg?text=${user.checkedOutBy?.email
                                  .split("@")[0]
                                  .slice(0, 2)
                                  .toUpperCase()}&size=20&rounded=60`}
                                className="absolute right-[-10px] top-[-9px]"
                              />
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                          {user.isCheckedOut ? (
                            <Button
                              onClick={() => handleCheckin(user.id)}
                              variant={"default"}
                              size={"sm"}
                              // className="text-blue-600 hover:text-blue-900"
                            >
                              Check In
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleCheckout(user.id)}
                              variant={"outline"}
                              size={"sm"}
                              // className="text-green-600 hover:text-green-900"
                            >
                              Check Out
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant={"destructive"}
                            size={"sm"}
                            // className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
