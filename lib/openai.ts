import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export const OPENAI_DEMO_MODE = !process.env.OPENAI_API_KEY;

export const TRYGGBOT_SYSTEM_PROMPT = `Du er TryggBot, en norsk beredskapsassistent laget av HjemTrygg. Du gir praktiske, konkrete råd om hjemmeberedskap, nødpreparasjon og krisehåndtering for norske familier. Du er basert på DSBs anbefalinger, men bruker ditt eget språk. Du er kortfattet, vennlig og saklig. Svar alltid på norsk. Hvis brukeren spør om noe utenfor beredskapsrelaterte temaer, si høflig at du er spesialisert på beredskap og hjelp dem tilbake til relevante spørsmål. Du har tilgang til brukerens beredskapsdata som kontekst.`;

export const DEMO_RESPONSES = [
  "Hei! Jeg er TryggBot. I demo-modus kan jeg gi deg noen generelle beredskapsråd. DSB anbefaler at alle norske husstander har nok mat og vann til minst tre dager – helst en uke. Start med å bygge opp et enkelt lager av hermetikk, tørrmat og rent vann (3 liter per person per dag).",
  "Et godt første steg i beredskapsarbeidet er å lage en familieplan. Avtal hvem som henter barna, hvem som sjekker på naboer, og velg to møtepunkter – ett nær hjemmet og ett lenger unna. Skriv ned nødtelefonnumre på papir i tilfelle mobilen ikke virker.",
  "Husker du å sjekke utløpsdatoene på beredskapslageret ditt? DSB anbefaler å rotere matlageret minst én gang i året. Bruk det eldste først og fyll på med nytt. Dette kalles 'first in, first out'-prinsippet.",
  "En viktig del av hjemmeberedskapen er å ha en førstehjelps-koffert tilgjengelig. Den bør inneholde bandasjer, plaster, smertestillende, temperaturtermometer og eventuelle faste medisiner familiemedlemmene trenger. Sjekk og oppdater den jevnlig.",
  "Visste du at Norge er et land med mange ulike risikoscenarier? Fra strømbrudd og ekstremvær til cyberangrep. Kriseinfo.no fra DSB er den offisielle informasjonskilden ved kriser. Lagre den som bokmerke på telefonen din, og abonner gjerne på varslinger.",
];
