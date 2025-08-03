// WebChannelService.js - Service layer để gọi slot từ React đến Python

class WebChannelService {
  constructor() {
    this.backend = null;
    this.isConnected = false;
    this.connectionPromise = null;
  }

  // Khởi tạo kết nối QWebChannel
  async initialize() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      // Kiểm tra xem QWebChannel đã được inject chưa
      if (typeof qt === 'undefined' || !qt.webChannelTransport) {
        reject(new Error('QWebChannel not available'));
        return;
      }

      // Tạo kết nối QWebChannel
      new QWebChannel(qt.webChannelTransport, (channel) => {
        this.backend = channel.objects.backend;
        this.isConnected = true;
        console.log('✅ QWebChannel connected successfully');
        resolve(this.backend);
      });
    });

    return this.connectionPromise;
  }

  // Kiểm tra kết nối
  isReady() {
    return this.isConnected && this.backend !== null;
  }

  // Reset connection khi có lỗi
  reset() {
    this.backend = null;
    this.isConnected = false;
    this.connectionPromise = null;
    console.log('🔄 WebChannel connection reset');
  }

  // Kiểm tra và reconnect nếu cần
  async ensureConnection() {
    if (!this.isReady()) {
      console.log('🔄 Reconnecting WebChannel...');
      this.reset();
      await this.initialize();
    }
  }

  // Gọi slot với error handling
  async callSlot(slotName, ...args) {
    try {
      await this.ensureConnection();

      if (!this.backend[slotName]) {
        throw new Error(`Slot '${slotName}' not found`);
      }

      console.log(`📡 Calling slot: ${slotName}`, args);
      
      // Wrap the slot call in a Promise with timeout
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Slot '${slotName}' timed out after 10 seconds`));
        }, 10000); // 10 second timeout

        try {
          const result = this.backend[slotName](...args);
          
          // If the result is already a Promise, handle it
          if (result && typeof result.then === 'function') {
            result.then((res) => {
              clearTimeout(timeout);
              resolve(res);
            }).catch((err) => {
              clearTimeout(timeout);
              reject(err);
            });
          } else {
            // If it's not a Promise, resolve immediately
            clearTimeout(timeout);
            resolve(result);
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    } catch (error) {
      console.error(`❌ Error calling slot '${slotName}':`, error);
      // Reset connection on error to prevent stale callbacks
      this.reset();
      throw error;
    }
  }

  // === Các method gọi slot cụ thể ===

  // Menu Button Actions
  async openMenu() {
    return this.callSlot('openMenu');
  }

  async openProfile() {
    return this.callSlot('openProfile');
  }

  async openSettings() {
    return this.callSlot('openSettings');
  }

  // Navigation Actions
  async goBack() {
    return this.callSlot('goBack');
  }

  async navigateToHome() {
    return this.callSlot('navigateToHome');
  }

  // Feature Actions
  async openArchives() {
    return this.callSlot('openArchives');
  }

  async openTelephone() {
    return this.callSlot('openTelephone');
  }

  async openReunions() {
    return this.callSlot('openReunions');
  }

  async openAccueil() {
    return this.callSlot('openAccueil');
  }

  async openCommandes() {
    return this.callSlot('openCommandes');
  }

  async openEmails() {
    return this.callSlot('openEmails');
  }

  async openAgenda() {
    return this.callSlot('openAgenda');
  }

  async openColis() {
    return this.callSlot('openColis');
  }

  // Theme Actions
  async changeTheme(theme) {
    return this.callSlot('changeTheme', theme);
  }

  // Mode Actions
  async changeMode(mode) {
    return this.callSlot('changeMode', mode);
  }

  // Progress Actions
  async updateProgress(value) {
    return this.callSlot('updateProgress', value);
  }

  // System Actions
  async logout() {
    return this.callSlot('logout');
  }

  async shutdown() {
    return this.callSlot('shutdown');
  }

  // Utility Actions
  async sendNotification(message) {
    return this.callSlot('sendNotification', message);
  }

  async logAction(action, details = {}) {
    return this.callSlot('logAction', action, JSON.stringify(details));
  }

  // === Test Methods ===
  async testCloseWindow() {
    return this.callSlot('testCloseWindow');
  }
}

// Tạo instance singleton
const webChannelService = new WebChannelService();

export default webChannelService; 