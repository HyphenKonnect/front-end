"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { contactCards } from "../../components/site/data";
import {
  GradientCta,
  PageHero,
  SurfaceCard,
} from "../../components/site/page-primitives";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") {
      return {
        name: "",
        email: "",
        phone: "",
        service: "Mental Wellness",
        message: "",
      };
    }

    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const professional = params.get("professional");
    const mode = params.get("mode");
    const slotOne = params.get("slotOne");
    const slotTwo = params.get("slotTwo");
    const message = params.get("message");

    const requestMessage = professional
      ? [
          mode === "package-request"
            ? `I would like to request a 2-session legal package with ${professional}.`
            : `I would like to request a legal session with ${professional}.`,
          slotOne ? `Preferred slot 1: ${slotOne}.` : "",
          slotTwo ? `Preferred slot 2: ${slotTwo}.` : "",
          message || "",
        ]
          .filter(Boolean)
          .join(" ")
      : message || "";

    return {
      name: params.get("name") || "",
      email: params.get("email") || "",
      phone: params.get("phone") || "",
      service:
        service === "mental-wellness"
          ? "Mental Wellness"
          : service === "medical-consultation"
            ? "Medical Consultation"
            : service === "legal-guidance" || service === "Legal Guidance"
              ? "Legal Guidance"
              : service === "wellness-programs"
                ? "Wellness Programs"
                : service || "Mental Wellness",
      message: requestMessage,
    };
  });

  return (
    <div className="pt-20">
      <PageHero
        eyebrow="Get in Touch"
        title="We're Here to"
        highlight="Help You"
        description="Have questions or need support? Our team is ready to guide you toward the right service and next step."
      />

      <section className="bg-[#f7f5f4] px-6 py-20 lg:px-[120px]">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2">
          <SurfaceCard className="shadow-lg">
            {submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-[14px] text-green-700">
                Thank you. Your message has been sent successfully.
              </div>
            ) : null}
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <h2 className="mb-6 text-[32px] font-bold text-[#2b2b2b]">
                Send Us a Message
              </h2>
              <Input
                label="Full Name *"
                name="name"
                value={form.name}
                onChange={(value) =>
                  setForm((current) => ({ ...current, name: value }))
                }
              />
              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({ ...current, email: value }))
                }
              />
              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({ ...current, phone: value }))
                }
              />
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#2b2b2b]">
                  Service Needed
                </label>
                <select
                  value={form.service}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      service: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 outline-none"
                >
                  <option>Mental Wellness</option>
                  <option>Medical Consultation</option>
                  <option>Legal Guidance</option>
                  <option>Wellness Programs</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#2b2b2b]">
                  Message *
                </label>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  className="min-h-[140px] w-full rounded-2xl border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-8 py-4 font-medium text-white shadow-lg"
              >
                Send Message
                <Send className="h-4 w-4" />
              </button>
            </form>
          </SurfaceCard>

          <div>
            <h2 className="mb-6 text-[32px] font-bold text-[#2b2b2b]">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white p-8">
                <h3 className="mb-4 text-[20px] font-bold text-[#2b2b2b]">
                  Call Us or WhatsApp
                </h3>
                <p className="mb-4 text-[15px] text-[#7e7e7e]">
                  Reach out to us directly via phone or WhatsApp for immediate
                  assistance.
                </p>
                <a
                  href="https://wa.me/917075914141"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  +91 7075914141
                </a>
              </div>

              <div className="rounded-[24px] bg-white p-8">
                <h3 className="mb-4 text-[20px] font-bold text-[#2b2b2b]">
                  Email Us
                </h3>
                <p className="mb-4 text-[15px] text-[#7e7e7e]">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <a
                  href="mailto:support@thehyphenkonnect.com"
                  className="text-[16px] font-medium text-[#f56969] hover:underline"
                >
                  support@thehyphenkonnect.com
                </a>
              </div>

              <div className="space-y-4">
                {[
                  "Quick response during business hours",
                  "Personalized routing to the right specialist",
                  "Confidential communication throughout",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10 text-[#f56969]">
                      {index + 1}
                    </div>
                    <p className="pt-2 text-[14px] text-[#7e7e7e]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GradientCta
        title="Need Help Right away?"
        description="Book a session online or browse available professionals to find the right kind of support."
        primaryHref="/booking"
        primaryLabel="Book a Session"
        secondaryHref="/professionals"
        secondaryLabel="View Professionals"
      />
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#2b2b2b]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 outline-none"
      />
    </div>
  );
}
