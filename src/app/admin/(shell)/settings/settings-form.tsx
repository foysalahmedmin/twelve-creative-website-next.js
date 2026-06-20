"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageInput } from "@/components/admin/inputs/image-input";
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
    faq_image: initial.faq_section?.image ?? "",
    faq_image_alt: initial.faq_section?.image_alt ?? "",
    faq_title: initial.faq_section?.title ?? "",
    faq_description: initial.faq_section?.description ?? "",
    faq_name: initial.faq_section?.name ?? "",
    faq_position: initial.faq_section?.position ?? "",
    faq_contact_link: initial.faq_section?.contact_link ?? "",
    calendly_url: initial.calendly_url ?? "",
    process_thumbnail: initial.process_thumbnail ?? "",
    how_we_structure_image: initial.how_we_structure_image ?? "",
    meeting_scene_image: initial.meeting_scene_image ?? "",
    cs_title: initial.content_section?.title ?? "",
    cs_subtitle: initial.content_section?.subtitle ?? "",
    cs_body: initial.content_section?.body ?? "",
    cs_image: initial.content_section?.image ?? "",
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
      faq_section: {
        image: form.faq_image || undefined,
        image_alt: form.faq_image_alt || undefined,
        title: form.faq_title || undefined,
        description: form.faq_description || undefined,
        name: form.faq_name || undefined,
        position: form.faq_position || undefined,
        contact_link: form.faq_contact_link || undefined,
      },
      calendly_url: form.calendly_url || undefined,
      process_thumbnail: form.process_thumbnail || undefined,
      how_we_structure_image: form.how_we_structure_image || undefined,
      meeting_scene_image: form.meeting_scene_image || undefined,
      content_section: {
        title: form.cs_title || undefined,
        subtitle: form.cs_subtitle || undefined,
        body: form.cs_body || undefined,
        image: form.cs_image || undefined,
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

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">FAQ Section</h3>
          <p className="text-muted-foreground text-xs">
            The coordinator profile card shown beside the FAQ list on the home,
            about, and contact pages. Leave blank to use the built-in defaults.
          </p>
        </div>
        <div className="space-y-2">
          <ImageInput
            label="Photo"
            value={form.faq_image}
            onChange={(v) => update("faq_image", v)}
            previewAspect="1/1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq_image_alt">Photo alt text</Label>
          <Input
            id="faq_image_alt"
            value={form.faq_image_alt}
            onChange={(e) => update("faq_image_alt", e.target.value)}
            placeholder="e.g. Carlos Doce — Founder of Twelve Creative"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq_title">Heading</Label>
          <Input
            id="faq_title"
            value={form.faq_title}
            onChange={(e) => update("faq_title", e.target.value)}
            placeholder="e.g. Have more questions?"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq_description">Description</Label>
          <Textarea
            id="faq_description"
            rows={3}
            value={form.faq_description}
            onChange={(e) => update("faq_description", e.target.value)}
            placeholder="Short paragraph shown below the heading"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="faq_name">Name</Label>
            <Input
              id="faq_name"
              value={form.faq_name}
              onChange={(e) => update("faq_name", e.target.value)}
              placeholder="e.g. Carlos Doce"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faq_position">Position</Label>
            <Input
              id="faq_position"
              value={form.faq_position}
              onChange={(e) => update("faq_position", e.target.value)}
              placeholder="e.g. Founder, Twelve Creative"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="faq_contact_link">CTA link</Label>
            <Input
              id="faq_contact_link"
              value={form.faq_contact_link}
              onChange={(e) => update("faq_contact_link", e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Booking</h3>
          <p className="text-muted-foreground text-xs">
            If a Calendly URL is set, all "Book A Call" buttons link directly to
            it instead of opening the built-in booking form.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="calendly_url">Calendly URL</Label>
          <Input
            id="calendly_url"
            type="url"
            placeholder="https://calendly.com/your-link"
            value={form.calendly_url}
            onChange={(e) => update("calendly_url", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Page Media</h3>
          <p className="text-muted-foreground text-xs">
            Visual assets for specific public sections. Leave blank to use the
            built-in placeholder images.
          </p>
        </div>
        <ImageInput
          label="Process section thumbnail (C4)"
          description="Shown in the sticky left column of the Process section. Portrait / 3:4 works best."
          value={form.process_thumbnail}
          onChange={(v) => update("process_thumbnail", v)}
          previewAspect="3/4"
        />
        <ImageInput
          label="How we structure — section image (C5)"
          description="Visual asset displayed in The Twelve Creative Difference section. Landscape 16:9 works best."
          value={form.how_we_structure_image}
          onChange={(v) => update("how_we_structure_image", v)}
          previewAspect="16/9"
        />
        <ImageInput
          label="Founder / Meeting scene photo (C6)"
          description="Shown in the founder bio card on the About page. Portrait 3:4 works best."
          value={form.meeting_scene_image}
          onChange={(v) => update("meeting_scene_image", v)}
          previewAspect="3/4"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">
            About Story Section (C7)
          </h3>
          <p className="text-muted-foreground text-xs">
            Controls the "Merging Art and Science" section on the About page.
            Leave fields blank to use the built-in defaults.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cs_title">Section heading</Label>
            <Input
              id="cs_title"
              placeholder="Merging Art and Science"
              value={form.cs_title}
              onChange={(e) => update("cs_title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cs_subtitle">Eyebrow / label</Label>
            <Input
              id="cs_subtitle"
              placeholder="Our Story"
              value={form.cs_subtitle}
              onChange={(e) => update("cs_subtitle", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs_body">Section description</Label>
          <Textarea
            id="cs_body"
            rows={3}
            placeholder="Short paragraph shown below the heading…"
            value={form.cs_body}
            onChange={(e) => update("cs_body", e.target.value)}
          />
        </div>
        <ImageInput
          label="Section image"
          description="Main sticky image shown in the left column of the story section."
          value={form.cs_image}
          onChange={(v) => update("cs_image", v)}
          previewAspect="1/1"
        />
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
