import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "@/../public/logo/icon.png";
import { FreshOperation } from "../result/page";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingHorizontal: 35,
    paddingBottom: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1F2B40",
    lineHeight: 1.4,
  },

  // HEADER - Style professionnel avec bordure
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
    borderBottomWidth: 1.5,
    borderBottomColor: "#1F2B40",
    borderBottomStyle: "solid",
    paddingBottom: 15,
  },
  headerLogo: {
    width: 130,
    height: 45,
  },
  headerRight: {
    textAlign: "right",
    fontSize: 9,
    color: "#1F2B40",
  },

  // TITRE PRINCIPAL - Style élégant
  mainTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // SECTIONS - Style structuré
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    width: "35%",
  },
  value: {
    width: "65%",
  },

  // LISTE À PUCE
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    paddingRight: 5,
  },
  bulletText: {
    flex: 1,
  },

  // FOOTER - Style discret
  footer: {
    position: "absolute",
    bottom: 20,
    left: 35,
    right: 35,
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    borderTopStyle: "solid",
    paddingTop: 8,
  },
  footerLine: {
    marginBottom: 3,
  },
});

export function DeclarationPDF({ data }: { data: FreshOperation }) {
  const d = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* =======================
            🏢 HEADER PROFESSIONNEL
        ======================== */}
        <View style={styles.headerContainer}>
          <View>
            <Image src="/logo/icon.png" style={styles.headerLogo} />
          </View>

          <View style={styles.headerRight}>
            <Text>{d.organization?.name}</Text>
            <Text>République Démocratique du Congo</Text>
            <Text>{new Date().toLocaleDateString("fr-FR")}</Text>
          </View>
        </View>

        {/* =======================
             TITRE PRINCIPAL
        ======================== */}
        <Text style={styles.mainTitle}>Attestation de Déclaration Fiscale</Text>

        {/* =======================
             INFORMATIONS GÉNÉRALES
        ======================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Générales</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Numéro de déclaration :</Text>
            <Text style={styles.value}>{d.serialNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Statut :</Text>
            <Text style={styles.value}>{d.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Montant dû :</Text>
            <Text style={styles.value}>
              {d.totalAmount} {d.currency?.formatKey}
            </Text>
          </View>
        </View>

        {/* =======================
             BIEN DÉCLARÉ
        ======================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bien Déclaré</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Type :</Text>
            <Text style={styles.value}>{d.possession.type.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse :</Text>
            <Text style={styles.value}>
              {d.possession.meta.parcelleAddress}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Référence cadastrale :</Text>
            <Text style={styles.value}>
              {d.possession.meta.referenceCadastrale}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Surface :</Text>
            <Text style={styles.value}>
              {d.possession.meta.surfaceTotale} m²
            </Text>
          </View>
        </View>

        {/* =======================
             CONTRIBUABLE
        ======================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contribuable</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Nom complet :</Text>
            <Text style={styles.value}>
              {d.possession.taxPayer.firstName} {d.possession.taxPayer.lastName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone :</Text>
            <Text style={styles.value}>{d.possession.taxPayer.mobile}</Text>
          </View>
        </View>

        {/* =======================
             IMPÔTS APPLIQUÉS
        ======================== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impôts Appliqués</Text>

          {d.transactions.map((t, i) => (
            <View key={i} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                {t.motif} : {t.amount} {d.currency?.formatKey}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLine}>
            RCCM : CD/KIN/RCCM/00-00000 | ID NAT : 000000000000000 | NIF :
            0000000000
          </Text>
          <Text>
            +243 81 000 00 00 — info@digipublic.cd — www.digipublic.cd
          </Text>
        </View>
      </Page>
    </Document>
  );
}
