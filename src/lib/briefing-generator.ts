import { DailyBriefing, Industry, Severity, ThreatItem } from '@/lib/types';

type ThreatTemplate = {
  key: string;
  title: string;
  baseSeverity: Severity;
  happenedTemplate: string;
  recommendation: string;
  source: string;
  relevanceByIndustry: Record<Industry, string>;
};

const THREAT_CATALOG: ThreatTemplate[] = [
  {
    key: 'managed-service-ransomware',
    title: 'Ransomware via underleverantör av IT-drift',
    baseSeverity: 'kritisk',
    happenedTemplate:
      'En driftleverantör i Norden rapporterade intrång där angripare krypterade kunddata och krävde lösensumma. Händelsen visar att tredje parts åtkomst fortfarande är en vanlig väg in.',
    recommendation:
      'Gå igenom era leverantörskopplingar idag. Säkerställ MFA, minimera behörigheter och verifiera att ni har en testad återställningsplan.',
    source: 'CERT-SE och europeiska incidentrapporter',
    relevanceByIndustry: {
      finans:
        'Hög påverkan. Ni har ofta många externa integrationer och regulatoriska krav på tillgänglighet.',
      vård: 'Hög påverkan. Driftstopp kan slå direkt mot vårdflöden och journalsystem.',
      retail: 'Medel till hög påverkan. Betalflöden och e-handel kan påverkas vid leverantörsstopp.',
      'offentlig sektor':
        'Hög påverkan. Kritiska samhällstjänster och leverantörsberoenden gör detta extra relevant.',
      industri: 'Hög påverkan om leverantören har åtkomst till produktions- eller OT-miljö.',
      teknik: 'Hög påverkan. Många teknikbolag är beroende av outsourcad drift och CI/CD-tjänster.',
      övrigt: 'Medel påverkan. Relevansen beror på hur central leverantören är för er dagliga drift.'
    }
  },
  {
    key: 'credential-phishing-wave',
    title: 'Ny phishingvåg med stulna inloggningar',
    baseSeverity: 'hög',
    happenedTemplate:
      'En bred phishingkampanj använder falska inloggningssidor för M365 och Google Workspace. Fokus ligger på ekonomi- och HR-funktioner.',
    recommendation:
      'Skicka en kort varning till personalen idag, förstärk e-postfiltrering och kontrollera avvikande inloggningar från nya geografier.',
    source: 'MISP-flöden och leverantörsvarningar',
    relevanceByIndustry: {
      finans: 'Hög påverkan. Kontouppgifter kan användas för bedrägerier och intern spridning.',
      vård: 'Medel till hög påverkan. Kontoövertaganden kan ge åtkomst till känslig patientinformation.',
      retail: 'Hög påverkan. Kundservice och ekonomi är ofta mål i kampanjerna.',
      'offentlig sektor': 'Hög påverkan. Bredden i organisationen ökar risken för träff.',
      industri: 'Medel påverkan. Störst risk i administrativa system och e-postflöden.',
      teknik: 'Hög påverkan. Angripare försöker ofta nå kodplattformar och molnkonton via mejl.',
      övrigt: 'Medel påverkan. Grundskydd i identitetshantering avgör effekten.'
    }
  },
  {
    key: 'vpn-zero-day',
    title: 'Kritisk sårbarhet i populär VPN-gateway',
    baseSeverity: 'kritisk',
    happenedTemplate:
      'En ny sårbarhet i en vanlig VPN-lösning utnyttjas aktivt innan patchning är fullt utrullad. Angripare kan få fjärråtkomst utan giltiga konton.',
    recommendation:
      'Identifiera om ni använder den berörda produkten. Patcha omedelbart och överväg temporär avstängning av extern åtkomst tills uppdatering är verifierad.',
    source: 'CISA KEV och leverantörsbulletiner',
    relevanceByIndustry: {
      finans: 'Kritisk påverkan om VPN används för fjärradministration eller tredjepartsåtkomst.',
      vård: 'Hög påverkan eftersom fjärråtkomst ofta används för journalsystem och support.',
      retail: 'Medel till hög påverkan vid centraliserade butikssystem och fjärrdrift.',
      'offentlig sektor': 'Kritisk påverkan för organisationer med bred extern åtkomst.',
      industri: 'Hög påverkan där VPN används för service av produktionsnära system.',
      teknik: 'Kritisk påverkan i DevOps-miljöer med extern administrationsyta.',
      övrigt: 'Medel påverkan. Avgörande om just denna produkt finns i er miljö.'
    }
  },
  {
    key: 'supply-chain-npm',
    title: 'Förgiftat open source-paket i byggkedjan',
    baseSeverity: 'hög',
    happenedTemplate:
      'Ett paket i JavaScript-ekosystemet har uppdaterats med skadlig kod som försöker stjäla tokens från byggmiljöer.',
    recommendation:
      'Lås versionshantering, rotera tokens i CI/CD och kontrollera de senaste beroendeuppdateringarna i era pipelines.',
    source: 'GitHub Security Advisories',
    relevanceByIndustry: {
      finans: 'Medel påverkan. Relevans ökar om ni bygger egna kundnära tjänster internt.',
      vård: 'Medel påverkan för digitala patient- och administrativa plattformar.',
      retail: 'Medel till hög påverkan i e-handel och kundplattformar.',
      'offentlig sektor': 'Medel påverkan. Särskilt relevant för myndigheter med intern utveckling.',
      industri: 'Medel påverkan där interna webbsystem driver produktion eller logistik.',
      teknik: 'Hög påverkan. Teknikbolag med snabb release-takt är direkt exponerade.',
      övrigt: 'Låg till medel påverkan beroende på om ni utvecklar egen mjukvara.'
    }
  },
  {
    key: 'business-email-compromise',
    title: 'Ökning av BEC-bedrägerier mot ekonomiavdelningar',
    baseSeverity: 'hög',
    happenedTemplate:
      'Flera nordiska bolag har drabbats av falska betalningsinstruktioner via kapade eller spoofade leverantörsadresser.',
    recommendation:
      'Inför tvåstegsverifiering av betalningsändringar och blockera utbetalningar utan telefonbekräftelse.',
    source: 'Polismyndigheten och banknätverk',
    relevanceByIndustry: {
      finans: 'Hög påverkan. Ekonomiflöden och leverantörsrelationer gör er till ett prioriterat mål.',
      vård: 'Medel påverkan men allvarlig konsekvens vid felaktiga utbetalningar.',
      retail: 'Hög påverkan med många leverantörer och frekventa betalningsflöden.',
      'offentlig sektor': 'Medel till hög påverkan i upphandling och leverantörsbetalningar.',
      industri: 'Hög påverkan i inköps- och leverantörsintensiva verksamheter.',
      teknik: 'Medel påverkan, särskilt i snabbväxande bolag med hög betalningstakt.',
      övrigt: 'Medel påverkan. Grundrutiner i ekonomiprocessen blir avgörande.'
    }
  },
  {
    key: 'ot-intrusion-attempts',
    title: 'Fler intrångsförsök mot industriella styrsystem',
    baseSeverity: 'hög',
    happenedTemplate:
      'Säkerhetsaktörer ser ökad skanning och riktade försök mot exponerade OT-enheter i Norden.',
    recommendation:
      'Separera IT och OT strikt, stäng onödiga portar och prioritera övervakning av fjärranslutningar.',
    source: 'ICS-CERT och regionala SOC-rapporter',
    relevanceByIndustry: {
      finans: 'Låg till medel påverkan. Främst relevant för fastighets- och infrastruktursystem.',
      vård: 'Medel påverkan för sjukhus med medicinteknisk utrustning på separata nät.',
      retail: 'Låg till medel påverkan. Relevant om ni driver egna lager- eller automationssystem.',
      'offentlig sektor': 'Medel till hög påverkan i samhällskritisk infrastruktur.',
      industri: 'Kritisk påverkan. Detta är ett direkt hot mot produktion och leverans.',
      teknik: 'Medel påverkan för datacenter- och infrastrukturdrift.',
      övrigt: 'Låg till medel påverkan beroende på fysisk driftmiljö.'
    }
  },
  {
    key: 'cloud-misconfiguration',
    title: 'Dataläckor via felkonfigurerad molnlagring',
    baseSeverity: 'medel',
    happenedTemplate:
      'Nya incidenter visar att öppna lagringsytor och felaktiga IAM-regler fortsatt orsakar exponering av kunddata.',
    recommendation:
      'Kör en snabb kontroll av publika buckets, åtkomstpolicys och loggning. Prioritera data med personuppgifter.',
    source: 'Cloud-leverantörers säkerhetsnotiser',
    relevanceByIndustry: {
      finans: 'Hög påverkan på grund av känslig data och regulatorisk rapporteringsplikt.',
      vård: 'Hög påverkan. Patientdata innebär hög risk och höga krav vid incident.',
      retail: 'Medel till hög påverkan vid kund- och transaktionsdata i molnplattformar.',
      'offentlig sektor': 'Hög påverkan med fokus på medborgardata och förtroende.',
      industri: 'Medel påverkan för ritningar, leveranskedja och kundkontrakt.',
      teknik: 'Hög påverkan i SaaS- och plattformsbolag med multitenant-data.',
      övrigt: 'Medel påverkan. Relevans styrs av hur mycket data ni lagrar i molnet.'
    }
  },
  {
    key: 'new-mobile-banking-malware',
    title: 'Ny mobil malware riktad mot BankID-flöden',
    baseSeverity: 'hög',
    happenedTemplate:
      'En ny variant av mobil malware försöker manipulera användare i realtid under legitimering och betalning.',
    recommendation:
      'Skärp kundkommunikation kring social engineering och följ upp ovanliga transaktionsmönster i realtid.',
    source: 'Finansiella hotintelligensnätverk',
    relevanceByIndustry: {
      finans: 'Kritisk påverkan. Direkt kopplat till kundbedrägerier och varumärkesrisk.',
      vård: 'Låg till medel påverkan. Främst relevant där mobila identitetsflöden används brett.',
      retail: 'Medel påverkan via mobilbetalningar och kundkontoövertaganden.',
      'offentlig sektor': 'Medel påverkan i e-tjänster med stark autentisering.',
      industri: 'Låg påverkan i kärnverksamheten, men relevant för personalens konton.',
      teknik: 'Medel påverkan i appar med autentisering och betalningsfunktioner.',
      övrigt: 'Låg till medel påverkan beroende på kundernas mobila transaktionsflöden.'
    }
  }
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickUniqueIndices(seed: number, count: number, max: number): number[] {
  const picked = new Set<number>();
  let cursor = seed;

  while (picked.size < Math.min(count, max)) {
    const index = cursor % max;
    picked.add(index);
    cursor = (cursor * 1664525 + 1013904223) % 4294967296;
  }

  return Array.from(picked);
}

function enrichThreat(template: ThreatTemplate, date: string, index: number): ThreatItem {
  return {
    id: `${date}-${template.key}-${index}`,
    title: template.title,
    happened: template.happenedTemplate,
    severity: template.baseSeverity,
    recommendation: template.recommendation,
    source: template.source,
    relevanceByIndustry: template.relevanceByIndustry
  };
}

export function generateDailyBriefing(date: string): DailyBriefing {
  const seed = hashString(date);
  const selectedIndices = pickUniqueIndices(seed, 4, THREAT_CATALOG.length);
  const threats = selectedIndices.map((catalogIndex, index) =>
    enrichThreat(THREAT_CATALOG[catalogIndex], date, index)
  );

  return {
    id: `briefing-${date}`,
    date,
    generatedAt: new Date().toISOString(),
    title: `Cyberbriefing ${date}`,
    summary:
      'Dagens lägesbild fokuserar på de hot som snabbast kan påverka affärskritiska processer i svenska verksamheter. Prioritera åtgärderna med högst verksamhetsrisk först.',
    threats
  };
}
