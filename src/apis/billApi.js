import http from '../config/httpConfig'

const searchBillList = (pageSize, currentPage, merchantName, channelId, recordStatus, startTime, finishTime, createTime) => http.post('/bill', {pageSize, currentPage, merchantName, channelId, recordStatus, startTime, finishTime, createTime}, {mock: false})

const searchTypeList = () => http.get('/bill/channel', {mock: false})

const searchBillRecordList = (pageSize, currentPage, status) => http.post('/bill/detail', {pageSize, currentPage, status}, {mock: false})

const updateErrorHandle = (tradeId, recordId, errHandle) => http.post('/bill/errHandle', {tradeId, recordId, errHandle}, {mock: false})

export default {
    searchBillList,
    searchBillRecordList,
    searchTypeList,
    updateErrorHandle
}