const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Her kategori için özel alan şablonları
const categoryFieldTemplates = {
  // ==================== CORE COMPUTING & NETWORKING ====================
  "Desktop Computer": {
    fields: [
      { key: "ipAddress", label: "IP Adresi", type: "text", required: false },
      { key: "domainUser", label: "Domain Kullanıcısı", type: "text", required: false },
      { key: "operatingSystem", label: "İşletim Sistemi", type: "select", options: ["Windows 10", "Windows 11", "Ubuntu", "macOS", "Other"], required: true },
      { key: "processor", label: "İşlemci", type: "text", required: true },
      { key: "ramSize", label: "RAM (GB)", type: "number", required: true },
      { key: "storageType", label: "Depolama Türü", type: "select", options: ["HDD", "SSD", "Hybrid"], required: true },
      { key: "storageSize", label: "Depolama Boyutu (GB)", type: "number", required: true },
      { key: "graphicsCard", label: "Ekran Kartı", type: "text", required: false },
      { key: "networkCard", label: "Ağ Kartı", type: "text", required: false },
      { key: "powerSupply", label: "Güç Kaynağı (W)", type: "number", required: false },
    ]
  },
  
  "Laptop Computer": {
    fields: [
      { key: "ipAddress", label: "IP Adresi", type: "text", required: false },
      { key: "domainUser", label: "Domain Kullanıcısı", type: "text", required: false },
      { key: "operatingSystem", label: "İşletim Sistemi", type: "select", options: ["Windows 10", "Windows 11", "Ubuntu", "macOS", "Other"], required: true },
      { key: "processor", label: "İşlemci", type: "text", required: true },
      { key: "ramSize", label: "RAM (GB)", type: "number", required: true },
      { key: "storageType", label: "Depolama Türü", type: "select", options: ["HDD", "SSD", "eMMC"], required: true },
      { key: "storageSize", label: "Depolama Boyutu (GB)", type: "number", required: true },
      { key: "screenSize", label: "Ekran Boyutu (inç)", type: "number", required: true },
      { key: "resolution", label: "Çözünürlük", type: "select", options: ["1366x768", "1920x1080", "2560x1440", "3840x2160"], required: false },
      { key: "batteryLife", label: "Pil Ömrü (saat)", type: "number", required: false },
      { key: "weight", label: "Ağırlık (kg)", type: "number", required: false },
    ]
  },

  "All-in-One Computer": {
    fields: [
      { key: "ipAddress", label: "IP Adresi", type: "text", required: false },
      { key: "domainUser", label: "Domain Kullanıcısı", type: "text", required: false },
      { key: "operatingSystem", label: "İşletim Sistemi", type: "select", options: ["Windows 10", "Windows 11", "macOS", "Other"], required: true },
      { key: "processor", label: "İşlemci", type: "text", required: true },
      { key: "ramSize", label: "RAM (GB)", type: "number", required: true },
      { key: "storageType", label: "Depolama Türü", type: "select", options: ["HDD", "SSD", "Hybrid"], required: true },
      { key: "storageSize", label: "Depolama Boyutu (GB)", type: "number", required: true },
      { key: "screenSize", label: "Ekran Boyutu (inç)", type: "number", required: true },
      { key: "resolution", label: "Çözünürlük", type: "select", options: ["1920x1080", "2560x1440", "3840x2160", "5120x2880"], required: true },
      { key: "touchScreen", label: "Dokunmatik Ekran", type: "boolean", required: false },
    ]
  },

  "Server": {
    fields: [
      { key: "ipAddress", label: "IP Adresi", type: "text", required: true },
      { key: "serverName", label: "Sunucu Adı", type: "text", required: true },
      { key: "operatingSystem", label: "İşletim Sistemi", type: "select", options: ["Windows Server 2019", "Windows Server 2022", "Ubuntu Server", "CentOS", "RHEL"], required: true },
      { key: "processor", label: "İşlemci", type: "text", required: true },
      { key: "coreCount", label: "Çekirdek Sayısı", type: "number", required: true },
      { key: "ramSize", label: "RAM (GB)", type: "number", required: true },
      { key: "storageType", label: "Depolama Türü", type: "select", options: ["HDD", "SSD", "NVMe", "RAID"], required: true },
      { key: "storageSize", label: "Toplam Depolama (TB)", type: "number", required: true },
      { key: "rackUnit", label: "Rack Ünitesi (U)", type: "number", required: false },
      { key: "powerConsumption", label: "Güç Tüketimi (W)", type: "number", required: false },
      { key: "serverRole", label: "Sunucu Rolü", type: "text", required: false },
    ]
  },

  "Monitor": {
    fields: [
      { key: "screenSize", label: "Ekran Boyutu (inç)", type: "number", required: true },
      { key: "resolution", label: "Çözünürlük", type: "select", options: ["1920x1080", "2560x1440", "3840x2160", "5120x2880"], required: true },
      { key: "panelType", label: "Panel Türü", type: "select", options: ["TN", "IPS", "VA", "OLED"], required: false },
      { key: "refreshRate", label: "Yenileme Hızı (Hz)", type: "select", options: [60, 75, 120, 144, 240], required: false },
      { key: "inputPorts", label: "Giriş Portları", type: "multiselect", options: ["HDMI", "DisplayPort", "VGA", "DVI", "USB-C", "Thunderbolt"], required: false },
      { key: "adjustableStand", label: "Ayarlanabilir Stand", type: "boolean", required: false },
      { key: "builtInSpeakers", label: "Dahili Hoparlör", type: "boolean", required: false },
    ]
  },

  "External Hard Drive": {
    fields: [
      { key: "capacity", label: "Kapasite (GB/TB)", type: "text", required: true },
      { key: "driveType", label: "Disk Türü", type: "select", options: ["HDD", "SSD", "Hybrid"], required: true },
      { key: "connectionInterface", label: "Bağlantı Arayüzü", type: "select", options: ["USB 2.0", "USB 3.0", "USB 3.1", "USB-C", "Thunderbolt", "eSATA"], required: true },
      { key: "formFactor", label: "Form Faktörü", type: "select", options: ["2.5 inch", "3.5 inch", "M.2"], required: true },
      { key: "transferSpeed", label: "Transfer Hızı (MB/s)", type: "number", required: false },
      { key: "encryption", label: "Şifreleme Desteği", type: "boolean", required: false },
      { key: "powerSource", label: "Güç Kaynağı", type: "select", options: ["USB Powered", "External Adapter", "Both"], required: false },
      { key: "dimensions", label: "Boyutlar (mm)", type: "text", required: false },
      { key: "weight", label: "Ağırlık (g)", type: "number", required: false },
    ]
  },

  "Printer": {
    fields: [
      { key: "printerType", label: "Yazıcı Türü", type: "select", options: ["Inkjet", "Laser", "Dot Matrix", "Thermal"], required: true },
      { key: "colorSupport", label: "Renk Desteği", type: "select", options: ["Monochrome", "Color"], required: true },
      { key: "printSpeed", label: "Yazdırma Hızı (sayfa/dk)", type: "number", required: false },
      { key: "maxResolution", label: "Maksimum Çözünürlük (dpi)", type: "text", required: false },
      { key: "paperSizes", label: "Kağıt Boyutları", type: "multiselect", options: ["A4", "A3", "Letter", "Legal", "Photo"], required: false },
      { key: "connectivity", label: "Bağlantı Seçenekleri", type: "multiselect", options: ["USB", "Ethernet", "WiFi", "Bluetooth"], required: false },
      { key: "duplexSupport", label: "Çift Taraflı Yazdırma", type: "boolean", required: false },
      { key: "monthlyDuty", label: "Aylık Yazdırma Kapasitesi", type: "number", required: false },
    ]
  },

  "Smartphone": {
    fields: [
      { key: "operatingSystem", label: "İşletim Sistemi", type: "select", options: ["Android", "iOS", "Windows Phone", "Other"], required: true },
      { key: "screenSize", label: "Ekran Boyutu (inç)", type: "number", required: true },
      { key: "resolution", label: "Çözünürlük", type: "text", required: false },
      { key: "storageCapacity", label: "Depolama (GB)", type: "number", required: true },
      { key: "ramSize", label: "RAM (GB)", type: "number", required: false },
      { key: "cameraResolution", label: "Kamera Çözünürlüğü (MP)", type: "text", required: false },
      { key: "batteryCapacity", label: "Pil Kapasitesi (mAh)", type: "number", required: false },
      { key: "connectivity", label: "Bağlantı", type: "multiselect", options: ["3G", "4G", "5G", "WiFi", "Bluetooth", "NFC"], required: false },
      { key: "dualSim", label: "Çift SIM", type: "boolean", required: false },
    ]
  },
};

