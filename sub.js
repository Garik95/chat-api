const redis = require("redis");

const subscriber = redis.createClient();

// console.log(subscriber);

subscriber.on("subscribe", function(channel, count) {
    console.log(channel, count);
//   publisher.publish("a channel", "a message");
//   publisher.publish("a channel", "another message");
});

subscriber.on("message", function (channel, message) {

    console.log("Subscriber received message in channel '" + channel + "': " + message);

    //   if (messageCount === 2) {
    //     subscriber.unsubscribe();
    //     subscriber.quit();
    //     publisher.quit();
    //   }
});

subscriber.subscribe("a channel #1");
subscriber.subscribe("a channel #2");