import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Noto Sans — supports Norwegian characters (øæå)
Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const BLUE = "#1B4F72";
const DARK = "#1C2833";
const GREY = "#5d6b7a";
const LIGHT = "#F4F6F7";
const BORDER = "#e5e9ec";
const GREEN = "#1E8449";

const s = StyleSheet.create({
  page: { fontFamily: "NotoSans", fontSize: 10, color: DARK, paddingHorizontal: 40, paddingVertical: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: BLUE },
  headerLeft: { flexDirection: "column" },
  brand: { fontSize: 18, fontWeight: "bold", color: BLUE },
  brandSub: { fontSize: 9, color: GREY, marginTop: 2 },
  headerRight: { flexDirection: "column", alignItems: "flex-end" },
  headerTitle: { fontSize: 11, fontWeight: "bold", color: DARK },
  headerDate: { fontSize: 9, color: GREY, marginTop: 3 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: BLUE, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: BORDER },
  card: { backgroundColor: LIGHT, borderRadius: 4, padding: 10, marginBottom: 8 },
  cardTitle: { fontSize: 10, fontWeight: "bold", color: DARK, marginBottom: 5 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
  checkbox: { width: 12, height: 12, borderWidth: 1, borderColor: GREY, borderRadius: 2, marginRight: 6, marginTop: 1, flexShrink: 0 },
  checkboxChecked: { width: 12, height: 12, backgroundColor: GREEN, borderRadius: 2, marginRight: 6, marginTop: 1, flexShrink: 0, justifyContent: "center", alignItems: "center" },
  checkmark: { color: "white", fontSize: 8, fontWeight: "bold" },
  itemText: { flex: 1, fontSize: 9, color: DARK, lineHeight: 1.4 },
  itemTextChecked: { flex: 1, fontSize: 9, color: GREY, lineHeight: 1.4 },
  categoryTitle: { fontSize: 10, fontWeight: "bold", color: DARK, marginTop: 6, marginBottom: 3 },
  inventoryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: BORDER },
  inventoryName: { fontSize: 9, color: DARK },
  inventoryQty: { fontSize: 9, color: GREY },
  contactRow: { flexDirection: "row", gap: 12, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: BORDER },
  contactName: { fontSize: 9, fontWeight: "bold", color: DARK, width: 120 },
  contactRole: { fontSize: 9, color: GREY, width: 80 },
  contactPhone: { fontSize: 9, color: DARK },
  meetingRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: BORDER },
  meetingPriority: { width: 18, height: 18, backgroundColor: BLUE, borderRadius: 3, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  meetingPriorityText: { color: "white", fontSize: 8, fontWeight: "bold" },
  meetingName: { fontSize: 9, fontWeight: "bold", color: DARK },
  meetingAddress: { fontSize: 8, color: GREY },
  empty: { fontSize: 9, color: GREY, fontStyle: "italic" },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8 },
  footerText: { fontSize: 8, color: GREY },
  progressBar: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  progressTrack: { flex: 1, height: 4, backgroundColor: BORDER, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: GREEN, borderRadius: 2 },
  progressLabel: { fontSize: 8, color: GREY, width: 32, textAlign: "right" },
});

export interface PdfChecklist {
  id: string;
  title: string;
  items: { id: string; text: string; checked: boolean }[];
}

export interface PdfInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

export interface PdfContact {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
}

export interface PdfMeetingPoint {
  id: string;
  name: string;
  address: string | null;
  priority: number;
}

interface Props {
  userName: string | null;
  generatedAt: string;
  checklists: PdfChecklist[];
  inventoryItems: PdfInventoryItem[];
  contacts: PdfContact[];
  meetingPoints: PdfMeetingPoint[];
}

const CATEGORY_LABELS: Record<string, string> = {
  mat: "Mat",
  vann: "Vann",
  medisiner: "Medisiner",
  utstyr: "Utstyr",
  sikkerhetsutstyr: "Sikkerhetsutstyr",
  annet: "Annet",
};

export function BeredskapsplanDocument({
  userName,
  generatedAt,
  checklists,
  inventoryItems,
  contacts,
  meetingPoints,
}: Props) {
  const categorised = inventoryItems.reduce<Record<string, PdfInventoryItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Document title="Beredskapsplan – HjemTrygg" author="HjemTrygg" subject="Hjemmeberedskap">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.brand}>HjemTrygg</Text>
            <Text style={s.brandSub}>Din digitale beredskapsportal</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerTitle}>Beredskapsplan{userName ? ` – ${userName}` : ""}</Text>
            <Text style={s.headerDate}>Generert: {generatedAt}</Text>
          </View>
        </View>

        {/* Sjekklister */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sjekklister</Text>
          {checklists.length === 0 ? (
            <Text style={s.empty}>Ingen sjekklister registrert.</Text>
          ) : (
            checklists.map((cl) => {
              const checked = cl.items.filter((i) => i.checked).length;
              const pct = cl.items.length > 0 ? Math.round((checked / cl.items.length) * 100) : 0;
              return (
                <View key={cl.id} style={s.card}>
                  <Text style={s.cardTitle}>{cl.title}</Text>
                  <View style={s.progressBar}>
                    <View style={s.progressTrack}>
                      <View style={[s.progressFill, { width: `${pct}%` as unknown as number }]} />
                    </View>
                    <Text style={s.progressLabel}>{pct}%</Text>
                  </View>
                  <View style={{ marginTop: 6 }}>
                    {cl.items.map((item) => (
                      <View key={item.id} style={s.row}>
                        <View style={item.checked ? s.checkboxChecked : s.checkbox}>
                          {item.checked && <Text style={s.checkmark}>✓</Text>}
                        </View>
                        <Text style={item.checked ? s.itemTextChecked : s.itemText}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Beredskapslager */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Beredskapslager</Text>
          {inventoryItems.length === 0 ? (
            <Text style={s.empty}>Ingen lagervarer registrert.</Text>
          ) : (
            Object.entries(categorised).map(([cat, items]) => (
              <View key={cat}>
                <Text style={s.categoryTitle}>{CATEGORY_LABELS[cat] ?? cat}</Text>
                {items.map((item) => (
                  <View key={item.id} style={s.inventoryRow}>
                    <Text style={s.inventoryName}>{item.name}</Text>
                    <Text style={s.inventoryQty}>{item.quantity} {item.unit}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        {/* Familieplan */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Familieplan</Text>

          <Text style={s.categoryTitle}>Kontakter</Text>
          {contacts.length === 0 ? (
            <Text style={s.empty}>Ingen kontakter registrert.</Text>
          ) : (
            contacts.map((c) => (
              <View key={c.id} style={s.contactRow}>
                <Text style={s.contactName}>{c.name}</Text>
                <Text style={s.contactRole}>{c.role ?? "–"}</Text>
                <Text style={s.contactPhone}>{c.phone ?? c.email ?? "–"}</Text>
              </View>
            ))
          )}

          <Text style={[s.categoryTitle, { marginTop: 10 }]}>Møtepunkter</Text>
          {meetingPoints.length === 0 ? (
            <Text style={s.empty}>Ingen møtepunkter registrert.</Text>
          ) : (
            [...meetingPoints].sort((a, b) => a.priority - b.priority).map((mp) => (
              <View key={mp.id} style={s.meetingRow}>
                <View style={s.meetingPriority}>
                  <Text style={s.meetingPriorityText}>{mp.priority}</Text>
                </View>
                <View>
                  <Text style={s.meetingName}>{mp.name}</Text>
                  {mp.address && <Text style={s.meetingAddress}>{mp.address}</Text>}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>HjemTrygg AS · hjemtrygg.no</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
