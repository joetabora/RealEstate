import { ALL_CONCEPT_CATALOGS } from "@/lib/knowledge/seed";
import { canonicalPairKey } from "@/lib/knowledge/types";
import type { ConceptCitationSeed } from "@/lib/knowledge/types";
import type { AssetKind, InformationClass } from "./types";

export type AssetSeed = {
  slug: string;
  kind: AssetKind;
  informationClass: InformationClass;
  conceptSlug?: string;
  pair?: { a: string; b: string };
  title: string;
  body: string;
  citationSlugs: readonly string[];
};

export type AssetCitationSeed = ConceptCitationSeed & { chapterNumber: number };

function citationsFor(slug: string): readonly AssetCitationSeed[] {
  const concept = ALL_CONCEPT_CATALOGS.find((row) => row.slug === slug);
  if (!concept) {
    throw new Error(`Asset citation slug is missing from concept catalogs: ${slug}`);
  }
  return concept.citations.map((citation) => ({
    ...citation,
    chapterNumber: concept.chapterNumber,
  }));
}

export function citationsForAsset(asset: AssetSeed): AssetCitationSeed[] {
  const seen = new Set<string>();
  const citations: AssetCitationSeed[] = [];
  for (const slug of asset.citationSlugs) {
    for (const citation of citationsFor(slug)) {
      const key = `${citation.documentSlug}|${citation.heading}|${citation.pdfPage}`;
      if (seen.has(key)) continue;
      seen.add(key);
      citations.push(citation);
    }
  }
  return citations;
}

/**
 * Hand-authored Agency teaching units. Original language plus heading citations.
 * No reconstructed book body. No invented Wisconsin statutes or fees.
 */
export const PHASE4_ASSETS: readonly AssetSeed[] = [
  {
    slug: "licensee-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "licensee",
    title: "Licensee",
    body: "Chapter 1 lists Licensee as its own heading. In this course, licensee is the umbrella role: a person who holds a real estate license. Later headings (agent, client, customer) sit under that idea. Do not treat licensee as interchangeable with client.",
    citationSlugs: ["licensee"],
  },
  {
    slug: "licensee-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "licensee",
    title: "Licensee in plain language",
    body: "If an exam item says licensee, think: someone allowed to practice. It does not tell you who that person represents. Representation is a later heading.",
    citationSlugs: ["licensee"],
  },
  {
    slug: "agent-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "agent",
    title: "Agent",
    body: "Agent is a separate heading from Licensee. The course uses agent for the person who acts for someone else. The next headings split that someone else into client versus customer.",
    citationSlugs: ["agent"],
  },
  {
    slug: "client-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "client",
    title: "Client",
    body: "Client is its own heading, listed separately from Customer. The party the firm represents is the client. If you catch yourself using customer for that party, stop — the course treats those words as different terms.",
    citationSlugs: ["client"],
  },
  {
    slug: "client-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "client",
    title: "Client in plain language",
    body: "Client means the person or party your firm is working for. That is not the same heading as customer.",
    citationSlugs: ["client"],
  },
  {
    slug: "customer-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "customer",
    title: "Customer",
    body: "Customer is listed as a separate heading from Client. A customer is a party in the transaction who is not the client of that firm. Mixing client and customer is one of the most common Agency misses in this chapter.",
    citationSlugs: ["customer"],
  },
  {
    slug: "customer-simple",
    kind: "simple_language",
    informationClass: "general_explanation",
    conceptSlug: "customer",
    title: "Customer in plain language",
    body: "Customer means someone you deal with who is not the party your firm represents. Same transaction, different heading from client.",
    citationSlugs: ["customer"],
  },
  {
    slug: "client-customer-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "client", b: "customer" },
    title: "Client vs customer",
    body: "Chapter 1 lists Client and Customer as two headings. They are not interchangeable. Repair this pair as: who does this firm represent (client) versus who is in the deal without that representation (customer). Read the sourced headings; do not invent extra duties here.",
    citationSlugs: ["client", "customer"],
  },
  {
    slug: "client-customer-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "client", b: "customer" },
    title: "Say the distinction out loud",
    body: "Without looking, explain the difference between a client and a customer as this chapter lists them. Then say one sentence about why swapping the words would change the answer on an Agency item.",
    citationSlugs: ["client", "customer"],
  },
  {
    slug: "client-customer-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "client", b: "customer" },
    title: "Recall: client or customer?",
    body: "A buyer has no representation agreement with your firm, but you are showing the buyer a listing. Which chapter heading fits that buyer for your firm — client or customer — and why?",
    citationSlugs: ["client", "customer"],
  },
  {
    slug: "multiple-representation-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "multiple-representation",
    title: "Multiple representation",
    body: "Multiple representation is its own heading, next to single agency. It is the situation where one firm represents more than one client in the same transaction. Chapter 1 notes then split how that firm may staff it.",
    citationSlugs: ["multiple-representation"],
  },
  {
    slug: "multiple-representation-scenario",
    kind: "scenario",
    informationClass: "general_explanation",
    conceptSlug: "multiple-representation",
    title: "Same firm, both sides",
    body: "A firm already represents a seller. A buyer then asks that same firm to represent the buyer on that listing. Chapter 1 names that setup under Multiple Representation — not under a heading that treats the buyer as a customer of that firm.",
    citationSlugs: ["multiple-representation"],
  },
  {
    slug: "designated-agency-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "multiple-representation-without-designated-agency", b: "multiple-representation-with-designated-agency" },
    title: "With vs without designated agency",
    body: "Chapter 1 notes split multiple representation into two headings: without designated agency and with designated agency. Designated agency is a form of multiple representation, not a separate agency model standing beside it. Keep the parent heading (multiple representation) in mind when you see either split.",
    citationSlugs: [
      "multiple-representation",
      "multiple-representation-without-designated-agency",
      "multiple-representation-with-designated-agency",
    ],
  },
  {
    slug: "designated-agency-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "multiple-representation-without-designated-agency", b: "multiple-representation-with-designated-agency" },
    title: "Say the designated-agency split",
    body: "Explain, in your own words, that designated agency is a heading under multiple representation, and that the notes also list multiple representation without designated agency. Do not invent extra Wisconsin procedures beyond those headings.",
    citationSlugs: [
      "multiple-representation-without-designated-agency",
      "multiple-representation-with-designated-agency",
    ],
  },
  {
    slug: "designated-agency-recall",
    kind: "recall_prompt",
    informationClass: "course_sourced",
    pair: { a: "multiple-representation", b: "multiple-representation-with-designated-agency" },
    title: "Recall: designated agency",
    body: "An item uses the phrase designated agency. Is that a stand-alone agency model in this chapter's headings, or a form of multiple representation? Point to the parent heading.",
    citationSlugs: ["multiple-representation", "multiple-representation-with-designated-agency"],
  },
  {
    slug: "duties-all-explanation",
    kind: "explanation",
    informationClass: "general_explanation",
    conceptSlug: "duties-to-all-persons",
    title: "Duties to all persons",
    body: "Chapter 1 has a heading for duties to all persons in a transaction, listed before duties owed to a client. Those all-persons duties are not the same as the extra client heading. Read the sourced heading rather than inventing a duty list here.",
    citationSlugs: ["duties-to-all-persons"],
  },
  {
    slug: "duties-comparison",
    kind: "comparison",
    informationClass: "course_sourced",
    pair: { a: "duties-to-all-persons", b: "duties-owed-to-a-client" },
    title: "Duties to all vs duties to a client",
    body: "Chapter 1 separates duties owed to all persons from extra duties owed to a client. Repair this pair by asking: does this obligation apply to everyone in the transaction, or only because this party is a client? Do not collapse the two headings into one 'duties' blob.",
    citationSlugs: ["duties-to-all-persons", "duties-owed-to-a-client"],
  },
  {
    slug: "duties-teachback",
    kind: "teachback_prompt",
    informationClass: "course_sourced",
    pair: { a: "duties-to-all-persons", b: "duties-owed-to-a-client" },
    title: "Say the duties split",
    body: "Explain why the chapter has two duty headings instead of one. Give one example of a question that would change if you treated a customer as a client for extra client-only duties.",
    citationSlugs: ["duties-to-all-persons", "duties-owed-to-a-client"],
  },
];

