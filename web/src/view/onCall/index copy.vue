<template>

  <div>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card>
          <FullCalendar :options="calendarOptions" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 值班弹窗-Form -->
    <el-dialog v-model="dialogFormVisible" title="排班规则">
      <el-form :model="form" label-width="120px">

        <el-form-item label="值班名称">
          <el-col :span="14">
            <el-input v-model="form.lastName" placeholder="请输入值班名称" />
          </el-col>
        </el-form-item>

        <el-form-item label="值班分类">
          <el-select v-model="form.type1" placeholder="请选择分类">
            <el-option label="运维值班" value="sre" />
            <el-option label="zhixing研发" value="zhixing" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="分类颜色">
          <el-color-picker v-model="color" show-alpha :predefine="predefineColors" />
        </el-form-item> -->

        <el-form-item label="值班人员">
          <el-select v-model="form.region" placeholder="请选择值班人员">
            <el-option label="郑富强" value="zhengfuqiang" />
            <el-option label="白少凯" value="baishaokai" />
          </el-select>
        </el-form-item>

        <el-form-item label="全天">
          <el-switch v-model="form.allDay" />
        </el-form-item>

        <el-form-item label="开始时间">
          <el-col :span="6">
            <el-date-picker v-model="form.date1" type="date" placeholder="开始日期" />
          </el-col>
          <el-col :span="2" class="text-center" v-if="form.allDay">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="6" v-if="form.allDay">
            <el-time-select v-model="form.startTime" start="00:00" step="00:60" end="24:00" placeholder="开始时间" />
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-col :span="6">
            <el-date-picker v-model="form.date2" type="date" placeholder="结束日期" />
          </el-col>
          <el-col :span="2" class="text-center" v-if="form.allDay">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="6" v-if="form.allDay">
            <el-time-select v-model="form.endTime" start="00:00" step="00:60" end="24:00" placeholder="结束时间" />
          </el-col>
        </el-form-item>

        <!-- <el-form-item label="重复类型">
          <el-select v-model="form.freq" placeholder="自定义周期">
            <el-option label="天" value="天" />
            <el-option label="周" value="周" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="重复">
          <el-switch v-model="form.freqVisible" />
        </el-form-item>
        <div v-if="form.freqVisible">
          <el-form-item label="重复频率">
            <el-radio-group v-model="form.freq">
              <el-radio label="天" />
              <el-radio label="周" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="按工作日">
            <el-checkbox-group v-model="form.byweekday">
              <el-checkbox label="周一" name="byweekday" />
              <el-checkbox label="周二" name="byweekday" />
              <el-checkbox label="周三" name="byweekday" />
              <el-checkbox label="周四" name="byweekday" />
              <el-checkbox label="周五" name="byweekday" />
              <el-checkbox label="周六" name="byweekday" />
              <el-checkbox label="周日" name="byweekday" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="重复间隔">
            <el-input-number v-model="num" :min="1" :max="10" controls-position="right" @change="handleChange" />
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

const dialogFormVisible = ref(false)
const formFreqVisible = ref(false)
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

const form = reactive({
  name: '',
  region: '',
  freq: '天',
  date1: '',
  date2: '',
  repeat: false,
  type: [],
  resource: '',
  desc: '',
  freqVisible: false,
  startTime: '',
  endTime: ''
})

// 提交
const enterDialog = () => {
  dialogFormVisible = false
  console.log('submit!')
  // form.value.authorityId = Number(form.value.authorityId)
  // if (form.value.authorityId === 0) {
  //   ElMessage({
  //     type: 'error',
  //     message: '角色id不能为0'
  //   })
  //   return false
}
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

export default {
  name: 'onCall',
  components: {
    FullCalendar
  },
  data() {
    return {
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
            start: '2022-11-01',
            end: '2022-11-05',
            user: '郑富强',
            // color: '#ffcc99',
            // editable: true, //允许拖动缩放，不写默认就是false
            // overlap: true, //允许时间重叠，即可以与其他事件并存，不写默认就是false
          },
          {
            id: 12,
            title: '运维值班-早班',
            groupId: 'blueEvents', // recurrent events in this group move together
            daysOfWeek: ['4'],
            startTime: '00:00:00',
            endTime: '12:00:00',
            user: '白少凯'
          },
          {
            id: 13,
            title: '运维值班-晚班',
            groupId: 'blueEvents', // recurrent events in this group move together
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
      let title = prompt('Please enter a new title for your event')
      let calendarApi = info.view.calendar
      calendarApi.unselect() // clear date selection
      if (title) {
        calendarApi.addEvent({
          id: 111,
          title,
          start: info.startStr,
          end: info.endStr,
          allDay: info.allDay
        })
      }
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
/* .input_number_span {
  margin-left: 20px;
} */
</style>