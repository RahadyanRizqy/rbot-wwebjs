const bmhdb = {
  about: {
    0: {
      answer: "Akan segera offline 😴",
      info: "Offline"
    },
    1: {
      answer: "Sedang maintenance mohon bersabar 😗",
      info: "Maintenance"
    },
    2: {
      info: "Online"
    }
  },

  command: {
    else: {
      handler: "elseHandler",
      classType: 0,
      scopeType: 1
    },

    on: {
      handler: "onHandler",
      classType: 1,
      scopeType: 1
    },
    off: {
      handler: "offHandler",
      classType: 1,
      scopeType: 1
    },
    halt: {
      handler: "haltHandler",
      classType: 1,
      scopeType: 1
    },

    about: {
      handler: "aboutHandler",
      classType: 2,
      scopeType: 1
    },
    feature: {
      handler: "featureHandler",
      classType: 2,
      scopeType: 1
    },
    greet: {
      handler: "greetHandler",
      classType: 2,
      scopeType: 1
    },
    help: {
      handler: "helpHandler",
      classType: 2,
      scopeType: 1
    },
    // igdl: {
    //   handler: "igdlHandler",
    //   classType: 2,
    //   scopeType: 1
    // },
    sticker: {
      handler: "stickerHandler",
      classType: 2,
      scopeType: 1
    }
  },

  trivials: {
    hi: {
      answer: "Halo",
      classType: 2,
      scopeType: 1
    },
    halo: {
      answer: "Hi",
      classType: 2,
      scopeType: 1
    }
  },
  scope: {
    private: 1,
    group: 2
  }
}

module.exports = { bmhdb };