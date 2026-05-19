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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createFaqAction,
  updateFaqAction,
  type FaqInput,
} from "@/lib/api/faqs-actions";
import type { Faq } from "@/lib/api/faqs";

interface Props {
  mode: "create" | "edit";
  initial?: Faq;
}

export function FaqForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [group, setGroup] = useState(initial?.group ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setSaving(true);
    const payload: FaqInput = {
      question: question.trim(),
      answer: answer.trim(),
      group: group || undefined,
      order,
      is_active: isActive,
    };
    const res =
      mode === "create"
        ? await createFaqAction(payload)
        : await updateFaqAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "FAQ added" : "FAQ updated");
    router.push("/admin/faqs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New FAQ" : "Edit FAQ"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "FAQs", href: "/admin/faqs" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="question">
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              required
              maxLength={200}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">
              Answer <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="answer"
              required
              rows={5}
              maxLength={1500}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              {answer.length} / 1500 · plain text
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="group">Group (optional)</Label>
              <Input
                id="group"
                placeholder="General / Pricing / …"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </div>
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/faqs")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add FAQ" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
