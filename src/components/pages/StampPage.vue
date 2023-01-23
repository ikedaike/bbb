<template>
    <div class="stamp">
        <!-- ダイアログ表示中は非表示 -->
        <div class="stamp-view" v-show="!isAttendanceDialogView || isLeavingDialogView">
            <div class="date">
                <p class="now-date">
                    {{ nowMonthDateDay }}
                </p>
                <p class="now-time">
                    {{ nowtime }}
                </p>
            </div>
            <!-- 出退勤ボタンをクリックしたら非活性にする -->
            <button @click="attendanceAtWork" :disabled="isAttendanceDisable">
                {{ attendanceMark }}
            </button>
            <br>
            <!-- attendanceHourMinuteに値があれば時刻を表示 -->
            <div v-show="!attendanceHourMinute">
                未
            </div>
            <div v-show="attendanceHourMinute">
                {{ attendanceHourMinute }}
                <!-- 取り消しボタン(bootstrap) -->
                <button type="button" class="btn btn-link" @click="cancelAttendanceAtWork">[取消]</button>
            </div>
            <button @click="leavingWork" :disabled="isLeavingDisable">{{ leavingMark }}</button>
            <div v-show="!leavingHourMinute">
                未
            </div>
            <br>
            <div v-show="leavingHourMinute">
                {{ leavingHourMinute }}
                <button type="button" class="btn btn-link" @click="cancelLeavingWork">[取消]</button>
            </div>
        </div>
        <!-- 打刻が押されたらダイアログを表示 -->
        <div class="dialog-view" v-show="isAttendanceDialogView">
            <!-- v-bindで値を子に渡し、カスタムイベントで子からの値を受け取る -->
            <!-- dataから動的に値を使う時はv-bind -->
            <StampDialog :work-status="attendanceMark" 
            :now-date="nowYearMonthDay" :now-hour="attendanceHour" :now-minute="attendanceMinute"
            @apply-for-attendance="ApplyForAttendance" @close-attendance-dialog="closeAttendanceDialog"></StampDialog>
        </div>
        <div class="dialog-view" v-show="isLeavingDialogView">
            <StampDialog :work-status="leavingMark"
            :now-date="nowYearMonthDay" :now-hour="leavingHour" :now-minute="leavingMinute"
             @apply-for-leaving="ApplyForLeaving" @close-leaving-dialog="closeLeavingDialog"></StampDialog>
        </div>
    </div>
</template>
    
<script>
/* ダイアログ表示用コンポーネント */
import StampDialog from '../dialog/StampDialog.vue';
import dayjs from 'dayjs';
/* 標準のdateインスタンスは使うのが面倒なのでdayjsを使用 */
import 'dayjs/locale/ja';
import axios from '../../baseurl/firestore'

