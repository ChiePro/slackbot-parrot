import { getRandomParrot, getLuckParrot } from './parrot';
import { ZODIAC_SIGN } from '../consts/constellation';

export const getHoroscope = () => {
  //最初のコメント
  let postMsg = 'おはようございます！今日のラッキーオウムを発表しまーす！！\r\n';

  //占い用のコメント
  postMsg += '--------------------------------\n\r';

  for (constellation of ZODIAC_SIGN) {
    postMsg += `${constellation} の今日のラッキーオウムは ${getLuckParrot(getRandomParrot())}\n\r`;
  }

  postMsg += '--------------------------------\n\r';

  //〆のコメント
  postMsg += 'それでは今日も張り切っていきましょオウム！\n\r';

  for (let i=0; i<ZODIAC_SIGN.length; i++) {
    postMsg += getRandomParrot();
  }

  postMsg += '\n\r';

  return postMsg;
};
