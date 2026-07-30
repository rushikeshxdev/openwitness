"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AUTH_BG_IMAGE,
  authStats,
  loginBrand,
  registerBrand,
} from "@/data/auth-data";
import {
  Calendar,
  Eye,
  Globe2,
  Shield,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";

export type AuthBrandVariant = "login" | "register";

const STAT_ICONS = {
  globe: Globe2,
  calendar: Calendar,
  video: Video,
  users: Users,
} as const;

const FEATURE_ICONS = [Shield, Users, Globe2] as const;

export interface AuthBrandPanelProps {
  variant: AuthBrandVariant;
  className?: string;
}

export function AuthBrandPanel({ variant, className }: AuthBrandPanelProps) {
  return (
    <aside
      className={cn(
        "relative flex min-h-[40vh] flex-col overflow-hidden lg:min-h-screen",
        className
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={AUTH_BG_IMAGE}
          alt=""
          fill
          priority
          quality={75}
          className="object-cover object-[55%_35%] brightness-[0.45]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/70 via-[#0B0E11]/55 to-[#0B0E11]/92"
          aria-hidden="true"
        />
        {/* Decorative network glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[45%] opacity-40"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 60% 20%, rgba(59,130,246,0.35), transparent 70%)",
          }}
        />
        <svg
          className="pointer-events-none absolute right-4 top-16 h-40 w-56 opacity-30 sm:h-52 sm:w-72"
          viewBox="0 0 200 140"
          aria-hidden="true"
        >
          <circle cx="40" cy="50" r="3" fill="#3B82F6" />
          <circle cx="90" cy="30" r="2.5" fill="#60A5FA" />
          <circle cx="140" cy="55" r="3" fill="#3B82F6" />
          <circle cx="110" cy="90" r="2" fill="#93C5FD" />
          <circle cx="160" cy="100" r="2.5" fill="#3B82F6" />
          <path
            d="M40 50 L90 30 L140 55 L110 90 L160 100"
            fill="none"
            stroke="rgba(96,165,250,0.5)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 self-start text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6]/20 ring-1 ring-[#3B82F6]/40">
            <Eye className="h-5 w-5 text-[#60A5FA]" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">OpenWitness</span>
        </Link>

        {variant === "login" ? <LoginBrandBody /> : <RegisterBrandBody />}
      </div>
    </aside>
  );
}

function LoginBrandBody() {
  return (
    <div className="mt-10 flex flex-1 flex-col lg:mt-16">
      <p className="flex items-start gap-2 text-sm text-[#60A5FA]">
        <span className="text-2xl leading-none" aria-hidden="true">
          “
        </span>
        <span className="pt-1 italic text-zinc-300">{loginBrand.quote}</span>
      </p>

      <div className="mt-auto max-w-xl pb-4 pt-10 lg:pt-0">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {loginBrand.headlineBefore}
          <span className="text-[#3B82F6]">{loginBrand.headlineAccent}</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
          {loginBrand.description}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {authStats.map((stat) => {
            const Icon = STAT_ICONS[stat.icon];
            return (
              <div key={stat.id}>
                <Icon className="mb-2 h-5 w-5 text-[#3B82F6]" aria-hidden="true" />
                <p className="text-xl font-bold tabular-nums text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 inline-flex max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-[#3B82F6]"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-zinc-300">
            {loginBrand.callout}
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterBrandBody() {
  return (
    <div className="mt-10 flex flex-1 flex-col lg:mt-20">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {registerBrand.headlineBefore}
          <span className="text-[#3B82F6]">{registerBrand.headlineAccent}</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
          {registerBrand.description}
        </p>

        <ul className="mt-8 space-y-5">
          {registerBrand.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i] ?? Shield;
            return (
              <li key={feature.id} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#60A5FA]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-400">{feature.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto pt-10">
        <div className="max-w-md rounded-2xl border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-md">
          <p className="text-2xl leading-none text-[#3B82F6]" aria-hidden="true">
            “
          </p>
          <p className="mt-1 text-sm italic leading-relaxed text-zinc-300">
            {registerBrand.quote}
          </p>
        </div>
      </div>
    </div>
  );
}
