<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div>On Call Now</div>
          </template>
          xxx
        </el-card>
        <el-card>
          <template #header>
            <div>Show on calendar</div>
          </template>
          xxx
        </el-card>
        <el-card>
          <template #header>
            <div>值班职责</div>
          </template>
          <div>
            <el-row>
              <el-col>
                xxx
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-card>
          <FullCalendar :options="calendarOptions" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 值班弹窗-Form -->
    <el-dialog v-model="dialogFormVisible" title="排班规则">
      <el-form :model="eventForm" label-width="120px">
        <el-form-item label="人员" prop="userName">
          <el-cascader v-model="eventForm.users" style="width:80%" :options="userOptions" :show-all-levels="false"
            :props="{ multiple: true, checkStrictly: true, label: 'nickName', value: 'userName', disabled: 'disabled', emitPath: false }"
            :clearable="false" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="eventForm.role" placeholder="请选择" class="select-role">
            <el-option label="早班" value="sre" />
            <el-option label="晚班" value="zhixing" />
          </el-select>
        </el-form-item>
        <!-- <el-button icon="plus" @click="addGroup" style="margin-left: 10px;" circle /> -->
        <el-form-item label="全天">
          <el-switch v-model="eventForm.allDay" />
        </el-form-item>
        <el-form-item label="开始">
          <el-col :span="6">
            <el-date-picker v-model="eventForm.startDate" type="date" placeholder="开始日期" />
          </el-col>
          <el-col :span="1" class="text-center" v-if="!eventForm.allDay">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="5" v-if="!eventForm.allDay">
            <el-time-select v-model="eventForm.startTime" start="00:00" step="00:60" end="24:00" placeholder="时间" />
          </el-col>
        </el-form-item>
        <el-form-item label="结束">
          <el-col :span="6">
            <el-date-picker v-model="eventForm.endDate" type="date" placeholder="结束日期" />
          </el-col>
          <el-col :span="1" class="text-center" v-if="!eventForm.allDay">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="5" v-if="!eventForm.allDay">
            <el-time-select v-model="eventForm.endTime" start="00:00" step="00:60" end="24:00" placeholder="时间" />
          </el-col>
        </el-form-item>
        <el-form-item label="重复">
          <el-switch v-model="eventForm.repeatVisible" />
        </el-form-item>
        <div v-if="eventForm.repeatVisible">
          <el-form-item label="重复频率">
            <el-col :span="1" class="text-center">
              <span class="text-gray-500">每</span>
            </el-col>
            <el-col :span="4" class="text-center">
              <el-input-number class="number-interval" v-model="eventForm.interval" :min="1" :max="1000"
                controls-position="right" />
            </el-col>
            <el-col :span="2" class="text-center">
              <el-select v-model="eventForm.freq" class="select-freq" @change="selectFreq">
                <el-option label="天" value="RRule.DAILY" />
                <el-option label="周" value="RRule.WEEKLY" />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="按工作日" v-if="eventForm.freqVisible">
            <el-checkbox-group v-model="eventForm.byweekday">
              <el-checkbox label="周一" name="RRule.MO" />
              <el-checkbox label="周二" name="RRule.TU" />
              <el-checkbox label="周三" name="RRule.WE" />
              <el-checkbox label="周四" name="RRule.TH" />
              <el-checkbox label="周五" name="RRule.FR" />
              <el-checkbox label="周六" name="RRule.SA" />
              <el-checkbox label="周日" name="RRule.SU" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="结束重复">
            <el-col :span="6" class="text-center">
              <el-select v-model="eventForm.endRepeat" placeholder="请选择" @change="selectEndRecur">
                <el-option label="无限重复" value='0' />
                <el-option label="限制次数" value='1' />
                <el-option label="终止于某天" value='2' />
              </el-select>
            </el-col>
            <el-col :span="4" class="text-center" v-if="eventForm.countVisible">
              <el-input-number class="number-interval" v-model="eventForm.count" :min="1" :max="1000"
                controls-position="right" />
            </el-col>
            <el-col :span="2" class="text-center" v-if="eventForm.countVisible">
              <span class="text-gray-500">次后</span>
            </el-col>
            <el-col :span="6" v-if="eventForm.endRecurVisible">
              <el-date-picker v-model="eventForm.endRecur" type="date" placeholder="结束日期" style="margin-left: 5px;" />
            </el-col>
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getUserList } from '@/api/user'
// import { getAuthorityList } from '@/api/user'
// import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'
// const rule = new RRule({
//   freq: RRule.WEEKLY,
//   interval: 5,
//   byweekday: [RRule.MO, RRule.FR],
//   dtstart: datetime(2022, 11, 24, 10, 30),
//   until: datetime(2022, 11, 30)
// })

