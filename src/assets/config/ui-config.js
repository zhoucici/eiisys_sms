//饿了吗按需引入

import Vue from 'vue';
import './element-ui/index.css';
import {
    Message,
    // Tooltip,
    Input,
    Select,
    Option,
    Pagination,
    Row,
    Col,
    // Progress,
    // Checkbox,
    // CheckboxGroup,
    DatePicker,
    // TimePicker,
    // Switch,
    // Loading,
    Radio,
    RadioGroup,
    RadioButton,
    Image,
    // RadioButton,
    Table,
    TableColumn,
    // Cascader,
    // Carousel,
    // CarouselItem,
    Popover,
    // TabPane,
    // ColorPicker,
    Dialog,
    CollapseTransition,
    Tabs,
    Tag,
    TabPane
} from 'element-ui'
Vue.prototype.$message = Message;
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Radio)
Vue.use(Pagination)
Vue.use(Image)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(RadioGroup)
Vue.use(RadioButton)
// Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Tag)