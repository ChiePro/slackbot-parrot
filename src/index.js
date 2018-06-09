import Slack from 'slack';
import { BOT_TOKEN, CHANNEL } from './consts/slack';
import { getHoroscope } from './util/slack';

// Instances
const slack = new Slack();

//オウム投下
slack.chat.postMessage({
    token:        BOT_TOKEN, // ※Bot token
    channel:      CHANNEL.PARROT_BOT,
    text:         getHoroscope(),
})
.then(console.log('Message posted'))
.catch(err => {
  console.log(err.error);
});
