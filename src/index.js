import Slack from 'slack';
import { BOT_TOKEN, CHANNEL } from './consts/slack';
import { getHoroscope } from './util/slack';

import Cronjob from './util/cronjob';

// Instances
const slack = new Slack();
const cronjob = new Cronjob();

// 占いの実行間隔の定義
var condition = '00 00 08 * * 0-6';

// オウム投下ジョブの設定
var routineJob = cronjob.job(post_parrot(), condition);

// オウム投下ジョブの開始
routineJob.start();

/*
*オウム投下関数
*/
function post_parrot()
{
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
}

