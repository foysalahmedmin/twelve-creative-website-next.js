"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminAccountAction } from "@/lib/api/admin-users-actions";

export default function NewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    const res = await createAdminAccountAction({ name, email, password });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to create account");
      return;
    }
    toast.success(`Account created for ${email}. They can now sign in.`);
    router.push("/admin/users");
    router.refresh();
  };

  return (
    <div className="container max-w-xl space-y-6 py-8">
      <AdminPageHeader
        title="New admin user"
        description="Creates an editor account. Promote to admin from the Users list if needed."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users" },
          { label: "New" },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                required
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Temporary password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Share this with the teammate. They can change it after sign-in.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/users")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-1 size-4 animate-spin" />}
                Create account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
