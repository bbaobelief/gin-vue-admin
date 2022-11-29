<template>
  <div>
    <warning-bar title="值班人员必须保证可以及时查看报警、响应紧急事件，目标是保障线上服务稳定。" />
    <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  </div>
</template>

<script setup>
import WarningBar from '@/components/warningBar/warningBar.vue'
// import { RRule } from 'rrule'

// // Create a rule:
// const rule = new RRule({
//   freq: RRule.WEEKLY,
//   interval: 5,
//   byweekday: [RRule.MO, RRule.FR],
//   dtstart: new Date(2022,11,23,11,24,00),
//   until: new Date(2022,11,25,11,24,00)
//   // dtstart: datetime(2012, 2, 1, 10, 30),
//   // until: datetime(2012, 12, 31)
// })

// Get all occurrence dates (Date instances):
// rule.all()

// console.log(rule.all())

const tableData = [
  {
    date: '运维值班',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: 'DBA值班',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: 'zhixing研发值班',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: 'ami研发值班',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>