import { PrismaClient } from "@prisma/client";

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

  "Router": {
    fields: [
      { key: "ipAddress", label: "Yönetim IP Adresi", type: "text", required: true },
      { key: "wifiStandard", label: "WiFi Standardı", type: "select", options: ["802.11n", "802.11ac", "802.11ax (WiFi 6)", "WiFi 6E"], required: true },
      { key: "maxSpeed", label: "Maksimum Hız (Mbps)", type: "number", required: true },
      { key: "ethernetPorts", label: "Ethernet Port Sayısı", type: "number", required: true },
      { key: "frequency", label: "Frekans Bandı", type: "multiselect", options: ["2.4GHz", "5GHz", "6GHz"], required: true },
      { key: "antennaCount", label: "Anten Sayısı", type: "number", required: false },
      { key: "meshSupport", label: "Mesh Desteği", type: "boolean", required: false },
      { key: "vpnSupport", label: "VPN Desteği", type: "boolean", required: false },
    ]
  },

  "Network Switch": {
    fields: [
      { key: "ipAddress", label: "Yönetim IP Adresi", type: "text", required: false },
      { key: "portCount", label: "Port Sayısı", type: "number", required: true },
      { key: "portSpeed", label: "Port Hızı", type: "select", options: ["10/100 Mbps", "Gigabit", "10 Gigabit", "Mixed"], required: true },
      { key: "managedType", label: "Yönetim Türü", type: "select", options: ["Unmanaged", "Smart/Web Managed", "Fully Managed"], required: true },
      { key: "poeSupport", label: "PoE Desteği", type: "select", options: ["Yok", "PoE", "PoE+", "PoE++"], required: false },
      { key: "stackable", label: "Yığınlanabilir", type: "boolean", required: false },
      { key: "rackMountable", label: "Rack Montajlı", type: "boolean", required: false },
    ]
  },

  "Uninterruptible Power Supply (UPS)": {
    fields: [
      { key: "capacity", label: "Kapasite (VA)", type: "number", required: true },
      { key: "wattage", label: "Güç (W)", type: "number", required: true },
      { key: "batteryType", label: "Pil Türü", type: "select", options: ["Sealed Lead Acid", "Lithium Ion", "Nickel Cadmium"], required: false },
      { key: "backupTime", label: "Yedekleme Süresi (dakika)", type: "number", required: false },
      { key: "inputVoltage", label: "Giriş Voltajı (V)", type: "text", required: false },
      { key: "outputOutlets", label: "Çıkış Soket Sayısı", type: "number", required: false },
      { key: "networkManagement", label: "Ağ Yönetimi", type: "boolean", required: false },
      { key: "displayType", label: "Ekran Türü", type: "select", options: ["Yok", "LED", "LCD"], required: false },
    ]
  },

  // ==================== PERIPHERALS & INPUT DEVICES ====================
  "Keyboard": {
    fields: [
      { key: "keyboardType", label: "Klavye Türü", type: "select", options: ["Membrane", "Mechanical", "Chiclet", "Scissor"], required: true },
      { key: "layout", label: "Düzen", type: "select", options: ["QWERTY TR", "QWERTY US", "QWERTZ", "AZERTY"], required: true },
      { key: "connectionType", label: "Bağlantı Türü", type: "select", options: ["USB", "PS/2", "Wireless", "Bluetooth"], required: true },
      { key: "backlighting", label: "Arka Işık", type: "boolean", required: false },
      { key: "numericKeypad", label: "Numerik Tuş Takımı", type: "boolean", required: false },
      { key: "functionKeys", label: "Fonksiyon Tuşları", type: "boolean", required: false },
      { key: "waterResistant", label: "Su Geçirmez", type: "boolean", required: false },
    ]
  },

  "Mouse": {
    fields: [
      { key: "mouseType", label: "Fare Türü", type: "select", options: ["Optical", "Laser", "Trackball"], required: true },
      { key: "connectionType", label: "Bağlantı Türü", type: "select", options: ["USB", "PS/2", "Wireless", "Bluetooth"], required: true },
      { key: "buttonCount", label: "Tuş Sayısı", type: "number", required: false },
      { key: "dpi", label: "DPI", type: "number", required: false },
      { key: "scrollWheel", label: "Kaydırma Tekerleği", type: "boolean", required: false },
      { key: "ergonomic", label: "Ergonomik", type: "boolean", required: false },
      { key: "handPreference", label: "El Tercihi", type: "select", options: ["Sağ El", "Sol El", "İki El"], required: false },
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

  // ==================== PRINTING & IMAGING ====================
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

  "Scanner": {
    fields: [
      { key: "scannerType", label: "Tarayıcı Türü", type: "select", options: ["Flatbed", "Sheet-fed", "Handheld", "Drum"], required: true },
      { key: "maxResolution", label: "Maksimum Çözünürlük (dpi)", type: "text", required: true },
      { key: "colorDepth", label: "Renk Derinliği (bit)", type: "number", required: false },
      { key: "scanArea", label: "Tarama Alanı", type: "text", required: false },
      { key: "connectivity", label: "Bağlantı", type: "multiselect", options: ["USB", "Ethernet", "WiFi"], required: false },
      { key: "autoFeeder", label: "Otomatik Besleyici", type: "boolean", required: false },
      { key: "duplexScanning", label: "Çift Taraflı Tarama", type: "boolean", required: false },
    ]
  },

  "Photocopier": {
    fields: [
      { key: "copySpeed", label: "Kopyalama Hızı (sayfa/dk)", type: "number", required: true },
      { key: "maxResolution", label: "Maksimum Çözünürlük (dpi)", type: "text", required: false },
      { key: "paperSizes", label: "Kağıt Boyutları", type: "multiselect", options: ["A4", "A3", "A5", "Letter", "Legal"], required: false },
      { key: "colorSupport", label: "Renk Desteği", type: "select", options: ["Monochrome", "Color"], required: true },
      { key: "autoFeeder", label: "Otomatik Doküman Besleyicisi", type: "boolean", required: false },
      { key: "paperCapacity", label: "Kağıt Kapasitesi", type: "number", required: false },
      { key: "reductionEnlargement", label: "Küçültme/Büyütme", type: "text", required: false },
      { key: "monthlyVolume", label: "Aylık Kopya Kapasitesi", type: "number", required: false },
    ]
  },

  "All-in-One Printer": {
    fields: [
      { key: "functions", label: "Fonksiyonlar", type: "multiselect", options: ["Print", "Scan", "Copy", "Fax"], required: true },
      { key: "printerType", label: "Yazıcı Türü", type: "select", options: ["Inkjet", "Laser"], required: true },
      { key: "colorSupport", label: "Renk Desteği", type: "select", options: ["Monochrome", "Color"], required: true },
      { key: "printSpeed", label: "Yazdırma Hızı (sayfa/dk)", type: "number", required: false },
      { key: "scanResolution", label: "Tarama Çözünürlüğü (dpi)", type: "text", required: false },
      { key: "connectivity", label: "Bağlantı", type: "multiselect", options: ["USB", "Ethernet", "WiFi", "Bluetooth"], required: false },
      { key: "autoFeeder", label: "Otomatik Doküman Besleyicisi", type: "boolean", required: false },
      { key: "duplexSupport", label: "Çift Taraflı Yazdırma", type: "boolean", required: false },
      { key: "touchScreen", label: "Dokunmatik Ekran", type: "boolean", required: false },
    ]
  },

  // ==================== COMMUNICATION & PRESENTATION ====================
  "Desk Phone": {
    fields: [
      { key: "phoneType", label: "Telefon Türü", type: "select", options: ["Analog", "Digital", "IP/VoIP"], required: true },
      { key: "displayType", label: "Ekran Türü", type: "select", options: ["Yok", "LED", "LCD", "Color LCD"], required: false },
      { key: "lineSupport", label: "Hat Desteği", type: "number", required: false },
      { key: "speakerphone", label: "Hoparlör Telefon", type: "boolean", required: false },
      { key: "headsetPort", label: "Kulaklık Portu", type: "boolean", required: false },
      { key: "callerId", label: "Arayan Kimliği", type: "boolean", required: false },
      { key: "programmableKeys", label: "Programlanabilir Tuşlar", type: "number", required: false },
      { key: "powerSource", label: "Güç Kaynağı", type: "select", options: ["AC Adapter", "PoE", "Both"], required: false },
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

  "Projector": {
    fields: [
      { key: "projectorType", label: "Projektör Türü", type: "select", options: ["LCD", "DLP", "LED", "Laser"], required: true },
      { key: "brightness", label: "Parlaklık (lümen)", type: "number", required: true },
      { key: "resolution", label: "Çözünürlük", type: "select", options: ["SVGA (800x600)", "XGA (1024x768)", "WXGA (1280x800)", "Full HD (1920x1080)", "4K (3840x2160)"], required: true },
      { key: "contrastRatio", label: "Kontrast Oranı", type: "text", required: false },
      { key: "connectivity", label: "Bağlantı", type: "multiselect", options: ["HDMI", "VGA", "USB", "WiFi", "Bluetooth"], required: false },
      { key: "lampLife", label: "Lamba Ömrü (saat)", type: "number", required: false },
      { key: "throwRatio", label: "Atış Oranı", type: "text", required: false },
      { key: "weight", label: "Ağırlık (kg)", type: "number", required: false },
    ]
  },

  "Webcam": {
    fields: [
      { key: "resolution", label: "Video Çözünürlüğü", type: "select", options: ["720p", "1080p", "4K"], required: true },
      { key: "frameRate", label: "Kare Hızı (fps)", type: "select", options: [15, 30, 60], required: false },
      { key: "fieldOfView", label: "Görüş Alanı (derece)", type: "number", required: false },
      { key: "autofocus", label: "Otomatik Odaklama", type: "boolean", required: false },
      { key: "microphone", label: "Dahili Mikrofon", type: "boolean", required: false },
      { key: "connectionType", label: "Bağlantı", type: "select", options: ["USB 2.0", "USB 3.0", "USB-C"], required: true },
      { key: "mountType", label: "Montaj Türü", type: "multiselect", options: ["Clip-on", "Stand", "Tripod"], required: false },
    ]
  },

  "Headset": {
    fields: [
      { key: "headsetType", label: "Kulaklık Türü", type: "select", options: ["On-ear", "Over-ear", "In-ear"], required: true },
      { key: "connectionType", label: "Bağlantı", type: "select", options: ["3.5mm Jack", "USB", "Wireless", "Bluetooth"], required: true },
      { key: "microphoneType", label: "Mikrofon Türü", type: "select", options: ["Boom", "Inline", "Built-in", "None"], required: false },
      { key: "noiseCancellation", label: "Gürültü Engelleme", type: "boolean", required: false },
      { key: "wirelessRange", label: "Kablosuz Menzil (m)", type: "number", required: false },
      { key: "batteryLife", label: "Pil Ömrü (saat)", type: "number", required: false },
      { key: "compatibility", label: "Uyumluluk", type: "multiselect", options: ["PC", "Mac", "Mobile", "Gaming Console"], required: false },
    ]
  },

  // ==================== OTHER OFFICE EQUIPMENT ====================
  "Paper Shredder": {
    fields: [
      { key: "shredType", label: "Parçalama Türü", type: "select", options: ["Strip Cut", "Cross Cut", "Micro Cut"], required: true },
      { key: "securityLevel", label: "Güvenlik Seviyesi", type: "select", options: ["P-1", "P-2", "P-3", "P-4", "P-5", "P-6", "P-7"], required: false },
      { key: "sheetCapacity", label: "Sayfa Kapasitesi", type: "number", required: true },
      { key: "binCapacity", label: "Çöp Kutusu Kapasitesi (L)", type: "number", required: false },
      { key: "continuousRunTime", label: "Sürekli Çalışma (dk)", type: "number", required: false },
      { key: "autoStart", label: "Otomatik Başlangıç", type: "boolean", required: false },
      { key: "jamProtection", label: "Sıkışma Koruması", type: "boolean", required: false },
    ]
  },

  "Barcode Scanner": {
    fields: [
      { key: "scannerType", label: "Tarayıcı Türü", type: "select", options: ["Handheld", "Hands-free", "Fixed Mount"], required: true },
      { key: "technology", label: "Teknoloji", type: "select", options: ["Laser", "Linear Imager", "2D Imager"], required: true },
      { key: "barcodeTypes", label: "Barkod Türleri", type: "multiselect", options: ["1D", "2D", "QR Code", "Data Matrix"], required: true },
      { key: "connectionType", label: "Bağlantı", type: "select", options: ["USB", "RS232", "Wireless", "Bluetooth"], required: true },
      { key: "scanRange", label: "Tarama Mesafesi (cm)", type: "text", required: false },
      { key: "scanRate", label: "Tarama Hızı (scan/sn)", type: "number", required: false },
      { key: "durability", label: "Dayanıklılık", type: "text", required: false },
    ]
  },

  "Fax Machine": {
    fields: [
      { key: "faxType", label: "Faks Türü", type: "select", options: ["Thermal", "Inkjet", "Laser"], required: true },
      { key: "transmissionSpeed", label: "İletim Hızı (bps)", type: "number", required: false },
      { key: "memoryCapacity", label: "Bellek Kapasitesi (sayfa)", type: "number", required: false },
      { key: "autoDialNumbers", label: "Otomatik Arama Numaraları", type: "number", required: false },
      { key: "paperSize", label: "Kağıt Boyutu", type: "multiselect", options: ["A4", "Letter", "Legal"], required: false },
      { key: "autoFeeder", label: "Otomatik Doküman Besleyicisi", type: "boolean", required: false },
      { key: "callerID", label: "Arayan Kimliği", type: "boolean", required: false },
      { key: "answeringMachine", label: "Telesekretör", type: "boolean", required: false },
    ]
  },
};

async function updateCategoryTemplates() {
  console.log("Kategori field template'leri güncelleniyor...");

  for (const [categoryName, template] of Object.entries(categoryFieldTemplates)) {
    try {
      await prisma.category.update({
        where: { name: categoryName },
        data: {
          fieldTemplate: template,
        },
      });
      console.log(`✅ ${categoryName} template'i güncellendi (${template.fields.length} alan)`);
    } catch (error) {
      console.log(`❌ ${categoryName} template'i güncellenemedi:`, error);
    }
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
