"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Brain, CheckCircle, Scale, Stethoscope } from "lucide-react";
import { professionals } from "./data";

const professionalsScroll = [
  {
    people: [
      "Sritha Nandiraj",
      "Aashritha Akula",
      "Titir Dewan",
      "Shreya Aila",
      "Dr. Rucha Chhajed",
      "Sowmiya Bhas",
    ],
    service: {
      icon: Brain,
      title: "Mental Wellness Therapy",
      description:
        "Connect with experienced therapists and counselors who provide compassionate care for your mental health journey.",
      features: [
        "Licensed Therapists",
        "24/7 Availability",
        "Confidential Sessions",
      ],
      gradient: "from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10",
    },
  },
  {
    people: [
      "Madhurika Jalakam",
      "Dr. M Mamatha Yadav",
      "Dr. Mounish Reddy",
    ],
    service: {
      icon: Stethoscope,
      title: "Medical Consultation",
      description:
        "Consult with board-certified doctors and healthcare professionals for expert medical advice and treatment.",
      features: [
        "Board Certified Doctors",
        "Quick Diagnosis",
        "Prescription Services",
      ],
      gradient: "from-[#c6daf3]/20 to-[#b9c9dd]/20",
    },
  },
  {
    people: [
      "Sreshta Rao Madhavaram",
      "Anuraag Badeti",
      "B. Vishnu Rao",
      "Ashima Sood",
      "Muthyala Preetham Shankar",
      "Vidisha Bhate",
    ],
    service: {
      icon: Scale,
      title: "Legal Guidance & Wellness",
      description:
        "Get professional legal advice and wellness coaching from experienced experts who understand your unique challenges.",
      features: [
        "Expert Legal Counsel",
        "Wellness Programs",
        "Holistic Support",
      ],
      gradient: "from-[#e6b9e6]/20 to-[#ffdbff]/20",
    },
  },
];

export function ProfessionalsScrollSection() {
  return (
    <section id="professionals" className="bg-white px-6 py-20 lg:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-base text-[#7e7e7e]"
          >
            Our Professionals
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-[45px] font-bold leading-[48px] tracking-[-1.8px] text-[#2b2b2b]"
          >
            Meet Our{" "}
            <span className="bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] bg-clip-text text-transparent">
              Expert Team
            </span>
          </motion.h2>
        </div>

        <div className="space-y-16">
          {professionalsScroll.map((item, index) => (
            <motion.div
              key={item.service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="grid items-center gap-8 md:grid-cols-2"
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div
                  className={`h-full rounded-[28px] bg-gradient-to-r ${item.service.gradient} p-8 backdrop-blur-sm`}
                >
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${item.service.gradient} border-2 border-[#f56969]/20`}
                  >
                    <item.service.icon className="h-8 w-8 text-[#f56969]" />
                  </div>
                  <h3 className="mb-4 text-[28px] font-bold text-[#2b2b2b]">
                    {item.service.title}
                  </h3>
                  <p className="mb-6 text-base leading-[26px] text-[#7e7e7e]">
                    {item.service.description}
                  </p>
                  <div className="space-y-3">
                    {item.service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#f56969]" />
                        <span className="text-[15px] font-medium text-[#2b2b2b]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <div className="scroll-container overflow-hidden">
                  <div
                    className={`flex gap-4 ${
                      index % 2 === 1
                        ? "team-scroll-track-reverse"
                        : "team-scroll-track"
                    }`}
                  >
                    {[...item.people, ...item.people].map((name, personIndex) => {
                      const professional = professionals.find(
                        (entry) => entry.name === name,
                      );

                      if (!professional) return null;

                      return (
                        <article
                          key={`${item.service.title}-${personIndex}-${name}`}
                          className="group relative h-[280px] w-[220px] flex-shrink-0 overflow-hidden rounded-[24px] shadow-lg"
                        >
                          <div className="h-full bg-[linear-gradient(180deg,#ece1d7_0%,#f7f2ed_100%)] p-3 pb-0">
                            <img
                              src={professional.image}
                              alt={professional.name}
                              className="h-full w-full rounded-t-[20px] object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#201b26] via-[#201b26]/20 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <div className="rounded-[18px] bg-white/90 p-4 backdrop-blur-sm">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-[15px] font-semibold leading-5 text-[#2b2b2b]">
                                  {professional.name}
                                </p>
                                <Link
                                  href={`/professionals/${professional.slug}`}
                                  aria-label={`View ${professional.name} profile`}
                                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] text-white shadow-md"
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
