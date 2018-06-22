import Cron from 'cron';

const cron = new Cron();

var cronJob = cron.CronJob;

export function job (func, conditions){
    return new cronJob({
        // 実行間隔の設定
        cronTime: conditions,
       
        //指定時に実行したい関数
        onTick: function() {
            func();
        },
       
        // コンストラクタを終する前にジョブを開始するかどうか
        start: false,
         
        //タイムゾーン
        timeZone: "Japan/Tokyo"
      });
}; 
