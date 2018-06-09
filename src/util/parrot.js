import { PARROTS } from '../consts/parrot';

export const getRandomParrot = () => {
  return PARROTS[Math.floor(Math.random() * (parrots.length))]
};

export const getLuckParrot = (parrot) => {
  switch (parrot) {
    case ':dad_parrot:':
      return `${parrot}あーこれはひどいわ`;

    case ':ultra_fast_parrot:':
      return `${parrot}<ｷﾀｰｰｰｰ!! ｷｮｳﾊﾂｲﾃﾙ!!`;

    default:
      return parrot;
  }
};