export const PHASE4_SESSION_STEPS: readonly { assetSlug: string; kind: "learn" | "repair" | "teachback" | "recall"; reasonCodes: readonly string[] }[] = [
  { assetSlug: "licensee-explanation", kind: "learn", reasonCodes: ["exam_weight_agency", "prerequisite"] },
  { assetSlug: "licensee-simple", kind: "learn", reasonCodes: ["exam_weight_agency", "modality_simple"] },
  { assetSlug: "agent-explanation", kind: "learn", reasonCodes: ["exam_weight_agency", "prerequisite"] },
  { assetSlug: "client-explanation", kind: "learn", reasonCodes: ["exam_weight_agency"] },
  { assetSlug: "client-simple", kind: "learn", reasonCodes: ["exam_weight_agency", "modality_simple"] },
  { assetSlug: "customer-explanation", kind: "learn", reasonCodes: ["exam_weight_agency"] },
  { assetSlug: "customer-simple", kind: "learn", reasonCodes: ["exam_weight_agency", "modality_simple"] },
  { assetSlug: "client-customer-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "client-customer-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "multiple-representation-explanation", kind: "learn", reasonCodes: ["exam_weight_agency"] },
  { assetSlug: "multiple-representation-scenario", kind: "learn", reasonCodes: ["exam_weight_agency", "modality_scenario"] },
  { assetSlug: "designated-agency-comparison", kind: "repair", reasonCodes: ["confusion_pair", "wisconsin_heading"] },
  { assetSlug: "designated-agency-teachback", kind: "teachback", reasonCodes: ["confusion_pair", "wisconsin_heading"] },
  { assetSlug: "duties-all-explanation", kind: "learn", reasonCodes: ["exam_weight_agency"] },
  { assetSlug: "duties-comparison", kind: "repair", reasonCodes: ["confusion_pair", "seed"] },
  { assetSlug: "duties-teachback", kind: "teachback", reasonCodes: ["confusion_pair"] },
  { assetSlug: "client-customer-recall", kind: "recall", reasonCodes: ["retrieval"] },
  { assetSlug: "designated-agency-recall", kind: "recall", reasonCodes: ["retrieval", "wisconsin_heading"] },
];

export function pairKeyForAsset(asset: AssetSeed): string | null {
  if (!asset.pair) return null;
  return canonicalPairKey(asset.pair.a, asset.pair.b);
}