// // Get all occurrence dates (Date instances):
// console.log(rule.all())

// const formFreqVisible = ref(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const num = ref(1)
const handleChange = (value) => {
  console.log(value)
}

const handleRepeatChange = (value) => {
  dialogFormFreqVisible = true
}

const addGroup = (value) => {
  console.log(value)
}

const value = ref([])
const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}))

// const form = reactive({
//   name: '',
//   users: ['zhengfuqiang', 'baishaokai', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
//   freq: '天',
//   date1: '',
//   date2: '',
//   repeat: false,
//   allDay: true,
//   type: [],
//   resource: '',
//   desc: '',
//   startTime: '',
//   endTime: '',
//   freqVisible: false,
//   repeatVisible: false,
//   countVisible: false, // 是否显示-限制次数
//   endRepeat: '0', // 结束重复
//   endRecur: '', // 结束重复日期
//   count: '1', // 重复次数
// })

const onCall_notice = `<p style="margin:0;"><span style="color: rgb(221, 64, 50);">值班人员必须保证可以及时查看报警、响应紧急事件，目标是保障线上服务稳定。</span></p><p style="margin:0;"><br /></p><p style="margin:0;">值班内容如下：</p><p style="margin:0;"><br /></p><p style="margin:0;">1.每天值班开始，优先检查报警并联系相关人处理。</p><p style="margin:0;"><br /></p><p style="margin:0;">2.值班期间关注各技术大群里反馈的线上技术问题。</p><p style="margin:0;"><br /></p><p style="margin:0;">备注 值班班次说明</p><p style="margin:0;"><br /></p><p style="margin:0;">早班 工作日 早7:00-9:30 周末和节假日 早7:00-15:30</p><p style="margin:0;"><br /></p><p style="margin:0;">晚班 工作日 晚19:00-24:00 周末和节假日 下午15:30-24:00</p>`

// 提交
const enterDialog = () => {
  // dialogFormVisible = false
  console.log('submit!')
  // form.value.authorityId = Number(form.value.authorityId)
  // if (form.value.authorityId === 0) {
  //   ElMessage({
  //     type: 'error',
  //     message: '角色id不能为0'
  //   })
  //   return false
}

const tableData = [
  {
    group: '运维值班1',
    name: 'Tom',
    phone: '18611111111',
  },
  {
    group: '运维值班2',
    name: 'zhengfuqiang',
    phone: '18611111111',
  },
  {
    group: 'ami研发值班',
    name: 'tangliang',
    phone: '18611111111',
  },
  {
    group: 'zhixing运维值班',
    name: 'zhixing',
    phone: '18611111111',
  },
  {
    group: 'inf运维值班',
    name: 'baishaokai',
    phone: '18611111111',
  },
]

// 弹窗表单
const eventForm = reactive({
  users: '',
  role: '',
  allDay: true,
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  interval: 1,
  freq: 'RRule.DAILY',
  byweekday: [],
  endRepeat: '0',          // 结束重复
  endRecur: '',            // 结束重复日期
  count: 1,                // 重复次数
  freqVisible: false,      // 显示-周期
  countVisible: false,     // 显示-限制次数
  repeatVisible: false,    // 显示-重复
  endRecurVisible: false,  // 显示-结束重复日期
})

// 重复周期
const selectFreq = (value) => {
  console.log(1111, value)
  if (value === 'RRule.WEEKLY') {
    eventForm.freqVisible = true
  } else {
    eventForm.freqVisible = false
  }
  eventForm.freqVisible = true
  console.log(eventForm)
}

// 结束重复
const selectEndRecur = (value) => {
  eventForm.countVisible = false
  eventForm.endRecurVisible = false
  if (value === '1') {
    eventForm.countVisible = true
  } else if (value === '2') {
    eventForm.endRecurVisible = true
  }
}

