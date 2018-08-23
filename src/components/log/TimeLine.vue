<template>
    <section class="timeline-com">
        <div v-for="(list, index) in logList" :key="index">
            <p class="tc-date">
                <Icon type="android-calendar" />&nbsp;&nbsp;{{ list.day }}
            </p>
            <ul>
                <li v-for="(item, index) in list.dailyLogs" :key="index" class="tc-item" :class="{'add-state': item.action === 1, 'delete-state': item.action === 2, 'update-state': item.action === 3, 'one-line': showway}">
                    <div class="m-x-l-2">
                        <div class="tc-item-top">
                            <span class="tc-avayar-time">{{ item.time }}</span>
                            <div class="avatar-box">
                                <Avatar v-bind:src="item.avatar" :icon="item.avatar ? '' : 'person'" size="small" />
                            </div>
                            <span class="tc-avayar-name">{{ item.createBy }}</span>
                            <description-com v-if="showway" class="tc-description" :str="item.desc"></description-com>
                        </div>
                        <div class="tc-item-down">
                            <description-com v-if="!showway" class="tc-description" :str="item.desc"></description-com>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import './descriptionCom'
export default {
    name: 'timeline-com',
    props: {
        logList: {
            type: Array,
            default: () => []
        },
        showway: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {}
    }
}
</script>
<style lang="less" scoped>
    .timeline-com {
        padding-left: 16px;
        .tc-date {
            font-size: 14px;
            color: #475669;
            letter-spacing: 0;
            padding-bottom: 10px;
            padding-top: 20px;
            margin-bottom: 20px;
            i {
                color: #D3DCE6;
                font-size: 16px;
            }
        }
        .add-state {
            &:before {
                border-color: #14CD66;
            }
        }
        .update-state {
            &:before {
                border-color: #0486F0;
            }
        }
        .delete-state {
            &:before {
                border-color: #FF4646;
            }
        }
        .tc-item {
            font-size: 12px;
            position: relative;
            border-left: 1px solid #dadce0;
            padding-bottom: 10px;
            &:last-child {
                border-left: none;
            }
            &:before {
                content: '';
                background: #ffffff;
                position: absolute;
                top: 0px;
                left: -6px;
                color: #fff;
                width: 12px;
                height: 12px;
                border-radius: 100%;
                text-align: center;
                line-height: 10px;
                font-weight: bold;
                font-size: 14px;
                border-width: 1px;
                border-style: solid;
            }

            >div {
                position: relative;
                top: -10px;

                .tc-item-down {
                    padding-left: 30px;
                }
                >div {
                    line-height: 2em;
                    .tc-avayar-time {
                        width: 90px;
                        display: inline-flex;
                        font-size: 12px;
                        color: #4A5769;
                        letter-spacing: 0;
                        padding: 0 10px 0 20px;
                    }
                    .avatar-box {
                        display: inline-flex;
                        height: 24px;
                        width: 24px;
                        border-radius: 50%;
                        margin-left: 20px;
                        img {
                            margin-bottom: 5px;
                        }
                        .tc-avatar {
                            margin: 3px;
                            display: inline-flex;
                            padding-left: 6px;
                        }
                    }

                    .tc-avayar-name {
                        display: inline;
                        font-size: 12px;
                        color: #4A5769;
                        letter-spacing: 0;
                        padding-left: 5px;
                        padding-right: 20px;
                    }
                    .tc-description {
                        padding-left: 20px;
                    }
                }
            }
            .add-state {
                &:before {
                    border-color: #14CD66;
                }
            }
            .update-state {
                &:before {
                    border-color: #0486F0;
                }
            }
            .delete-state {
                &:before {
                    border-color: #FF4646;
                }
            }
        }
        .one-line {
            min-height: 50px;
        }
    }
</style>