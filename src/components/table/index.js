import TableBar from './TableBar'
import TableFooter from './TableFooter'
import BaseTable from './BaseTable'

import Vue from 'vue'
import {TablePlugins} from './iviewTableRender'

export {TableBar, TableFooter, BaseTable}

Vue.use(TablePlugins)