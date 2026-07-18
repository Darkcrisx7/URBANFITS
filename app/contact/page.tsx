"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { CONTACT, whatsappLink } from "@/lib/contact";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <Container className="py-16">
      <p className="text-xs font-semibold uppercase tracking-widest2 text-chrome-bright">Get in touch</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tightest md:text-5xl">Contact Us</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-2xl bg-success/10 p-6 text-success"
              >
                <CheckCircle2 size={20} /> Message sent — we'll reply within 24 hours.
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" required />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 space-y-4 text-sm text-silver/80">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-chrome" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-bone">{CONTACT.email}</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-chrome" />
              <a href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`} className="hover:text-bone">{CONTACT.phone1}</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-chrome" />
              <a href={`tel:${CONTACT.phone2.replace(/\s/g, "")}`} className="hover:text-bone">{CONTACT.phone2}</a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-chrome" /> Bengaluru, Karnataka, India
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1ebc59]"
            >
              Chat on WhatsApp
            </a>
            <div className="flex gap-4 pt-2 text-chrome">
              <Instagram size={18} className="cursor-pointer hover:text-bone" />
              <Twitter size={18} className="cursor-pointer hover:text-bone" />
            </div>
          </div>
        </div>

        <div className="aspect-square w-full overflow-hidden rounded-3xl md:aspect-auto md:h-full">
          <iframe
            title="UrbanFits.Store location"
            className="h-full w-full min-h-[320px] border-0"
            loading="lazy"
            src="https://www.google.com/maps?q=Bengaluru,Karnataka,India&output=embed"
          />
        </div>
      </div>
    </Container>
  );
}
