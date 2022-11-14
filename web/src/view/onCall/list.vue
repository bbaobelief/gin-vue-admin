<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <template #header>
            <el-divider>gin-vue-admin</el-divider>
          </template>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <FullCalendar :options="calendarOptions" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
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
</script>

<script>
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
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
            id: 11,
            title: '任务1',
            start: '2022-11-01',
            end: '2022-11-05',
            user: 'zhengfuqiang'
            // color: '#ffcc99',
            // editable: true, //允许拖动缩放，不写默认就是false
            // overlap: true, //允许时间重叠，即可以与其他事件并存，不写默认就是false
          },
          {
            groupId: 'blueEvents', // recurrent events in this group move together
            daysOfWeek: ['4'],
            startTime: '10:45:00',
            endTime: '12:45:00'
          },
          {
            groupId: 'group-id-1',
            daysOfWeek: ['3'], // these recurrent events move separately
            startTime: '10:00:00',
            endTime: '18:00:00',
            color: 'red'
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
        eventDidMount: this.handlEventDidMount
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
    // handleEventMouseEnter(info) {
    //   console.log(info, 'handleEventMouseEnter...');
    //   tippy(info.el, {
    //           content:"ksljd"
    //           // content: info.event.extendedProps.name,
    //           // placement: "top-start",
    //     // arrow: false,
    //     // 鼠标放在提示中提示不消失
    //     // interactive: true,
    //   });
    // },
    handleEventMouseEnter(info) {
      console.log(info)
      tippy(info.el, {
        content: "<div>" +
          "<div>值班名称：" + info.event.title + "</div>" +
          "<div>值班人员：" + info.event.extendedProps.user + "</div>" +
          "<div>开始时间：" + info.event.start + "</div>" +
          "<div>结束时间：" + info.event.end + "</div>" +
          "</div>",
        interactive: true,      // 可交互的
        placement: 'right-end', // 悬浮框位置
        allowHTML: true,        // 是否允许html文本
      })
    },
    handlEventDidMount(info) {
      const content = `
          <b> ${info.event.title} </b> <br/>
          <p>
            <b> Organisateur </b> ${info.event.extendedProps.organizer} </br>
            <b> Début </b> : ${info.event.extendedProps.begin_str}  </br>
            <b> Fin </b> : ${info.event.extendedProps.end_str} </br>
            <b> Lieu </b>: ${info.event.extendedProps.location}
          </p>
          <b> Participants </b>: ${info.event.extendedProps.attendees}
      `
      console.log(info.event);
      tippy(info.el, {
        placement: 'right-end', // 悬浮框位置
        content: content,
        allowHTML: true
      });
    }
  },
}
</script>
<style lang='css'>

</style>