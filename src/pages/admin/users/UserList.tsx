import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/api/users";
import { fetchPublicDepartments } from "@/app/api/publicDepartments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Pencil, UserX, Plus, Loader2, Shield, User } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "master_admin" | "section_head";
  department_id: number | null;
  is_active: boolean;
  department?: {
    id: number;
    name: string;
  };
}

interface Department {
  id: number;
  name: string;
  slug: string;
}

export default function UserList() {
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "section_head" as "master_admin" | "section_head",
    department_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, departments] = await Promise.all([
        getUsers(),
        fetchPublicDepartments(),
      ]);

      setUsers(usersRes.data);
      setDepartments(departments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!userToDeactivate) return;

    try {
      await deleteUser(userToDeactivate.id);
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to deactivate user",
        variant: "destructive",
      });
    } finally {
      setDeactivateDialogOpen(false);
      setUserToDeactivate(null);
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "section_head",
      department_id: "",
    });
    setFormDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department_id: user.department_id ? String(user.department_id) : "",
    });
    setFormDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        // For update, only send changed fields
        const updateData: any = {};

        // Update name if changed
        if (formData.name !== editingUser.name) {
          updateData.name = formData.name;
        }

        // Update email if changed
        if (formData.email !== editingUser.email) {
          updateData.email = formData.email;
        }

        // Update password if provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        // Update role if changed
        if (formData.role !== editingUser.role) {
          updateData.role = formData.role;
        }

        // Update department if changed
        if (formData.role === "section_head" && formData.department_id) {
          if (Number(formData.department_id) !== editingUser.department_id) {
            updateData.department_id = Number(formData.department_id);
          }
        }

        // Validate section head has department
        if (
          (updateData.role === "section_head" || (formData.role === "section_head" && !updateData.role)) &&
          !formData.department_id
        ) {
          toast({
            title: "Validation Error",
            description: "Section head must have a department",
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }

        await updateUser(editingUser.id, updateData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // For create
        const createData: any = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        if (formData.role === "section_head") {
          if (!formData.department_id) {
            toast({
              title: "Validation Error",
              description: "Section head must have a department",
              variant: "destructive",
            });
            setSubmitting(false);
            return;
          }
          createData.department_id = Number(formData.department_id);
        }

        await createUser(createData);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      setFormDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      toast({
        title: "Success",
        description: `User ${!user.is_active ? "activated" : "deactivated"} successfully`,
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-500 mt-1">
            Manage admin users and section heads
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "master_admin" ? "default" : "secondary"}
                      className="flex items-center gap-1 w-fit"
                    >
                      {user.role === "master_admin" ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {user.role === "master_admin" ? "Master Admin" : "Section Head"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.department?.name || (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={() => toggleUserStatus(user)}
                      />
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUserToDeactivate(user);
                          setDeactivateDialogOpen(true);
                        }}
                        disabled={!user.is_active}
                      >
                        <UserX className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate "{userToDeactivate?.name}" and prevent them from
              logging in. You can reactivate them later using the toggle switch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit User Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update the user's role and department"
                : "Fill in the details to create a new admin user"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="user@alkhair.com"
              />
            </div>

            <div>
              <Label htmlFor="password">
                Password {editingUser ? "(leave blank to keep current)" : "*"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
                minLength={8}
                placeholder={editingUser ? "Enter new password to change" : "Minimum 8 characters"}
              />
              {editingUser && (
                <p className="text-sm text-gray-500 mt-1">
                  Only enter a password if you want to change it
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "master_admin" | "section_head") =>
                  setFormData({ ...formData, role: value, department_id: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master_admin">Master Admin</SelectItem>
                  <SelectItem value="section_head">Section Head</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "section_head" && (
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Section heads can only manage products in their assigned department
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingUser ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
