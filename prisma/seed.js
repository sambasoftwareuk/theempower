const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const readJsonFile = (filename) =>
  JSON.parse(
    fs.readFileSync(path.join(__dirname, "../app/mocks", filename), "utf8")
  );

const groupTree = [
  {
    slug: "about",
    scope: "about",
    title: { en: "About", tr: "Hakkımızda" },
    description: {
      en: "Learn who we are and how we support newcomers.",
      tr: "Biz kimiz ve yeni gelenleri nasıl destekliyoruz.",
    },
    children: [
      {
        slug: "who-are-we",
        title: { en: "Who are we", tr: "Biz Kimiz" },
        description: {
          en: "Community leaders and mentors.",
          tr: "Topluluk liderleri ve mentorlar.",
        },
      },
      {
        slug: "contact",
        title: { en: "Contact", tr: "İletişim" },
      },
    ],
  },
  {
    slug: "first-steps-in-the-uk",
    scope: "first-steps",
    title: { en: "First Steps in the UK", tr: "İngiltere'de İlk Adımlar" },
    description: {
      en: "Your first week essentials.",
      tr: "İlk hafta ihtiyaçları.",
    },
    children: [
      {
        slug: "arrival-essentials",
        title: { en: "Arrival Essentials", tr: "Varış Esasları" },
        description: {
          en: "Airport to city, SIM cards, Wi-Fi and more.",
          tr: "Havalimanından şehre, SIM kartlar, Wi-Fi ve daha fazlası.",
        },
        children: [
          {
            slug: "first-24-hour-survival-kit",
            title: {
              en: "First 24-Hour Survival Kit",
              tr: "İlk 24 Saat Hayatta Kalma Kiti",
            },
            children: [
              {
                slug: "immediate-documentation",
                title: { en: "Immediate Documentation", tr: "Acil Belgeler" },
                children: [
                  {
                    slug: "lost-passport-support",
                    title: {
                      en: "Lost Passport Support",
                      tr: "Pasaport Kaybı Destek",
                    },
                  },
                  {
                    slug: "no-fixed-address-mail",
                    title: {
                      en: '"No Fixed Address?" Day Centres',
                      tr: '"Sabit Adres Yok mu?" Gün Merkezleri',
                    },
                  },
                ],
              },
              {
                slug: "emergency-contacts",
                title: { en: "Emergency Contacts", tr: "Acil İletişim" },
              },
            ],
          },
          {
            slug: "sim-cards-and-mobile-plans",
            title: {
              en: "SIM Cards & Mobile Plans",
              tr: "SIM Kartlar & Tarifeler",
            },
          },
          {
            slug: "city-transportation-cards",
            title: {
              en: "City Transportation Cards",
              tr: "Şehir Ulaşım Kartları",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "visa-and-immigration",
    scope: "visa",
    title: { en: "Visa & Immigration", tr: "Vize ve Göç" },
    children: [
      {
        slug: "work-visas",
        title: { en: "Work Visas", tr: "Çalışma Vizeleri" },
        children: [
          {
            slug: "skilled-worker-visa",
            title: { en: "Skilled Worker Visa", tr: "Nitelikli İşçi Vizesi" },
          },
          {
            slug: "global-talent-visa",
            title: { en: "Global Talent Visa", tr: "Küresel Yetenek Vizesi" },
          },
        ],
      },
      {
        slug: "student-visas",
        title: { en: "Student Visas", tr: "Öğrenci Vizeleri" },
      },
    ],
  },
  {
    slug: "settling-in-the-uk",
    scope: "settlement",
    title: { en: "Settling in the UK", tr: "İngiltere'ye Yerleşim" },
    children: [
      {
        slug: "find-housing",
        title: { en: "Find Housing", tr: "Konut Bulma" },
        children: [
          {
            slug: "renting-privately",
            title: { en: "Renting Privately", tr: "Özel Kiralama" },
          },
          {
            slug: "council-housing",
            title: { en: "Council Housing", tr: "Belediye Konutu" },
          },
          {
            slug: "homelessness-support",
            title: { en: "Homelessness Support", tr: "Evsizlik Desteği" },
          },
        ],
      },
      {
        slug: "opening-a-bank-account",
        title: { en: "Opening a Bank Account", tr: "Banka Hesabı Açma" },
      },
    ],
  },
  {
    slug: "jobs-and-employment",
    scope: "jobs",
    title: { en: "Jobs & Employment", tr: "İş ve İstihdam" },
    children: [
      {
        slug: "cv-and-cover-letter",
        title: { en: "CV & Cover Letter", tr: "CV ve Kapak Mektubu" },
      },
      {
        slug: "interview-preparation",
        title: { en: "Interview Preparation", tr: "Mülakat Hazırlığı" },
      },
      {
        slug: "job-search",
        title: { en: "Job Search", tr: "İş Arama" },
      },
    ],
  },
];

const contentEntries = [
  {
    slug: "first-days-guide",
    title: { en: "First Days Guide", tr: "İlk Gün Rehberi" },
    subtitle: {
      en: "Checklist for the first 72 hours in the UK.",
      tr: "İlk 72 saat için kontrol listesi.",
    },
    body: {
      en: `### First things to do
- Register for a GP
- Find temporary accommodation
- Secure Wi-Fi and a UK SIM

Use this guide to plan each day.`,
      tr: `### İlk yapılacaklar
- Aile hekimine kayıt
- Geçici konaklama bul
- Wi-Fi ve SIM kart ayarla

Bu rehberle her günü planlayın.`,
    },
    heroImage: "/photo-16.jpg",
    galleryImages: ["/photo-12.jpg", "/photo-13.jpg"],
    groups: ["first-steps-in-the-uk"],
    externalLinks: [
      {
        url: "https://www.gov.uk/moving-to-uk",
        title: "Gov.uk - Moving to the UK",
        type: "link",
        order: 1,
      },
    ],
  },
  {
    slug: "airport-to-city-transport",
    title: {
      en: "Airport to City: Transport Options",
      tr: "Havalimanından Şehre Ulaşım",
    },
    subtitle: {
      en: "Coach, train, and taxi tips for London, Manchester and more.",
      tr: "Londra, Manchester ve diğer şehirler için otobüs, tren ve taksi ipuçları.",
    },
    body: {
      en: `Compare National Express coaches, direct trains, and ride-share apps. Book online to save up to 30%.`,
      tr: `National Express otobüsleri, direkt trenler ve paylaşım uygulamalarını karşılaştırın. Online rezervasyonla %30'a kadar tasarruf edin.`,
    },
    heroImage: "/photo-14.jpg",
    galleryImages: ["/photo-15.jpg"],
    groups: ["first-steps-in-the-uk", "arrival-essentials"],
    externalLinks: [
      {
        url: "https://www.nationalexpress.com/en/airport",
        title: "National Express - Airport Coaches",
        type: "link",
        order: 1,
      },
    ],
  },
  {
    slug: "first-24-hour-survival-kit",
    title: {
      en: "First 24-Hour Survival Kit",
      tr: "İlk 24 Saat Hayatta Kalma Kiti",
    },
    subtitle: {
      en: "Power, Wi-Fi, and local support lines.",
      tr: "Elektrik, Wi-Fi ve yerel destek hatları.",
    },
    body: {
      en: `Carry a portable charger, download offline maps, and note emergency contacts such as NHS 111 and 999.`,
      tr: `Taşınabilir şarj taşıyın, çevrimdışı haritaları indirin ve NHS 111 ile 999 gibi acil numaraları kaydedin.`,
    },
    heroImage: "/photo-1.jpg",
    galleryImages: ["/photo-2.jpg", "/photo-3.jpg"],
    groups: [
      "first-steps-in-the-uk",
      "arrival-essentials",
      "first-24-hour-survival-kit",
    ],
    externalLinks: [
      {
        url: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/",
        title: "NHS - Urgent Care",
        type: "link",
        order: 1,
      },
    ],
  },
  {
    slug: "where-to-charge-your-phone",
    title: {
      en: "Where to Charge Your Phone for Free",
      tr: "Telefonu Ücretsiz Şarj Etme Noktaları",
    },
    subtitle: {
      en: "Libraries, stations, and community hubs",
      tr: "Kütüphaneler, istasyonlar ve topluluk merkezleri",
    },
    body: {
      en: `### Free charging hotspots
- Public libraries
- Major train stations
- Community centres after 6pm`,
      tr: `### Ücretsiz şarj noktaları
- Halk kütüphaneleri
- Büyük tren istasyonları
- Saat 18:00 sonrası topluluk merkezleri`,
    },
    heroImage: "/photo-4.jpg",
    groups: [
      "first-steps-in-the-uk",
      "arrival-essentials",
      "first-24-hour-survival-kit",
    ],
    externalLinks: [
      {
        url: "https://www.networkrail.co.uk/stations",
        title: "Network Rail - Station Facilities",
        type: "link",
        order: 1,
      },
    ],
  },
  {
    slug: "lost-passport-emergency",
    title: {
      en: "Lost Passport? Embassy Contacts",
      tr: "Pasaport Kaybettiniz mi? Elçilikler",
    },
    subtitle: {
      en: "Emergency travel documents in 24 hours.",
      tr: "24 saat içinde acil seyahat belgesi.",
    },
    body: {
      en: `Contact your embassy, bring a police reference number, and two passport photos.`,
      tr: `Elçiliğinize başvurun, polis referans numarası ve iki fotoğraf götürün.`,
    },
    heroImage: "/photo-5.jpg",
    groups: [
      "first-steps-in-the-uk",
      "arrival-essentials",
      "first-24-hour-survival-kit",
      "immediate-documentation",
      "lost-passport-support",
    ],
    externalLinks: [
      {
        url: "https://www.gov.uk/world/embassies",
        title: "Gov.uk - Embassies",
        type: "link",
        order: 1,
      },
    ],
  },
  {
    slug: "day-centre-mail-services",
    title: {
      en: '"No Fixed Address?" Using Day Centres',
      tr: '"Sabit Adres Yok mu?" Gün Merkezleri',
    },
    subtitle: {
      en: "Receive letters safely while you search for housing.",
      tr: "Konut ararken mektupları güvenle alın.",
    },
    body: {
      en: `Register with day centres like St. Mungo's or Shelter. Show ID and collect mail weekly.`,
      tr: `St. Mungo's veya Shelter gibi merkezlere kayıt olun. Kimlik gösterin ve haftalık mektup alın.`,
    },
    heroImage: "/photo-6.jpg",
    groups: [
      "first-steps-in-the-uk",
      "arrival-essentials",
      "first-24-hour-survival-kit",
      "immediate-documentation",
      "no-fixed-address-mail",
    ],
  },
  {
    slug: "skilled-worker-visa-requirements",
    title: {
      en: "Skilled Worker Visa Requirements",
      tr: "Nitelikli İşçi Vizesi Şartları",
    },
    subtitle: {
      en: "Salary thresholds, sponsorship, and timelines.",
      tr: "Maaş şartları, sponsorluk ve zaman çizelgesi.",
    },
    body: {
      en: `You need a Certificate of Sponsorship, English level B1, and salary that meets the occupation code.`,
      tr: `Sponsorluk Sertifikası, B1 İngilizce seviyesi ve meslek koduna uygun maaş gerekir.`,
    },
    heroImage: "/photo-7.jpg",
    groups: ["visa-and-immigration", "work-visas", "skilled-worker-visa"],
    externalLinks: [
      {
        url: "https://www.gov.uk/skilled-worker-visa",
        title: "Gov.uk - Skilled Worker Visa",
        type: "link",
        order: 1,
      },
    ],
  },
  {
    slug: "global-talent-visa-guide",
    title: {
      en: "Global Talent Visa Guide",
      tr: "Küresel Yetenek Vizesi Rehberi",
    },
    subtitle: {
      en: "Fast-track for leaders in tech, arts, and science.",
      tr: "Teknoloji, sanat ve bilim liderleri için hızlı süreç.",
    },
    body: {
      en: `Choose an endorsing body (Tech Nation, Arts Council, etc.) and prepare your portfolio.`,
      tr: `Bir onay kurumu seçin (Tech Nation, Arts Council vb.) ve portföyünüzü hazırlayın.`,
    },
    heroImage: "/photo-8.jpg",
    groups: ["visa-and-immigration", "work-visas", "global-talent-visa"],
  },
  {
    slug: "renting-privately-checklist",
    title: {
      en: "Renting Privately Checklist",
      tr: "Özel Kiralama Kontrol Listesi",
    },
    subtitle: {
      en: "Documents, guarantors, and deposit-free options.",
      tr: "Belgeler, kefiller ve depozitosuz seçenekler.",
    },
    body: {
      en: `Gather proof of income, ID, and references. Consider zero-deposit schemes.`,
      tr: `Gelir belgesi, kimlik ve referans toplayın. Depozitosuz programları değerlendirin.`,
    },
    heroImage: "/photo-10.jpg",
    groups: ["settling-in-the-uk", "find-housing", "renting-privately"],
  },
  {
    slug: "opening-uk-bank-account",
    title: {
      en: "Opening a UK Bank Account",
      tr: "Birleşik Krallık Banka Hesabı Açma",
    },
    subtitle: {
      en: "Proof of address alternatives.",
      tr: "Adres kanıtı alternatifleri.",
    },
    body: {
      en: `Use letters from your GP, employer, or local council if you don't yet have a tenancy agreement.`,
      tr: `Henüz kira sözleşmeniz yoksa aile hekimi, işveren veya belediye mektubu kullanın.`,
    },
    heroImage: "/photo-11.jpg",
    groups: ["settling-in-the-uk", "opening-a-bank-account"],
  },
  {
    slug: "cv-and-cover-letter-template",
    title: {
      en: "CV & Cover Letter Template",
      tr: "CV ve Kapak Mektubu Şablonu",
    },
    subtitle: {
      en: "Two-page UK format with impact statements.",
      tr: "İki sayfalık İngiltere formatı ve sonuç odaklı cümleler.",
    },
    body: {
      en: `Use bullet points with STAR examples. Remove personal photos and include LinkedIn.`,
      tr: `STAR örnekleriyle madde işaretleri kullanın. Fotoğraf eklemeyin ve LinkedIn linki verin.`,
    },
    heroImage: "/photo-9.jpg",
    groups: ["jobs-and-employment", "cv-and-cover-letter"],
  },
];

const groupSlugToId = new Map();
const contentSlugToId = new Map();
const mediaCache = new Map();

async function ensureMedia(imagePath, alt) {
  if (!imagePath) return null;
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  if (mediaCache.has(normalized)) return mediaCache.get(normalized);
  const media = await prisma.media.create({
    data: {
      filename: normalized.replace("/", ""),
      originalFilename: normalized.replace("/", ""),
      mimeType: "image/jpeg",
      size: 0,
      path: normalized,
      alt: alt || normalized,
    },
  });
  mediaCache.set(normalized, media.id);
  return media.id;
}

async function createGroupTree(nodes, parentId = null, level = 0) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const group = await prisma.group.create({
      data: {
        slug: node.slug,
        parentId,
        level,
        order: i + 1,
        scope: node.scope,
        translations: {
          create: [
            {
              language: "en",
              title: node.title?.en || node.slug,
              description: node.description?.en,
            },
            {
              language: "tr",
              title: node.title?.tr || node.title?.en || node.slug,
              description: node.description?.tr,
            },
          ],
        },
      },
    });
    groupSlugToId.set(node.slug, group.id);

    if (node.children?.length) {
      await createGroupTree(node.children, group.id, level + 1);
    }
  }
}

async function createContents() {
  for (const entry of contentEntries) {
    const heroMediaId = await ensureMedia(
      entry.heroImage,
      `${entry.title.en} hero`
    );

    const content = await prisma.content.create({
      data: {
        slug: entry.slug,
        title: entry.title.en,
        subtitle: entry.subtitle?.en,
        body: entry.body?.en,
        heroMediaId,
        isPublished: true,
        translations: {
          create: [
            {
              language: "en",
              title: entry.title.en,
              subtitle: entry.subtitle?.en,
              body: entry.body?.en,
            },
            {
              language: "tr",
              title: entry.title.tr || entry.title.en,
              subtitle: entry.subtitle?.tr,
              body: entry.body?.tr,
            },
          ],
        },
        externalLinks: entry.externalLinks
          ? {
              create: entry.externalLinks.map((link) => ({
                url: link.url,
                title: link.title,
                type: link.type || "link",
                order: link.order || 0,
              })),
            }
          : undefined,
        media: entry.galleryImages?.length
          ? {
              create: await Promise.all(
                entry.galleryImages.map(async (imagePath, index) => {
                  const galleryMediaId = await ensureMedia(
                    imagePath,
                    `${entry.title.en} gallery ${index + 1}`
                  );
                  return {
                    scope: "gallery",
                    order: index,
                    media: {
                      connect: { id: galleryMediaId },
                    },
                  };
                })
              ),
            }
          : undefined,
      },
    });

    contentSlugToId.set(entry.slug, content.id);

    await Promise.all(
      (entry.groups || []).map((groupSlug, index) => {
        const groupId = groupSlugToId.get(groupSlug);
        if (!groupId) {
          throw new Error(
            `Group slug "${groupSlug}" not found for content ${entry.slug}`
          );
        }
        return prisma.contentGroup.create({
          data: {
            contentId: content.id,
            groupId,
            order: index + 1,
          },
        });
      })
    );
  }
}

async function seedFaqs() {
  console.log("❓ Creating FAQs…");
  const simpleFaqs = readJsonFile("faqSection.json");
  const detailedFaqs = readJsonFile("empowerFaq.json");

  const attachContentId = contentSlugToId.get("first-days-guide");

  for (const faq of simpleFaqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.title,
        answer: Array.isArray(faq.text) ? faq.text.join(" ") : faq.text,
        language: "en",
        order: 0,
        isActive: true,
        contentId: attachContentId,
      },
    });
  }

  let faqOrder = 0;
  for (const category of detailedFaqs) {
    for (const faq of category.text) {
      faqOrder += 1;
      await prisma.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          language: "en",
          order: faqOrder,
          isActive: true,
          contentId: attachContentId,
        },
      });
    }
  }
}