// 用户-初始化相关
const setUserOptions = (userData, optionsData) => {
  userData &&
    userData.forEach(item => {
      const option = {
        userName: item.userName,
        nickName: item.nickName
      }
      optionsData.push(option)
    })
}

const userOptions = ref([])
const setOptions = (userData) => {
  userOptions.value = []
  setUserOptions(userData, userOptions.value)
}

const initPage = async () => {
  // getTableData()
  const res = await getUserList({ page: 1, pageSize: 999 })
  setOptions(res.data.list)
}

initPage()
</script>

<script>
import tippy from "tippy.js"
import 'tippy.js/dist/tippy.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import { formatDateTime } from '@/utils/format'
import { RRule, RRuleSet, rrulestr } from 'rrule'

export default {
  name: 'onCall',
  components: {
    FullCalendar
  },
  data() {
    return {
      dialogFormVisible: false,
      calendarOptions: {
        plugins: [
          rrulePlugin,
          listPlugin,
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
        ],
        customButtons: {
          onCallAddButton: {
            text: '添加',
            click: this.handleAddOnCall
          }
        },
        headerToolbar: {
          left: 'prev,next today onCallAddButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        themeSystem: 'bootstrap5',
        locale: zhCnLocale,
        timeZone: 'local',
        initialView: 'dayGridMonth',  // 初始化插件显示
        firstDay: '1',                // 设置一周中显示的第一天是周几，周日是0，周一是1，以此类推
        weekNumberCalculation: 'ISO', // 与firstDay配套使用
        handleWindowResize: true,     // 随浏览器窗口变化 
        droppable: true,              // 是否可拖动
        editable: true,               // 确定是否可以修改日历上的事件。
        selectable: true,             // 允许用户通过单击和拖动来突出显示多天或多个时隙。
        selectMirror: true,           // 用户拖动时是否绘制“占位符”事件。
        dayMaxEvents: true,           // 给定日期内的最大活动数，不包括+ more链接。其余的将显示在弹出窗口中。如果true已指定，则事件数将限制为日单元格的高度。
        weekends: true,               // 是否显示周末，设为false则不显示周六和周日。默认值为true
        navLinks: true,               // 点击日期跳转
        // weekNumbers: true,         // 是否显示周数
        // https://fullcalendar.io/docs/event-object
        // resources: 'https://fullcalendar.io/api/demo-feeds/resources.json?with-nesting&with-colors',
        // events: 'https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline',
        events: [
          {
            id: 10,
            title: 'zhixing项目值班',
            start: '2022-11-11',
            end: '2022-11-13',
            user: '郑富强',
            // color: '#ffcc99',
            // editable: true, //允许拖动缩放，不写默认就是false
            // overlap: true, //允许时间重叠，即可以与其他事件并存，不写默认就是false
          },
          {
            id: 12,
            title: '运维值班-早班',
            groupId: 'blueEvents1', // recurrent events in this group move together
            daysOfWeek: ['4'],
            startTime: '00:00:00',
            endTime: '12:00:00',
            user: '白少凯'
          },
          {
            id: 13,
            title: '运维值班-晚班',
            groupId: 'blueEvents2', // recurrent events in this group move together
            daysOfWeek: ['4'],
            startTime: '12:00:00',
            endTime: '23:59:00',
            user: 'baishaokai'
          },
          {
            groupId: 'group-id-1',
            daysOfWeek: ['3'], // these recurrent events move separately
            startTime: '10:00:00',
            endTime: '18:00:00',
            color: 'red'
          },
          {
            daysOfWeek: ["1"],
            startTime: "11:00:00",
            endTime: "11:30:00",
            color: "red",
            title: "每周一重复(拖动试试)",
          },
          {
            groupId: "2021112008",
            daysOfWeek: ["1"],
            startTime: "11:00:00",
            endTime: "11:30:00",
            color: "yellow",
            title: "每周一重复(拖动试试)",
          },
          {
            groupId: "20211112009",
            daysOfWeek: ["2"],
            startTime: "11:00:00",
            endTime: "11:30:00",
            color: "red",
            title: "每周二重复(在限定时间里))",
            startRecur: "2022-11-08",
            endRecur: "2022-11-17",
          },
          {
            groupId: "20211112010",
            daysOfWeek: ["2"],
            // startTime: "11:00:00",
            // endTime: "11:30:00",
            color: "red",
            allDay: true,
            title: "每周二重复(全天)",
            startRecur: "2022-11-08",
            endRecur: "2022-11-17",
          },

          // {
          //   title: 'rrule event',
          //   // groupId: 'Events-123',
          //   rrule: {
          //     freq: 'daily',
          //     interval: 1,
          //     count: 3,
          //     // byweekday: ['zh-cn'],
          //     dtstart: '2022-11-11', // will also accept '20120201T103000'
          //     until: '2022-11-16' // will also accept '20120201'
          //   }
          // },
          // {
          //     id: 12,
          //     title: '任务2',
          //     start: '2022-11-07',
          //     end: '2022-11-15',
          //     color: '#970707',
          // },
          // {
          //     title: 'Meeting',
          //     start: '2022-11-07T14:30:00',
          //     extendedProps: {
          //         status: 'done'
          //     }
          // },
          // {
          //     title: 'Birthday Party',
          //     start: '2022-11-13T07:00:00',
          //     backgroundColor: 'green',
          //     borderColor: 'green'
          // },
        ],
        select: this.handleDateSelect,
        eventsSet: this.handleEvents,
        eventClick: this.handleEventClick,
        eventMouseEnter: this.handleEventMouseEnter,
      }
    }
  },
  methods: {
    // 监听事件变化
    handleEvents(events) {
      console.log(events, 'eventsSet...');
    },
    handleEventClick(info) {
      if (confirm(`请确认删除事件： '${info.event.title}'`)) {
        info.event.remove()
      }
    },
    //点击日期
    handleDateSelect(info) {
      // let title = prompt('Please enter a new title for your event')
      let title = "123"
      let calendarApi = info.view.calendar
      calendarApi.unselect() // clear date selection

      const rule = new RRule({
        freq: RRule.DAILY,
        interval: 1,
        // byweekday: [RRule.MO, RRule.FR],
        dtstart: info.start,
        until: info.end
      })

      // Get all occurrence dates (Date instances):

      console.log(1111, info)
      console.log(2222, rule.all())
      // if (title) {
      //   calendarApi.addEvent({
      //     id: 111,
      //     title,
      //     start: info.startStr,
      //     end: info.endStr,
      //     allDay: info.allDay
      //   })
      // }
      // this.dialogFormVisible = true
      console.log(this.dialogFormVisible)
    },
    // 鼠标悬浮
    handleEventMouseEnter(info) {
      const content = `
        <b> ${info.event.title} </b> <br>
        <p>
          <b> 值班人员 </b>: ${info.event.extendedProps.user} <br>
          <b> 开始时间 </b>: ${formatDateTime(info.event.start, 'yyyy-MM-dd hh:mm')} <br>
          <b> 结束时间 </b>: ${formatDateTime(info.event.end, 'yyyy-MM-dd hh:mm')}
        </p>`
      console.log(info.event);
      tippy(info.el, {
        content: content,
        interactive: true,      // 可交互的
        placement: 'right-end', // 悬浮框位置
        allowHTML: true         // 是否允许html文本
      });
    },
    // 自定义-添加值班
    handleAddOnCall: function () {
      // if (!window.confirm('これで保存しますか?')) {
      //   return
      // }
      // // 編集済みの Events 一覧を取得できる。
      // const calendarApi = this.$refs.fullCalendar.getApi()
      // const objects = calendarApi.getEvents().map(function (event) {
      //   const { id, startStr, endStr } = event
      //   return {
      //     id, startStr, endStr
      //   }
      // })
      // console.table(objects)
      // alert('点击了自定义按钮!');
      this.dialogFormVisible = true
    },
  },
}
</script>
<style lang='css'>
.el-card.is-always-shadow {
  margin-bottom: 10px;
}

.el-input__wrapper {
  height: 37px;
}

.el-date-editor.el-input {
  width: 130px;
}

.select-role {
  width: 90px;
}

.select-freq {
  width: 60px;
}

.number-interval {
  width: 80px;
}

.el-checkbox {
  margin-right: 10px;
}
</style>