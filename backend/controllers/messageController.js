const socket = require('../config/socket');

const messageController = {
  sendMessage: async (req, res) => {
    const { screens, block } = req.body;
    try {
      const promises = screens.map(async (screen) => {
        const acknowledge = await socket.sendMessage(
          screen,
          'live-message',
          block
        );
        return acknowledge;
      });

      const isSuccessful = await Promise.all(promises);

      const screensSend = isSuccessful.reduce(
        (acc, item, index) => {
          if (item) {
            acc.ok.push(`Screen ${screens[index]}`);
          } else {
            acc.fail.push(`Screen ${screens[index]}`);
          }
          return acc;
        },
        { ok: [], fail: [] }
      );

      const responseMessage = {
        ok:
          screensSend.ok.length === 0
            ? ''
            : `Information sent to ${screensSend.ok.join(', ')} successfully`,
        fail:
          screensSend.fail.length === 0
            ? ''
            : `${screensSend.fail.join(
                ', '
              )} is out of order or the internet connection is unstable`,
      };

      res.status(200).json({ message: responseMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = messageController;