async function updateCategoryTemplates() {
  console.log("Kategori field template'leri güncelleniyor...");

  for (const [categoryName, template] of Object.entries(categoryFieldTemplates)) {
    try {
      // Önce kategori var mı kontrol et, yoksa oluştur
      let category = await prisma.category.findUnique({
        where: { name: categoryName }
      });
      
      if (!category) {
        // Kategori yoksa oluştur
        const categoryCode = getCategoryCode(categoryName);
        category = await prisma.category.create({
          data: {
            name: categoryName,
            code: categoryCode,
            fieldTemplate: template
          }
        });
        console.log(`✅ ${categoryName} kategorisi oluşturuldu ve template eklendi (${template.fields.length} alan)`);
      } else {
        // Kategori varsa sadece template'i güncelle
        await prisma.category.update({
          where: { name: categoryName },
          data: { fieldTemplate: template }
        });
        console.log(`✅ ${categoryName} template'i güncellendi (${template.fields.length} alan)`);
      }
    } catch (error) {
      console.log(`❌ ${categoryName} template'i güncellenemedi:`, error.message);
    }
  }

// Kategori kod oluşturma fonksiyonu
function getCategoryCode(categoryName) {
  const codeMap = {
    'Desktop Computer': 'DSK',
    'Laptop Computer': 'LPT', 
    'All-in-One Computer': 'AIO',
    'Server': 'SRV',
    'Monitor': 'MON',
    'External Hard Drive': 'EHD',
    'Printer': 'PRT',
    'Smartphone': 'SPH',
    'Tablet': 'TAB',
    'Router': 'RTR',
    'Switch': 'SWT',
    'Firewall': 'FWL',
    'UPS': 'UPS',
    'Scanner': 'SCN',
    'Projector': 'PRJ',
    'Camera': 'CAM',
    'Headset': 'HDS',
    'Keyboard': 'KBD',
    'Mouse': 'MSE',
    'Speaker': 'SPK',
    'External SSD': 'SSD',
    'USB Drive': 'USB',
    'External CD/DVD Drive': 'ECD',
    'Network Adapter': 'NAD',
    'Graphics Card': 'GFX',
    'RAM Memory': 'RAM',
    'Cooling Fan': 'FAN'
  };
  
  return codeMap[categoryName] || categoryName.substring(0, 3).toUpperCase();
}

  console.log("\n🎉 Tüm kategori template'leri güncellendi!");
}

updateCategoryTemplates()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
