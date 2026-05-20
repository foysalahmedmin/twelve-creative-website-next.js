"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSetting } from "@/lib/api/site-setting";
import { updateSiteSettingAction } from "@/lib/api/site-setting-actions";

interface Props {
  initial: SiteSetting;
}

export function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    contact_email: initial.contact_email ?? "",
    contact_phone: initial.contact_phone ?? "",
    contact_address: initial.contact_address ?? "",
    booking_notification_email: initial.booking_notification_email ?? "",
    instagram: initial.social?.instagram ?? "",
    linkedin: initial.social?.linkedin ?? "",
    youtube: initial.social?.youtube ?? "",
    x: initial.social?.x ?? "",
    facebook: initial.social?.facebook ?? "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateSiteSettingAction({
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      contact_address: form.contact_address,
      booking_notification_email: form.booking_notification_email,
      social: {
        instagram: form.instagram || undefined,
        linkedin: form.linkedin || undefined,
        youtube: form.youtube || undefined,
        x: form.x || undefined,
        facebook: form.facebook || undefined,
      },
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success("Settings saved");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Contact</h3>
          <p className="text-muted-foreground text-xs">
            Shown in the footer and on the Contact page.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone</Label>
            <Input
              id="contact_phone"
              value={form.contact_phone}
              onChange={(e) => update("contact_phone", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contact_address">Address</Label>
            <Textarea
              id="contact_address"
              rows={2}
              value={form.contact_address}
              onChange={(e) => update("contact_address", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Notifications</h3>
          <p className="text-muted-foreground text-xs">
            Where booking and contact submissions get emailed. Defaults to the SMTP user.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking_notification_email">Notification email</Label>
          <Input
            id="booking_notification_email"
            type="email"
            value={form.booking_notification_email}
            onChange={(e) =>
              update("booking_notification_email", e.target.value)
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Social</h3>
          <p className="text-muted-foreground text-xs">
            Used by the footer social icons. Leave blank to hide.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(
            [
              ["instagram", "Instagram"],
              ["linkedin", "LinkedIn"],
              ["youtube", "YouTube"],
              ["x", "X / Twitter"],
              ["facebook", "Facebook"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="url"
                placeholder="https://…"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