async function seedEvents() {
  console.log("📅 Creating events…");
  const eventsData = readJsonFile("events.json");
  for (const event of eventsData) {
    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description || event.author,
        startDate: new Date(),
        location: event.category,
        url: event.link,
        isActive: true,
      },
    });
  }

  const latestUpdates = readJsonFile("latestUpdates.json");
  for (const update of latestUpdates) {
    await prisma.event.create({
      data: {
        title: update.title,
        description: update.description || update.author,
        startDate: new Date(),
        location: update.category,
        url: update.link,
        isActive: true,
      },
    });
  }
}

async function seedSuccessStories() {
  console.log("⭐ Creating success stories…");
  const testimonials = readJsonFile("testimonial.json");
  for (const testimonial of testimonials) {
    await prisma.successStory.create({
      data: {
        title: testimonial.authorTitle,
        content: testimonial.quote,
        authorName: testimonial.authorName,
        authorImage: testimonial.authorImage,
        isPublished: true,
      },
    });
  }
}

async function clearDatabase() {
  console.log("🧹 Clearing previous data…");
  await prisma.fAQ.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.contentMedia.deleteMany();
  await prisma.contentExternalLink.deleteMany();
  await prisma.contentCitation.deleteMany();
  await prisma.contentGroup.deleteMany();
  await prisma.contentTranslation.deleteMany();
  await prisma.contentSimilar.deleteMany();
  await prisma.content.deleteMany();
  await prisma.groupTranslation.deleteMany();
  await prisma.group.deleteMany();
  await prisma.media.deleteMany();
  await prisma.event.deleteMany();
  await prisma.successStory.deleteMany();
}

async function main() {
  console.log("🌱 Starting structured seed…");
  await clearDatabase();

  console.log("📚 Creating group hierarchy…");
  await createGroupTree(groupTree);

  console.log("📝 Creating content library…");
  await createContents();

  await seedFaqs();
  await seedEvents();
  await seedSuccessStories();

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
