import TableHeader from './TableHeader'
import TableFooter from './TableFooter'
import Expand from './Expand'

import Vue from 'vue'
import {TablePlugins} from './iviewTableRender'

export {TableHeader, TableFooter, Expand}

Vue.use(TablePlugins)