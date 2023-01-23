<template>
    <div class="stamp-dialog">
        <!-- bootstrap使用 -->
        <div id="overlay">
            <div id="content">
              <h2>出退勤打刻申請</h2>
              <table>
                <tr>
                  <th>対象日：</th>
                  <td>{{ nowDate }}</td>
                </tr>
                <tr>
                  <th>出退勤区分：</th>
                  <td>{{ workStatus }}</td>
                </tr>
                <tr>
                  <th>時刻：</th>
                  <td>
                    <!-- nobrで改行させないようにしている -->
                  <nobr>
                    <!-- propsから受け取った時刻を初期値に選択肢で選択された値も反映できるように
                      双方向バインドしている -->
                      <input class="hour-minute" v-model="ApplyNowHour" type="text" list="hour" autocomplete="off">
                      <datalist id="hour">
                        <div v-for="hour in 24" :key="hour">
                          <option>{{ hour }}</option>
                        </div>
                      </datalist>
                      :
                      <input class="hour-minute" v-model="ApplyNowMinute" type="text" list="minute" autocomplete="off">
                      <datalist id="minute">
                        <div v-for="minute in 59" :key="minute">
                          <option>{{ minute }}</option>
                        </div>
                      </datalist>
                  </nobr>
                  </td>
                </tr>
                <tr>
                  <th>打刻場所：</th>
                  <td>
                    <!-- 選択肢とテキスト入力両方できるようにする -->
                  <input type="text" v-model="ApplyPlace" list="stamp-place" placeholder="選択してください" autocomplete="off">
                  <datalist id="stamp-place">
                    <option value="自宅"></option>
                    <option value="東京本社"></option>
                    <option value="大阪第第二分室"></option>
                  </datalist>
                </td>
              </tr>
              <tr>
                <th>申請理由：</th>
                <input type="text" v-model="ApplyReason" list="reason-for-application" placeholder="選択してください" autocomplete="off">
                <datalist id="reason-for-application">
                  <option value="打刻忘れのため"></option>
                </datalist>
                  <td>
                  </td>
                </tr>
              </table>
                  <button @click="ApplyForStamp(workStatus)" :disabled="isRequiredInput()">申請</button>
                  <button @click="closeDialog(workStatus)">閉じる</button>
            </div>
        </div>
    </div>
</template>
    
<script>
    export default{
      /* stampPage(親)から値を受け取る */
      props:{
        workStatus:{
          type: String
        },
        nowDate: {
        },
        nowHour: {
        },
        nowMinute:{
        },
      },
      data() {
        return{
          ApplyNowDate: "",
          /* propsで受け取った値をApplyNowHourに入れることでv-modelの使用を実現している
         ・選択肢での入力も値として反映させるため */
          ApplyNowHour: "",
          ApplyNowMinute: "",
          ApplyPlace: "",
          ApplyReason: "",
        }
      },
      // computed: {
      // ↓選択肢に打刻した時刻を表示したかったがうまくいかず、、
      //   /* 親コンポーネントから取得した値を表示させるのと、プルダウンから選択された値を入れる
      //   ためにget/setを使用している */
      //   updateNowHour: {
        //     get(){
          //       /* 親からの値を渡す */
          //       return this.nowHour
          //     },
          //     set(value){
            //       /* 親からの値またはプルダウンから選択された場合の値を代入する */
            //       this.ApplyNowHour = value
            //     }
            //   },
            //   updateNowMinute: {
              //     get(){
                //       /* 親からの値を渡す */
                //       return this.nowMinute
                //     },
                //     set(value){
                  //       /* 親からの値またはプルダウンから選択された場合の値を代入する */
                  //       this.ApplyNowMinute = value
                  //     }
                  //   }

      // },
      methods: {
        /* 時刻と退勤場所が入力されているか確認 */
        isRequiredInput(){
          let bool = true
          if(this.ApplyNowHour && this.ApplyNowMinute && this.ApplyPlace){
            bool = false
          }
          return  bool
        },
        /* 閉じるボタンが押下されたら、親の関数を実行する(ここで値を返す必要なないと考えたため) */
        /* 出勤時は出勤の処理、退勤時は退勤の処理を親に通達する */
        closeDialog(workStatus){
          if(workStatus == "出勤"){
            this.closeAttendanceDialog()
          }else if( workStatus == "退勤"){
            this.closeLeavingDialog()
          }else{
            console.log("error:出退勤区分が異常です")
          }
        },
        closeAttendanceDialog(){
          this.$emit('close-attendance-dialog')
        },
        closeLeavingDialog(){
          this.$emit('close-leaving-dialog')
        },
        /* 申請ボタンが押下されたら、親の関数を実行する */
        ApplyForStamp(workStatus){
          this.updateNowMinute
          if(workStatus == "出勤"){
            this.ApplyForAttendance()
          }else if( workStatus == "退勤"){
            this.ApplyForLeaving()
          }else{
            console.log("error:出退勤区分が異常です")
          }
        },
        ApplyForAttendance(){
          this.$emit('apply-for-attendance', this.nowDate, this.ApplyNowHour, this.ApplyNowMinute,
          this.ApplyPlace, this.ApplyReason)
        },
        ApplyForLeaving(){
          this.$emit('apply-for-leaving', this.nowDate, this.ApplyNowHour, this.ApplyNowMinute,
          this.ApplyPlace, this.ApplyReason)
        }
      }
    }
</script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 背景のグレーアウト */
#overlay{
  z-index:1;

  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;

}
/* ダイアログの設定 */
#content{
  z-index:2;
  width:50%;
  padding: 1em;
  background:#fff;
}
/* 時刻の選択肢は大きさを調節 */
.hour-minute{
 width: 50px;
}
</style>
    