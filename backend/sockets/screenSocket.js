const screenService = require('../services/screenService');

exports.setupScreenSocket = (io, screens) => {
  io.of('/screen').on('connection', (socket) => {
    let screenName;

    socket.on('register', async (screen, callback) => {
      console.log(`${screen} connected`);
      screenName = screen;
      screens.set(screen, { socket: socket, status: 1 });
      const area = await screenService.getAreaById(screen);
      socket.join(area.area);
      callback(area);
    });

    socket.on('on-off', async (status, callback) => {
      console.log('Receive:', status);
      const prev = screens.get(screenName);
      screens.set(screenName, { ...prev, status: status });
      callback('ok');
    });

    socket.on('disconnect', () => {
      screens.delete(screenName);
      console.log('Client disconnected');
    });
  });
};
