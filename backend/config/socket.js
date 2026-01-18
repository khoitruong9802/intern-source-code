const { Server } = require('socket.io');
const { setupAdminSocket } = require('../sockets/adminSocket');
const { setupScreenSocket } = require('../sockets/screenSocket');
const settingService = require('../services/settingService');
const flightService = require('../services/flightService');
const { snakeToCamel } = require('../utils/helpers');

const SocketService = {
  io: null,
  intervalId: null,
  intervalTime: 5000, // Default interval time
  screens: new Map(),

  setupSocketServer: async function (server) {
    this.io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173', 'http://localhost:5500'],
      },
    });

    const screenInterval = await settingService.getInterval();
    this.intervalTime = screenInterval;

    this.startFlightUpdates();
    this.startScreenUpdates();

    setupAdminSocket(this.io, this.screens);
    setupScreenSocket(this.io, this.screens);
  },

  startFlightUpdates: function () {
    this.intervalId = setInterval(async () => {
      const res = await flightService.getUpcomingFlights();
      this.sendMessageToRoom(
        '/screen',
        'departure',
        'departure-flight',
        res.map((item) => snakeToCamel(item))
      );
      this.sendMessageToRoom('/screen', 'arrival', 'arrival-flight', {
        name: 'haha',
        value: 'arrival',
      });
    }, this.intervalTime);
  },

  startScreenUpdates: function () {
    setInterval(async () => {
      const screenStatus = Array.from(this.screens, ([id, { status }]) => ({
        id,
        status,
      }));
      this.io.of('/admin').emit('screen-status', screenStatus);

      console.log(screenStatus);
    }, 5000);
  },

  changeInterval: function (newInterval) {
    clearInterval(this.intervalId);
    this.intervalTime = newInterval;
    this.startFlightUpdates();
  },

  setScreenStatus: function (screenId, status) {
    if (this.screens.has(screenId)) {
      // Update the screen's status
      const screen = this.screens.get(screenId);
      screen.status = status;
      this.screens.set(screenId, screen); // Update the map with the new status
    } else {
      console.log(`Screen with ID ${screenId} does not exist.`);
    }
  },

  sendMessage: async function (clientName, topic, message) {
    try {
      const client = this.screens.get(clientName);
      if (!client) {
        return false;
      }
      const socket = client.socket;
      await socket.timeout(2000).emitWithAck(topic, message);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  sendMessageToRoom: async function (namespace, roomName, topic, message) {
    try {
      await this.io
        .of(namespace)
        .to(roomName)
        .timeout(2000)
        .emitWithAck(topic, message);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = SocketService;
