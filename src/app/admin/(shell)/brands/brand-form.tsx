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
import {
  createBrandAction,
  updateBrandAction,
  type BrandInput,
} from "@/lib/api/brands-actions";
import type { Brand } from "@/lib/api/brands";

interface Props {
  mode: "create" | "edit";
  initial?: Brand;
}

export function BrandForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [logo, setLogo] = useState(initial?.logo ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logo) {
      toast.error("Name and logo are required");
      return;
    }
    setSaving(true);
    const payload: BrandInput = {
      name: name.trim(),
      logo,
      href: href || undefined,
      order,
      is_active: isActive,
    };
    const res =
      mode === "create"
        ? await createBrandAction(payload)
        : await updateBrandAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Brand added" : "Brand updated");
    router.push("/admin/brands");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New brand" : "Edit brand"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Brands", href: "/admin/brands" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
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

          <ImageInput
            label="Logo"
            required
            description="Best on transparent backgrounds. SVG or high-res PNG recommended."
            value={logo}
            onChange={setLogo}
            previewAspect="3/1"
          />

          <div className="space-y-2">
            <Label htmlFor="href">Link (optional)</Label>
            <Input
              id="href"
              type="url"
              placeholder="https://brand.example"
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />
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
          onClick={() => router.push("/admin/brands")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add brand" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
