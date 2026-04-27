import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeder HjemTrygg-database...");

  const user = await prisma.user.upsert({
    where: { email: "demo@hjemtrygg.no" },
    update: {},
    create: {
      email: "demo@hjemtrygg.no",
      name: "Demo Bruker",
      emailVerified: new Date(),
    },
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: "pluss",
      status: "active",
      chatMessagesThisMonth: 5,
    },
  });

  const existingChecklist = await prisma.checklist.findFirst({ where: { userId: user.id } });
  if (!existingChecklist) {
    await prisma.checklist.create({
      data: {
        userId: user.id,
        title: "Hjemmeberedskap (DSB-mal)",
        items: {
          create: [
            { text: "Drikkevann (3 liter per person per dag i 7 dager)", checked: true, order: 0 },
            { text: "Hermetikk og tørrmat for 7 dager", checked: true, order: 1 },
            { text: "Medisiner og reseptbelagte legemidler", checked: true, order: 2 },
            { text: "Førstehjelpsutstyr", checked: false, order: 3 },
            { text: "Batteridrevet FM-radio", checked: true, order: 4 },
            { text: "Hodelykt og ekstra batterier", checked: true, order: 5 },
            { text: "Stearinlys og fyrstikker", checked: false, order: 6 },
            { text: "Kraftbank (powerbank) til mobiltelefon", checked: true, order: 7 },
            { text: "Kontanter (noen sedler og mynter)", checked: false, order: 8 },
            { text: "Liste over nødtelefonnumre på papir", checked: false, order: 9 },
          ],
        },
      },
    });
  }

  const existingItems = await prisma.inventoryItem.count({ where: { userId: user.id } });
  if (existingItems === 0) {
    await prisma.inventoryItem.createMany({
      data: [
        {
          userId: user.id,
          name: "Drikkevann (plastflasker)",
          category: "vann",
          quantity: 21,
          unit: "liter",
          expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          notes: "7 dager for 1 person",
        },
        {
          userId: user.id,
          name: "Hermetisert tunfisk",
          category: "mat",
          quantity: 12,
          unit: "stk",
          expiresAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: "Knekkebrød",
          category: "mat",
          quantity: 4,
          unit: "stk",
          expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          notes: "Utløper snart – kjøp mer",
        },
        {
          userId: user.id,
          name: "Havregryn",
          category: "mat",
          quantity: 2,
          unit: "kg",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: "Paracetamol",
          category: "medisiner",
          quantity: 30,
          unit: "stk",
          expiresAt: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: "Plastersamling",
          category: "medisiner",
          quantity: 1,
          unit: "stk",
          notes: "Inneholder ulike størrelser",
        },
        {
          userId: user.id,
          name: "Hodelykt",
          category: "utstyr",
          quantity: 2,
          unit: "stk",
          notes: "Sjekk batterier",
        },
        {
          userId: user.id,
          name: "Kraftbank",
          category: "utstyr",
          quantity: 1,
          unit: "stk",
          notes: "20 000 mAh, lades hver 3. måned",
        },
      ],
    });
  }

  const existingContacts = await prisma.familyContact.count({ where: { userId: user.id } });
  if (existingContacts === 0) {
    await prisma.familyContact.createMany({
      data: [
        {
          userId: user.id,
          name: "Kari Nordmann",
          phone: "+47 912 34 567",
          email: "kari@eksempel.no",
          role: "ektefelle",
        },
        {
          userId: user.id,
          name: "Ola Nordmann Jr.",
          phone: null,
          email: null,
          role: "barn",
          notes: "Hentes fra Solheim skole ved krise",
        },
        {
          userId: user.id,
          name: "Marit Olsen (nabo)",
          phone: "+47 987 65 432",
          email: null,
          role: "nabo",
          notes: "Har nøkkel til leiligheten",
        },
      ],
    });
  }

  const existingMeetingPoints = await prisma.meetingPoint.count({ where: { userId: user.id } });
  if (existingMeetingPoints === 0) {
    await prisma.meetingPoint.createMany({
      data: [
        {
          userId: user.id,
          name: "Utenfor Solheim skole",
          address: "Solheimveien 12, 0123 Oslo",
          description: "Hovedmøtepunkt ved evakuering. Alle møtes her.",
          priority: 1,
        },
        {
          userId: user.id,
          name: "Mormors hus",
          address: "Granveien 5, 0234 Oslo",
          description: "Reservemøtepunkt hvis vi ikke kan kommunisere via mobil.",
          priority: 2,
        },
      ],
    });
  }

  console.log("Seeding fullf\xF8rt!");
  console.log(`Demo-bruker: demo@hjemtrygg.no`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
