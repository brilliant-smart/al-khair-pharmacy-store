import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STORE_COORDINATES = {
  lat: 10.3107763889513,
  lng: 9.84162327116456,
};

const openInMaps = () => {
  window.open(
    `https://www.google.com/maps?q=${STORE_COORDINATES.lat},${STORE_COORDINATES.lng}`,
    "_blank"
  );
};

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: ["No. C10, Kobi Street,", "Off Gwallaga Street, Bauchi"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 706 313 4838"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@alkhairstore.com", "pharmacy@alkhairstore.com"],
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Mon - Sat: 8AM - 9PM", "Sunday: 10AM - 6PM"],
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-background relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/50 hidden lg:block" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-primary text-sm uppercase tracking-widest mb-4 block">
              Contact Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              We'd Love to
              <span className="block gradient-text">Hear from You</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg mb-10">
              Whether you are seeking guidance, placing large orders, or simply
              exploring our offerings, our expert team is ready to assist with
              care, precision, and meticulous attention to every detail.
            </p>

            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-muted rounded-2xl p-6 hover:shadow-card transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  {item.details.map((detail) => (
                    <p
                      key={detail}
                      className="font-body text-muted-foreground text-sm"
                    >
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Interactive Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <div
                onClick={openInMaps}
                className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-elegant transition-shadow"
              >
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${STORE_COORDINATES.lng}!3d${STORE_COORDINATES.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDE4JzM4LjgiTiA5wrA1MCczMC4wIkU!5e0!3m2!1sen!2sng!4v1704000000000!5m2!1sen!2sng`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                  title="Al-Khair Store Location"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 font-body text-sm font-medium shadow-lg">
                    <ExternalLink className="h-4 w-4" />
                    Open in Google Maps
                  </div>
                </div>
              </div>
              <p className="font-body text-muted-foreground text-xs mt-2 text-center">
                Click the map to view directions
              </p>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 p-6 bg-secondary rounded-2xl flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <div className="flex-grow">
                <h4 className="font-display text-lg font-semibold text-secondary-foreground">
                  Reach out to us on WhatsApp
                </h4>
                <p className="font-body text-secondary-foreground/80 text-sm">
                  Message us directly, we’re happy to help!
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-green-500 hover:bg-green-600 text-white font-body"
                onClick={() =>
                  window.open("https://wa.me/2347063134838", "_blank")
                }
              >
                Chat on WhatsApp
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pl-8"
          >
            <div className="bg-muted rounded-3xl p-8 md:p-10 shadow-elegant">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Send us a Message
              </h3>
              <p className="font-body text-muted-foreground mb-8">
                Complete the form below and we’ll respond as soon as possible.
              </p>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="Salisu Abubakar"
                      className="h-12 font-body bg-background border-border"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-2">
                      Phone Number
                    </label>
                    <Input
                      placeholder="+234 706 313 4838"
                      className="h-12 font-body bg-background border-border"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="salisu@example.com"
                    className="h-12 font-body bg-background border-border"
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-2">
                    Subject
                  </label>
                  <Input
                    placeholder="How can we assist you?"
                    className="h-12 font-body bg-background border-border"
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Please write your message here…"
                    rows={4}
                    className="font-body bg-background border-border resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 font-body text-base gradient-primary hover:opacity-90 transition-opacity"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
