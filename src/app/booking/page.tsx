"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { professionals, serviceCatalog } from "../../components/site/data";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const professionalOptions = useMemo(() => {
    return professionals.filter((item) => {
      if (!selectedService) return false;
      if (selectedService === "mental-wellness") return item.category === "therapist";
      if (selectedService === "medical-consultation") return item.category === "doctor";
      if (selectedService === "legal-guidance") return item.category === "legal";
      return item.category === "wellness";
    });
  }, [selectedService]);

  const selectedPro = professionals.find((item) => item.id === selectedProfessional);

  return (
    <div className="min-h-screen bg-[#f7f5f4] pt-20">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            {[1, 2, 3, 4].map((current) => (
              <div key={current} className="flex flex-1 items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold ${step >= current ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {current}
                </div>
                {current < 4 ? (
                  <div className={`mx-2 h-1 flex-1 rounded ${step > current ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]" : "bg-gray-200"}`} />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[12px] font-medium text-[#7e7e7e]">
            <span>Select Service</span>
            <span>Choose Professional</span>
            <span>Pick Date & Time</span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {step === 1 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Select Your Service</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Choose the type of support you need.</p>
            <div className="grid gap-6 md:grid-cols-2">
              {serviceCatalog.map((service) => (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => setSelectedService(service.slug)}
                  className={`rounded-[24px] bg-white p-8 text-left transition-all ${selectedService === service.slug ? "border-2 border-[#f56969] shadow-lg" : "border-2 border-transparent"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${selectedService === service.slug ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]" : "bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10"}`}>
                      <service.icon className={`h-7 w-7 ${selectedService === service.slug ? "text-white" : "text-[#f56969]"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[20px] font-bold text-[#2b2b2b]">{service.title}</h3>
                      <p className="text-[14px] text-[#7e7e7e]">{service.tagline}</p>
                    </div>
                    {selectedService === service.slug ? <CheckCircle className="h-6 w-6 text-[#f56969]" /> : null}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Choose Your Professional</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Select a professional who fits your needs.</p>
            <div className="grid gap-6 md:grid-cols-3">
              {professionalOptions.map((pro) => (
                <button
                  key={pro.id}
                  type="button"
                  onClick={() => setSelectedProfessional(pro.id)}
                  className={`overflow-hidden rounded-[24px] bg-white text-left transition-all ${selectedProfessional === pro.id ? "border-2 border-[#f56969] shadow-lg" : "border-2 border-transparent"}`}
                >
                  <img src={pro.image} alt={pro.name} className="h-[200px] w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-[18px] font-bold text-[#2b2b2b]">{pro.name}</h3>
                    <p className="mb-3 text-[14px] text-[#f56969]">{pro.specialty}</p>
                    <div className="flex items-center justify-between text-[13px] text-[#7e7e7e]">
                      <span>{pro.experience}</span>
                      <span>{pro.rate}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Pick Date & Time</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Choose a time that works for you.</p>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="rounded-[24px] bg-white p-8">
                <label className="mb-3 block text-[14px] font-medium text-[#2b2b2b]">Preferred Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-2xl border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3"
                />
              </div>
              <div className="rounded-[24px] bg-white p-8">
                <label className="mb-3 block text-[14px] font-medium text-[#2b2b2b]">Available Time Slots</label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium ${selectedTime === slot ? "bg-[#2b2b2b] text-white" : "bg-[#f7f5f4] text-[#2b2b2b]"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <div className="rounded-[28px] bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-[36px] font-bold text-[#2b2b2b]">Confirm Your Booking</h2>
            <div className="space-y-4 text-[16px] text-[#7e7e7e]">
              <p><span className="font-semibold text-[#2b2b2b]">Service:</span> {serviceCatalog.find((item) => item.slug === selectedService)?.title}</p>
              <p><span className="font-semibold text-[#2b2b2b]">Professional:</span> {selectedPro?.name}</p>
              <p><span className="font-semibold text-[#2b2b2b]">Date:</span> {selectedDate}</p>
              <p><span className="font-semibold text-[#2b2b2b]">Time:</span> {selectedTime}</p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href={`/consultation/demo-session`} className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-8 py-4 text-center font-medium text-white">
                Confirm & Continue
              </Link>
              <button type="button" onClick={() => setStep(3)} className="rounded-full border border-[#2b2b2b] px-8 py-4 font-medium text-[#2b2b2b]">
                Edit Details
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1}
            className="rounded-full border border-[#2b2b2b] px-6 py-3 text-sm font-medium text-[#2b2b2b] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((current) => Math.min(4, current + 1))}
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedProfessional) ||
              (step === 3 && (!selectedDate || !selectedTime)) ||
              step === 4
            }
            className="rounded-full bg-[#2b2b2b] px-6 py-3 text-sm font-medium text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
