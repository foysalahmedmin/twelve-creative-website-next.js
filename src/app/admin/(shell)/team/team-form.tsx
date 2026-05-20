"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  type TeamMemberInput,
} from "@/lib/api/team-members-actions";
import type { TeamMember } from "@/lib/api/team-members";

interface Props {
  mode: "create" | "edit";
  initial?: TeamMember;
}

export function TeamForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [linkedin, setLinkedin] = useState(initial?.socials?.linkedin ?? "");
  const [instagram, setInstagram] = useState(initial?.socials?.instagram ?? "");
  const [x, setX] = useState(initial?.socials?.x ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !image) {
      toast.error("Name, role, and image are required");
      return;
    }
    setSaving(true);
    const socials: TeamMemberInput["socials"] = {};
    if (linkedin) socials.linkedin = linkedin;
    if (instagram) socials.instagram = instagram;
    if (x) socials.x = x;

    const payload: TeamMemberInput = {
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim() || undefined,
      image,
      socials: Object.keys(socials).length ? socials : undefined,
      order,
      is_active: isActive,
    };
    const res =
      mode === "create"
        ? await createTeamMemberAction(payload)
        : await updateTeamMemberAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Member added" : "Member updated");
    router.push("/admin/team");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New team member" : "Edit team member"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Team", href: "/admin/team" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                required
                placeholder="Founder, Twelve Creative"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <ImageInput
            label="Photo"
            required
            description="Portrait works best (4:5)."
            value={image}
            onChange={setImage}
            previewAspect="4/5"
          />

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              rows={3}
              maxLength={240}
              placeholder="Short blurb (max 240 chars)…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">{bio.length} / 240</p>
          </div>

          <div className="space-y-3">
            <p className="text-foreground text-sm font-semibold">
              Socials (optional)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://…"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://…"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="x">X / Twitter</Label>
                <Input
                  id="x"
                  type="url"
                  placeholder="https://…"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Active</Label>
              <div className="flex h-9 items-center gap-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <span className="text-muted-foreground text-sm">
                  {isActive ? "Visible publicly" : "Hidden"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/team")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add member" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
