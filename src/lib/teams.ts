import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  ChefHat,
  Code,
  Crown,
  Globe,
  Handshake,
  Headphones,
  Heart,
  Landmark,
  Link2,
  Megaphone,
  Package,
  Repeat,
  Scale,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

export type Team = {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
};

export const TEAMS: Team[] = [
  {
    slug: "customer-experience",
    name: "Customer Experience",
    icon: Headphones,
    description:
      "AI for support, CSAT, agent triage, and building customer-facing agents.",
  },
  {
    slug: "finance-operations",
    name: "Finance Operations",
    icon: Wallet,
    description:
      "Invoice matching, close automation, AR/AP, and connecting finance tools via MCP.",
  },
  {
    slug: "people-culture",
    name: "People & Culture",
    icon: Heart,
    description:
      "Hiring, onboarding, people analytics, and employee experience with AI.",
  },
  {
    slug: "product",
    name: "Product",
    icon: Package,
    description:
      "PM workflows with Claude: discovery, PRDs, prototyping, analysis.",
  },
  {
    slug: "engineering",
    name: "Engineering",
    icon: Code,
    description:
      "Claude Code, agents, and the patterns for shipping AI-assisted code.",
  },
  {
    slug: "operations",
    name: "Operations",
    icon: Repeat,
    description:
      "SOPs, runbooks, command centres, and multi-agent systems for ops teams.",
  },
  {
    slug: "quality",
    name: "Quality",
    icon: ShieldCheck,
    description:
      "QA, food quality inspection, compliance monitoring, and audit trails.",
  },
  {
    slug: "supply-chain",
    name: "Supply Chain",
    icon: Link2,
    description:
      "Demand forecasting, inventory optimisation, and agent-assisted logistics.",
  },
  {
    slug: "food-team",
    name: "Food Team",
    icon: ChefHat,
    description:
      "Recipe development, nutrition analysis, and food innovation with AI.",
  },
  {
    slug: "marketing-design",
    name: "Marketing & Design",
    icon: Megaphone,
    description:
      "Ad creative, copy, design systems, and connecting marketing data to Claude.",
  },
  {
    slug: "growth",
    name: "Growth",
    icon: TrendingUp,
    description:
      "Experimentation, funnel analysis, segmentation, and lifecycle work with AI.",
  },
  {
    slug: "ceo-office",
    name: "CEO Office",
    icon: Crown,
    description:
      "Strategy, board reporting, and the executive view of rolling out AI.",
  },
  {
    slug: "finance",
    name: "Finance",
    icon: Landmark,
    description:
      "FP&A, financial modelling, and turning recurring analyses into Claude Code.",
  },
  {
    slug: "general-management",
    name: "General Management",
    icon: Briefcase,
    description:
      "Decision-making, cross-functional leadership, and managing AI-native teams.",
  },
  {
    slug: "legal-compliance",
    name: "Legal & Compliance",
    icon: Scale,
    description:
      "Contract review, compliance monitoring, and trustworthy-agent patterns.",
  },
  {
    slug: "expansion",
    name: "Expansion",
    icon: Globe,
    description:
      "Market entry research, competitive mapping, and multi-market analysis.",
  },
  {
    slug: "business-development",
    name: "Business Development",
    icon: Handshake,
    description:
      "Deal research, partnership intelligence, and AI-assisted BD workflows.",
  },
];

export function getTeam(slug: string): Team | null {
  return TEAMS.find((t) => t.slug === slug) ?? null;
}
