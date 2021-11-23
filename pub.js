const redis = require("redis");

const publisher = redis.createClient();
var i = 0;

setInterval(()=> {
    publisher.publish("a channel #1", "a message " + i);
    i ++;
}, 3000)


// let messageCount = 0;

// subscriber.on("subscribe", function(channel, count) {
//   publisher.publish("a channel", "a message");
//   publisher.publish("a channel", "another message");
// });

// subscriber.on("message", function(channel, message) {
//   messageCount += 1;

//   console.log("Subscriber received message in channel '" + channel + "': " + message);

//   if (messageCount === 2) {
//     subscriber.unsubscribe();
//     subscriber.quit();
//     publisher.quit();
//   }
// });

// subscriber.subscribe("a channel");