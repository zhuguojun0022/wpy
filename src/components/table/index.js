import TableHeader from './TableHeader'
import TableFooter from './TableFooter'
import TableSwitch from './TableSwitch'

import Vue from 'vue'
import {TablePlugins} from './iviewTableRender'

export {TableHeader, TableFooter, TableSwitch}

Vue.use(TablePlugins)