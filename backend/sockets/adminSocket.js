exports.setupAdminSocket = (io, screens) => {
  io.of('/admin').on('connection', (socket) => {
    console.log('Admin connected');

    socket.emit(
      'screen-status',
      Array.from(screens, ([id, { status }]) => ({ id, status }))
    );

    socket.on('disconnect', () => {
      console.log('Admin disconnected');
    });
  });
};
