"use client";

import { motion } from "framer-motion";
import { Brain, CheckCircle, Scale, Stethoscope } from "lucide-react";

const professionalsScroll = [
  {
    images: [
      "https://images.unsplash.com/photo-1636342686573-2dd5b47d5ff0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1714976695024-55a90b113f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1659353219716-699803846194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1610547315412-d8812f60cf76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    images: [
      "https://images.unsplash.com/photo-1683348758606-860c720fda9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1615177393579-5fc7431152c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1659353888075-e6c1615fc0a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1659352790848-b6455e5a2129?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    images: [
      "https://images.unsplash.com/photo-1743017524261-f026c51acf7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1659355894117-0ae6f8f28d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1773212902295-14c35ee22235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1750698545009-679820502908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
                  <div className="scroll-left flex gap-4">
                    {[...item.images, ...item.images].map((img, imgIndex) => (
                      <div
                        key={`${item.service.title}-${imgIndex}`}
                        className="h-[250px] w-[200px] flex-shrink-0 overflow-hidden rounded-[20px] shadow-lg"
                      >
                        <img
                          src={img}
                          alt={`Professional ${imgIndex + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
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
