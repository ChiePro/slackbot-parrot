//slack使えるようにする
const Slack     = require('slack');
const slack     = new Slack();
//オウム取得
var parrotArray = getParrots();
//星座定義
var astoArray = [
    'おひつじ座',
    'おうし座',
    'ふたご座',
    'かに座',
    'しし座',
    'おとめ座',
    'てんびん座',
    'さそり座',
    'いて座',
    'やぎ座',
    'みずがめ座',
    'うお座'
];
//最初のコメント
var announceComment = 'おはようございます！今日のラッキーオウムを発表しまーす！！\r\n';

//占い用のコメント
var uranaiComment = '--------------------------------\n\r';
for(var i = 0; i < 12; i++){
    var num = Math.floor(Math.random() * parrotArray.length);
    uranaiComment = uranaiComment + astoArray[i] + 'の今日のラッキーオウムは、' + checkComment(parrotArray[num]) + '\n\r';
}

uranaiComment = uranaiComment + '--------------------------------\n\r';

//〆のコメント
var lastComment = 'それでは今日も張り切っていきましょオウム！\n\r' 
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))]
+ parrotArray[Math.floor(Math.random() * (parrotArray.length ))];

//オウム投下
slack.chat.postMessage({
    token:        'xoxb-271269027749-378628507698-7iTEQK6JWYo8FWzo1YjlMPFT', // ※Bot token 
    channel:      'CB43901DX',
    text:         announceComment + uranaiComment + lastComment,
}).then(console.log).catch(console.error);

//ちょっとした遊び心
function checkComment(parrot){
    if(parrot == ':dad_parrot:')
    {
        return parrot + '(あーこれはひどいわ)';
    }
    else if(parrot == ':ultra_fast_parrot:')
    {
        return parrot + '<ｷﾀｰｰｰｰ!!ｷｮｳﾊﾂｲﾃﾙ!!';
    }
    else
    {
        return parrot;
    }
}

//意味ないけど関数化した
function getParrots(){
    var parrotArray = [
        ':angel_parrot:', 
        ':angry_parrot:', 
        ':aussie_parrot:', 
        ':aussieconga_parrot:', 
        ':aussiereverseconga_parrot:', 
        ':banana_parrot:', 
        ':beer_parrot:', 
        ':beret_parrot:', 
        ':birthdayparty_parrot:', 
        ':blondesassy_parrot:', 
        ':bluesclues_parrot:', 
        ':blunt_parrot:', 
        ':bored_parrot:', 
        ':bunny_parrot:', 
        ':ceiling_parrot:', 
        ':chill_parrot:', 
        ':christmas_parrot:', 
        ':coffee_parrot:', 
        ':confused_parrot:', 
        ':conga_parrot:', 
        ':conga_party_parrot:', 
        ':cop_parrot:', 
        ':crypto_parrot:', 
        ':dad_parrot:', 
        ':darkbeer_parrot:', 
        ':deal_withit_parrot:', 
        ':disco_parrot:', 
        ':donut_parrot:', 
        ':dreidel_parrot:', 
        ':evil_parrot:', 
        ':explody_parrot:', 
        ':fast_parrot:', 
        ':fidget_parrot:', 
        ':fiesta_parrot:', 
        ':flying_money_parrot:', 
        ':gentleman_parrot:', 
        ':goth_parrot:', 
        ':halal_parrot:', 
        ':hamburger_parrot:', 
        ':hard_hat_parrot:', 
        ':harrypotter_parrot:', 
        ':icecream_parrot:', 
        ':invisible_parrot:', 
        ':jedi_parrot:', 
        ':love_parrot:', 
        ':lucky_parrot:', 
        ':mardigras_parrot:', 
        ':margarita_parrot:', 
        ':matrix_parrot:', 
        ':middle_parrot:', 
        ':moonwalking_parrot:', 
        ':mustache_parrot:', 
        ':norwegianblue_parrot:', 
        ':oldtimey_parrot:', 
        ':papal_parrot:', 
        ':parrot:', 
        ':parrot_pizza:', 
        ':party_parrot:', 
        ':pirate_parrot:', 
        ':popcorn_parrot:', 
        ':portal_parrot:', 
        ':portalblue_parrot:', 
        ':portalorange_parrot:', 
        ':pride_parrot:', 
        ':pumpkin_parrot:', 
        ':reverseconga_parrot:', 
        ':revolution_parrot:', 
        ':right_parrot:', 
        ':rotating_parrot:', 
        ':ryangosling_parrot:', 
        ':sad_parrot:', 
        ':sassy_parrot:', 
        ':science_parrot:', 
        ':shipit_parrot:', 
        ':shuffle_parrot:', 
        ':shufflefurther_parrot:', 
        ':shuffleparty_parrot:', 
        ':sint_parrot:', 
        ':sith_parrot:', 
        ':ski_parrot:', 
        ':sleep_parrot:', 
        ':slomo_parrot:', 
        ':slow_parrot:', 
        ':sovjet_parrot:', 
        ':stable_parrot:', 
        ':stalker_parrot:', 
        ':sushi_parrot:', 
        ':taco_parrot:', 
        ':thumbsup_parrot:', 
        ':triplets_parrot:', 
        ':twins_parrot:', 
        ':ultra_fast_parrot:', 
        ':upvoteparty_parrot:', 
        ':wave1_parrot:', 
        ':wave2_parrot:', 
        ':wave3_parrot:', 
        ':wave4_parrot:', 
        ':wave5_parrot:', 
        ':wave6_parrot:', 
        ':wave7_parrot:', 
        ':wendy_parrot:',
        ];
        return parrotArray;
}

//念のためsleep用の関数作っておいた
function sleep(time){
    const d1 = new Date();
    while (true) {
        const d2 = new Date();
        if (d2 - d1 > time) {
            break;
        }
    }
}
