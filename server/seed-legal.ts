import * as db from "./db";

async function seedLegal() {
  console.log("Seeding legal documents...");
  
  const docs = [
    {
      name: "TIN Card (NPWP)",
      type: "TIN",
      documentNumber: "1000000007317084",
      fileUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663895636910/LkdRsIEbgtKmGPXl.pdf",
      metadata: {
        companyName: "PT JAYA ABADI LUMAJANG",
        address: "JL. KALIMAS SUKO ROGOTRUNAN LUMAJANG RT. 001 RW. 013, ROGOTRUNAN, LUMAJANG, KAB. LUMAJANG, JAWA TIMUR",
        registrationDate: "12/12/2025"
      },
      isVerified: true,
      verifiedAt: new Date()
    },
    {
      name: "NIB (Nomor Induk Berusaha)",
      type: "NIB",
      documentNumber: "1212250003718",
      fileUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663895636910/eaExQVKwYUrjcsAE.pdf",
      metadata: {
        companyName: "PT JAYA ABADI LUMAJANG",
        npwp: "10.000.000.0-731.7084",
        kbli: "79903",
        email: "ptjayaabadilumajang@gmail.com"
      },
      isVerified: true,
      verifiedAt: new Date()
    },
    {
      name: "Surat Pernyataan",
      type: "PERNYATAAN",
      documentNumber: "41251211350187231",
      fileUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663895636910/yAmjIeGmlAXlvAbU.pdf",
      isVerified: true,
      verifiedAt: new Date()
    },
    {
      name: "Surat Sertifikat",
      type: "SERTIFIKAT",
      documentNumber: "41251211350187231",
      fileUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663895636910/nsAbiouIsVyaTSVr.pdf",
      isVerified: true,
      verifiedAt: new Date()
    }
  ];

  for (const doc of docs) {
    await db.addLegalDocument(doc);
    console.log(`Added: ${doc.name}`);
  }
  
  console.log("Legal documents seeded successfully.");
}

seedLegal().catch(console.error);
