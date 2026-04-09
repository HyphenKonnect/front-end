"use client";

import { useState } from "react";
import { StatusBanner } from "../ui/StatusBanner";
import { apiFetch, parseJsonResponse } from "../../lib/api";

type FormState = {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  yearsExperience: string;
  message: string;
};

export function ProfessionalApplicationForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    yearsExperience: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (key: keyof FormState) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiFetch("/api/professional-applications", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          specialization: form.specialization,
          yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : null,
          message: form.message,
        }),
      });

      const data = await parseJsonResponse<{ message?: string }>(response);
      setSuccess(
        data.message || "Thanks! Our operations team will reach out shortly.",
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        yearsExperience: "",
        message: "",
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not submit your application right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {success ? (
        <StatusBanner tone="success" title="Application submitted">
          {success}
        </StatusBanner>
      ) : null}

      {error ? (
        <StatusBanner tone="error" title="Submission failed">
          {error}
        </StatusBanner>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
          Full name
        </span>
        <input
          required
          value={form.name}
          onChange={(event) => updateField("name")(event.target.value)}
          className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
          placeholder="Your full name"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
          Email address
        </span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => updateField("email")(event.target.value)}
          className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
          Phone number
        </span>
        <input
          value={form.phone}
          onChange={(event) => updateField("phone")(event.target.value)}
          className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
          placeholder="+91 ..."
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
          Specialization
        </span>
        <input
          value={form.specialization}
          onChange={(event) => updateField("specialization")(event.target.value)}
          className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
          placeholder="Clinical Psychologist, Legal Advisor, ..."
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
          Years of experience
        </span>
        <input
          type="number"
          min={0}
          value={form.yearsExperience}
          onChange={(event) => updateField("yearsExperience")(event.target.value)}
          className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
          placeholder="e.g. 5"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
          Tell us about your practice
        </span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(event) => updateField("message")(event.target.value)}
          className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
          placeholder="Share your background, preferred working hours, and anything you want the ops team to know."
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-3.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