export default{
    components: {
        StampDialog
    },
    data() {
        return{
            attendanceMark: "出勤",
            leavingMark: "退勤",
            /* ボタンを非活性にするかどうか */
            isAttendanceDisable: false,
            isLeavingDisable: false,
            /* ダイアログを表示するかどうか */
            isAttendanceDialogView: false,
            isLeavingDialogView: false,
            nowDate: "",
            nowYearMonthDay: "",
            nowMonthDateDay: "",
            nowtime:"",
            /* 多分いらない */
            attendanceHourMinute: "",
            attendanceHour: "",
            attendanceMinute: "",
            leavingHour: "",
            leavingMinute: "",
            leavingHourMinute:""
        }
    },
    mounted() {
        /* DOMが生成された段階で現在時刻を表示 */
        this.nowDate = this.fetchNowDate()
        this.nowYearMonthDay = this.makeYearMonthDayTemplate(this.nowDate)
        this.nowMonthDateDay = this.makeMonthDateDayTemplate(this.nowDate)
        this.nowtime = this.makeHourMinuteTemplate(this.nowDate)
    },
    computed: {
        idToken() {
            return this.$store.getters.idToken
        }
    },
    methods: {
        /* 時刻取得 */
        fetchNowDate(){
            /* 日本語変換 */
            dayjs.locale('ja');
            /* インスタンスを返却 */
            return dayjs()
        },
        /* 年月日フォーマット */
        makeYearMonthDayTemplate(){
          return this.nowDate.format('YYYY-MM-DD')
        },
        /* 月日フォーマット */
        makeHourMinuteTemplate(nowDate){
            return nowDate.format('HH:mm')
        },
        /* ○月○日(○)曜日フォーマット */
        makeMonthDateDayTemplate(nowDate){
            return nowDate.format('M月D日(ddd)')
        },
        attendanceAtWork(){
            /* 時刻の取得 */
            this.attendanceHour = this.fetchNowDate().format("HH")
            this.attendanceMinute = this.fetchNowDate().format("mm")
            /* 出勤ダイアログを表示 */
            this.isAttendanceDialogView = true
        },
        leavingWork(){
            this.leavingHour = this.fetchNowDate().format("HH")
            this.leavingMinute = this.fetchNowDate().format("mm")
            /* 退勤ダイアログを表示 */
            this.isLeavingDialogView = true
        },
        /* 取消が押下された場合 */
        cancelAttendanceAtWork(){
            this.attendanceMark = "出勤"
            this.isAttendanceDisable = false
            this.attendanceHourMinute = ""
        },
        cancelLeavingWork(){
            this.leavingMark = "退勤"
            this.isLeavingDisable = false
            this.leavingHourMinute = ""
        },
        /* ダイアログで出勤打刻が押下されたら実行 */
        ApplyForAttendance(applyNowDate, applyNowHour, applyNowMinute, applyPlace, applyReason){
            /* firebaseに値を登録する */
            this.registerApi(this.attendanceMark, applyNowDate, applyNowHour,
                             applyNowMinute, applyPlace, applyReason)
            /* 済を表示し、ボタンを非活性 */
            this.attendanceMark = "出勤済み"
            this.isAttendanceDisable = true
            /* 子で取得した値を代入 */
            this.attendanceHourMinute = applyNowHour + ":" + applyNowMinute
            /* ダイアログを閉じる */
            this.closeAttendanceDialog()
        },
        /* ダイアログで退勤打刻が押下されたら実行 */
        ApplyForLeaving(applyNowDate, applyNowHour, applyNowMinute, applyPlace, applyReason){
            /* firebaseに値を登録する */
            this.registerApi(this.leavingMark, applyNowDate, applyNowHour,
                             applyNowMinute, applyPlace, applyReason)
            /* 済を表示し、ボタンを非活性 */
            this.leavingMark = "退勤済み"
            this.isLeavingDisable = true
            /* 時刻を取得し、表示フォーマットを作成 */
            this.leavingHourMinute = applyNowHour + ":" + applyNowMinute
            /* ダイアログを閉じる */
            this.closeLeavingDialog()
        },
        /* 子からの値を受け取ったらダイアログが閉じる */
        closeAttendanceDialog(){
            this.isAttendanceDialogView = !this.isAttendanceDialogView
        },
        closeLeavingDialog(){
            this.isLeavingDialogView = !this.isLeavingDialogView
        },
        /* データをcloudfirestoreに送る
        出退勤区分(必須)
        出退勤時刻(必須)
        打刻場所(必須)
        申請理由(任意)
        */
       async registerApi(applyAttendanceMark, applyNowdate, applyNowHour,
       applyNowMinute, applyPlace, applyReason){
           /* 打刻申請が押された年月日を取得 */
           const justNowDate = this.makeYearMonthDayTemplate(this.fetchNowDate())
           /* ダイアログから打刻された日がその日のうちに打刻されてるか確認 */
           if (!applyNowdate == justNowDate){
                alert('1日以上経過しているため再度読み込みしてやり直してください')
                throw new Error('ダイアログを開いてから1日以上経過しています')
            }
           /* 打刻データをfirebaseへ登録 */
           /* データの送り方はfirestoreのルールに従っている */
           try{
               const response = await axios.post('/projects/vuejs-http-4ad1e/databases/(default)/documents/apply-stamp',
               {
                   fields: {
                    // 出退勤区分
                    workStatus: {
                    stringValue: applyAttendanceMark
                    },
                    // 出退勤年月日
                    applyForDate: {
                    stringValue: applyNowdate
                        },
                    // 出退勤hour
                    applyForHour: {
                    stringValue: applyNowHour
                        },
                    // 出退勤minute
                    applyForMinute: {
                    stringValue: applyNowMinute
                        },
                    // 打刻場所
                    applyPlace: {
                    stringValue: applyPlace
                        },
                    // 申請理由
                    applyReason: {
                    stringValue: applyReason
                        },
                   }
               },
               {
                /* idトークンを送る */
                headers: {
                    /* 書き方はfirebaseに従う */
                    Authorization: `Bearer ${this.idToken}`
                }
               });
               console.log(response)
           }catch(error){
            // デバッグ表示
            console.log(error)
            alert("申請に失敗しました")
           }
           },       
        }
    }
</script>
    
<style scoped>

</style>
    