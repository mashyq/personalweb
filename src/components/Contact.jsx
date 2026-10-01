import { useState } from "react";
import { profile, services } from "../data/site";
import { cn } from "../lib/cn";
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
} from "./Icons";
import { Backdrop, StatusPill } from "./ui/Backdrop";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/**
 * Where the form POSTs. Set VITE_CONTACT_ENDPOINT in .env to a Formspree,
 * Web3Forms or Basin URL to receive submissions directly on Vercel.
 * Without it the form falls back to opening the visitor's email client.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = ({ name, email, message }) => {
  const errors = {};

  if (!name.trim()) errors.name = "Please tell me your name.";
  else if (name.trim().length < 2) errors.name = "That looks too short.";

  if (!email.trim()) errors.email = "An email address is required.";
  else if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "Please check the email address format.";

  if (!message.trim()) errors.message = "Please add a short message.";
  else if (message.trim().length < 10)
    errors.message = "A little more detail helps — 10 characters minimum.";

  return errors;
};

const initialValues = { name: "", email: "", service: services[0].title, message: "" };

export function Contact() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  // Validate a field live only after the visitor has left it once.
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }));
    }
    if (status.state !== "idle") setStatus({ state: "idle", message: "" });
  };

  const blur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(found).length > 0) {
      setStatus({
        state: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      return;
    }

    // No endpoint configured — hand the message to the visitor's mail client.
    if (!ENDPOINT) {
      const subject = `FrankTech enquiry — ${values.service}`;
      const body = `${values.message}\n\n—\nName: ${values.name}\nEmail: ${values.email}\nService: ${values.service}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus({
        state: "success",
        message:
          "Your email app should have opened with the message ready to send.",
      });
      return;
    }

    setStatus({ state: "loading", message: "Sending your message…" });

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      setValues(initialValues);
      setTouched({});
      setErrors({});
      setStatus({
        state: "success",
        message: "Thanks — your message is in. I'll reply within 24 hours.",
      });
    } catch {
      setStatus({
        state: "error",
        message:
          "Something went wrong sending that. Please email me directly and I'll pick it up.",
      });
    }
  };

  const fieldClass = (field) =>
    cn(
      "w-full rounded-2xl border bg-surface-2/60 px-4 py-3.5 text-sm text-ink",
      "placeholder:text-ink-subtle/70 transition-all duration-200 outline-none",
      "focus:border-brand focus:bg-surface focus:ring-4 focus:ring-brand/12",
      errors[field] && touched[field]
        ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/12"
        : "border-line",
    );

  const labelClass = (field) =>
    cn(
      "mb-2 block text-sm font-medium transition-colors",
      errors[field] && touched[field] ? "text-red-500" : "text-ink-muted",
    );

  return (
    <Section id="contact" className="overflow-hidden">
      <Backdrop />

      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* ------------------------------------------------------- details */}
        <div>
          <Reveal>
            <StatusPill>{profile.availability}</StatusPill>
          </Reveal>

          <Reveal delay={70}>
            <h2 className="mt-6 text-3xl leading-[1.15] sm:text-4xl">
              Let&rsquo;s build something that{" "}
              <span className="text-brand italic">just works</span>.
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted">
              Call, email or send a message below and I&rsquo;ll get back to you
              quickly. Tell me what&rsquo;s going wrong in your own words — you
              don&rsquo;t need to know the technical term.
            </p>
          </Reveal>

          <Reveal delay={190}>
            <div className="mt-9 flex flex-col gap-3">
              <a
                href={profile.phoneHref}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <IconPhone className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs tracking-wide text-ink-subtle uppercase">
                    Phone
                  </span>
                  <span className="block font-semibold text-ink">
                    {profile.phone}
                  </span>
                </span>
                <IconArrowRight className="size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <IconMail className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs tracking-wide text-ink-subtle uppercase">
                    Email
                  </span>
                  <span className="block truncate font-semibold text-ink">
                    {profile.email}
                  </span>
                </span>
                <IconArrowRight className="size-4 shrink-0 text-ink-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand" />
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <IconMapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-xs tracking-wide text-ink-subtle uppercase">
                    Based in
                  </span>
                  <span className="block font-semibold text-ink">
                    {profile.location}
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-subtle">
              <IconClock className="size-4 text-brand" />
              {profile.responseTime} · Free initial diagnostics
            </p>
          </Reveal>
        </div>

          {/* --------------------------------------------------------- form */}
        <Reveal delay={120}>
          <form onSubmit={onSubmit} noValidate className="card p-7 sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass("name")}>
                  Name <span aria-hidden="true" className="text-brand">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={update("name")}
                  onBlur={blur("name")}
                  aria-invalid={Boolean(errors.name && touched.name)}
                  aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                  className={fieldClass("name")}
                />
                {errors.name && touched.name && (
                  <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <IconAlert className="size-3.5 shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClass("email")}>
                  Email <span aria-hidden="true" className="text-brand">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  aria-invalid={Boolean(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                  className={fieldClass("email")}
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <IconAlert className="size-3.5 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="service" className={labelClass("service")}>
                What do you need help with?
              </label>
              <select
                id="service"
                name="service"
                value={values.service}
                onChange={update("service")}
                className={cn(fieldClass("service"), "cursor-pointer appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11")}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                }}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))}
                <option value="Something else">Something else</option>
              </select>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className={labelClass("message")}>
                Message <span aria-hidden="true" className="text-brand">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Describe the issue or what you'd like to achieve…"
                value={values.message}
                onChange={update("message")}
                onBlur={blur("message")}
                aria-invalid={Boolean(errors.message && touched.message)}
                aria-describedby={errors.message && touched.message ? "message-error" : undefined}
                className={cn(fieldClass("message"), "resize-y min-h-32")}
              />
              {errors.message && touched.message && (
                <p id="message-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                  <IconAlert className="size-3.5 shrink-0" />
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status.state === "loading"}
              className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.state === "loading" ? "Sending…" : "Send Message"}
              {status.state !== "loading" && <IconArrowRight className="size-4" />}
            </button>

            {/* Form feedback is announced politely to screen readers. */}
            <div role="status" aria-live="polite" className="min-h-6">
              {status.message && (
                <p
                  className={cn(
                    "mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm",
                    status.state === "success" && "bg-success/10 text-success",
                    status.state === "error" && "bg-red-500/10 text-red-500",
                  )}
                >
                  {status.state === "success" && (
                    <IconCheck className="mt-0.5 size-4 shrink-0" />
                  )}
                  {status.state === "error" && (
                    <IconAlert className="mt-0.5 size-4 shrink-0" />
                  )}
                  {status.message}
                </p>
              )}
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-ink-subtle">
              {ENDPOINT
                ? "Your details are used only to reply to this enquiry."
                : "No account needed. This opens your email app to send the message."}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}