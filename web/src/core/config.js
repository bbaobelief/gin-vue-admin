/**
 * 网站配置文件
 */

const config = {
  appName: 'onCall',
  appLogo: 'https://www.gin-vue-admin.com/img/logo.png',
  showViteLogo: true
}

export const viteLogo = (env) => {
  if (config.showViteLogo) {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用onCall`
      )
    )
    console.log(
      chalk.green(
        `> 当前版本:v2.5.4`
      )
    )
    console.log('\n')
  }
}

export default config
