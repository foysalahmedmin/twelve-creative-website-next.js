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
import {
  sendTestNotificationEmailAction,
  updateSiteSettingAction,
} from "@/lib/api/site-setting-actions";

interface Props {
  initial: SiteSetting;
}

// Empty strings are intentional PATCH values for clearable settings. Sending
// `undefined` would make JSON omit the key and silently preserve the old value.
const persistedText = (value: string): string => value.trim();

export function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [faqImageUploading, setFaqImageUploading] = useState(false);

  const [form, setForm] = useState({
    contact_email: initial.contact_email ?? "",
    contact_phone: initial.contact_phone ?? "",
    contact_address: initial.contact_address ?? "",
    contact_whatsapp: initial.contact_whatsapp ?? "",
    contact_map_embed_url: initial.contact_map_embed_url ?? "",
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
    inquiry_label: initial.contact_page?.inquiry?.label ?? "",
    inquiry_title: initial.contact_page?.inquiry?.title ?? "",
    inquiry_description: initial.contact_page?.inquiry?.description ?? "",
    booking_label: initial.contact_page?.booking?.label ?? "",
    booking_title: initial.contact_page?.booking?.title ?? "",
    booking_description: initial.contact_page?.booking?.description ?? "",
    map_label: initial.contact_page?.map?.label ?? "",
    map_title: initial.contact_page?.map?.title ?? "",
    map_description: initial.contact_page?.map?.description ?? "",
    footer_description: initial.footer?.description ?? "",
    footer_cta_text: initial.footer?.cta_text ?? "",
    footer_cta_label: initial.footer?.cta_label ?? "",
    footer_cta_href: initial.footer?.cta_href ?? "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((s) => ({ ...s, [key]: value }));

  const effectiveRecipients = initial.notification_recipients_effective ?? [];
  // When the field is blank the server falls back to its configured sender,
  // which is exactly what `effectiveRecipients` already resolves to.
  const defaultRecipientLabel = initial.booking_notification_email?.trim()
    ? ""
    : effectiveRecipients.join(", ");
  // The test targets the saved value, so an unsaved edit would silently test
  // the wrong address.
  const notificationEmailDirty =
    form.booking_notification_email.trim() !==
    (initial.booking_notification_email ?? "").trim();

  const handleSendTestEmail = async () => {
    setTestingEmail(true);
    const res = await sendTestNotificationEmailAction();
    setTestingEmail(false);
    if (!res.ok) {
      toast.error(res.error ?? "Could not send the test email");
      return;
    }
    toast.success(
      `Test email sent to ${res.data?.recipients.join(", ")}. Check the inbox to confirm it arrived.`,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (faqImageUploading) {
      toast.error("Wait for the FAQ image upload to finish before saving");
      return;
    }
    setSaving(true);
    const res = await updateSiteSettingAction({
      contact_email: persistedText(form.contact_email),
      contact_phone: persistedText(form.contact_phone),
      contact_address: persistedText(form.contact_address),
      contact_whatsapp: persistedText(form.contact_whatsapp),
      contact_map_embed_url: persistedText(form.contact_map_embed_url),
      booking_notification_email: persistedText(
        form.booking_notification_email,
      ),
      social: {
        instagram: persistedText(form.instagram),
        linkedin: persistedText(form.linkedin),
        youtube: persistedText(form.youtube),
        x: persistedText(form.x),
        facebook: persistedText(form.facebook),
      },
      faq_section: {
        image: persistedText(form.faq_image),
        image_alt: persistedText(form.faq_image_alt),
        title: persistedText(form.faq_title),
        description: persistedText(form.faq_description),
        name: persistedText(form.faq_name),
        position: persistedText(form.faq_position),
        contact_link: persistedText(form.faq_contact_link),
      },
      calendly_url: persistedText(form.calendly_url),
      contact_page: {
        inquiry: {
          label: persistedText(form.inquiry_label),
          title: persistedText(form.inquiry_title),
          description: persistedText(form.inquiry_description),
        },
        booking: {
          label: persistedText(form.booking_label),
          title: persistedText(form.booking_title),
          description: persistedText(form.booking_description),
        },
        map: {
          label: persistedText(form.map_label),
          title: persistedText(form.map_title),
          description: persistedText(form.map_description),
        },
      },
      footer: {
        description: persistedText(form.footer_description),
        cta_text: persistedText(form.footer_cta_text),
        cta_label: persistedText(form.footer_cta_label),
        cta_href: persistedText(form.footer_cta_href),
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
          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp">WhatsApp</Label>
            <Input
              id="contact_whatsapp"
              value={form.contact_whatsapp}
              onChange={(e) => update("contact_whatsapp", e.target.value)}
              placeholder="+1 951 822 6223"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_map_embed_url">Map embed URL</Label>
            <Input
              id="contact_map_embed_url"
              type="url"
              value={form.contact_map_embed_url}
              onChange={(e) => update("contact_map_embed_url", e.target.value)}
              placeholder="https://maps.google.com/maps?...&output=embed"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">
            Contact Page Content
          </h3>
          <p className="text-muted-foreground text-xs">
            Editable section copy; the form structure and validation remain
            code-controlled.
          </p>
        </div>
        {(
          [
            ["inquiry", "Inquiry section"],
            ["booking", "Booking section"],
            ["map", "Contact & map section"],
          ] as const
        ).map(([prefix, heading]) => (
          <div
            key={prefix}
            className="border-border space-y-3 rounded-lg border p-4"
          >
            <h4 className="text-foreground text-sm font-medium">{heading}</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${prefix}_label`}>Label</Label>
                <Input
                  id={`${prefix}_label`}
                  value={form[`${prefix}_label`]}
                  onChange={(e) => update(`${prefix}_label`, e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${prefix}_title`}>Title</Label>
                <Input
                  id={`${prefix}_title`}
                  value={form[`${prefix}_title`]}
                  onChange={(e) => update(`${prefix}_title`, e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${prefix}_description`}>Description</Label>
              <Textarea
                id={`${prefix}_description`}
                rows={3}
                value={form[`${prefix}_description`]}
                onChange={(e) =>
                  update(`${prefix}_description`, e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">
            Footer Content
          </h3>
          <p className="text-muted-foreground text-xs">
            Global footer description and conversion strip.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="footer_description">Brand description</Label>
          <Textarea
            id="footer_description"
            rows={3}
            value={form.footer_description}
            onChange={(e) => update("footer_description", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="footer_cta_text">CTA prompt</Label>
          <Input
            id="footer_cta_text"
            value={form.footer_cta_text}
            onChange={(e) => update("footer_cta_text", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="footer_cta_label">Button label</Label>
            <Input
              id="footer_cta_label"
              value={form.footer_cta_label}
              onChange={(e) => update("footer_cta_label", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer_cta_href">Button link</Label>
            <Input
              id="footer_cta_href"
              value={form.footer_cta_href}
              onChange={(e) => update("footer_cta_href", e.target.value)}
              placeholder="/contact"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-foreground text-sm font-semibold">
            Notifications
          </h3>
          <p className="text-muted-foreground text-xs">
            Where booking and contact form submissions are emailed.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking_notification_email">Notification email</Label>
          {/* Deliberately not type="email": the browser rejects a
              comma-separated list, which would block the whole form. */}
          <Input
            id="booking_notification_email"
            type="text"
            inputMode="email"
            autoComplete="off"
            placeholder={defaultRecipientLabel}
            value={form.booking_notification_email}
            onChange={(e) =>
              update("booking_notification_email", e.target.value)
            }
            aria-describedby="booking_notification_email_help"
          />
          <p
            id="booking_notification_email_help"
            className="text-muted-foreground text-xs"
          >
            Separate several addresses with commas to notify more than one
            person. Leave it empty to use the default
            {defaultRecipientLabel ? ` (${defaultRecipientLabel})` : ""}.
          </p>
        </div>

        <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-3">
          <div className="text-xs">
            <span className="text-muted-foreground">Currently sending to </span>
            {effectiveRecipients.length ? (
              <span className="text-foreground font-medium">
                {effectiveRecipients.join(", ")}
              </span>
            ) : (
              <span className="text-destructive font-medium">
                nobody — set an address above, or notifications will not be
                delivered.
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendTestEmail}
              disabled={
                testingEmail ||
                notificationEmailDirty ||
                !effectiveRecipients.length
              }
            >
              {testingEmail && <Loader2 className="size-4 animate-spin" />}
              {testingEmail ? "Sending…" : "Send test email"}
            </Button>
            {notificationEmailDirty && (
              <span className="text-muted-foreground text-xs">
                Save your change first — the test goes to the saved address.
              </span>
            )}
          </div>
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
            description="Paste an HTTP(S) URL or upload a square coordinator photo."
            allowRelative
            value={form.faq_image}
            onChange={(v) => update("faq_image", v)}
            onUploadingChange={setFaqImageUploading}
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

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || faqImageUploading}>
          {(saving || faqImageUploading) && (
            <Loader2 className="size-4 animate-spin" />
          )}
          <span aria-live="polite">
            {faqImageUploading
              ? "Uploading image…"
              : saving
                ? "Saving…"
                : "Save changes"}
          </span>
        </Button>
      </div>
    </form>
  );
}
