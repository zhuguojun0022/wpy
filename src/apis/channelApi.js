import http from '../config/httpConfig'

const searchChannelList = () => http.get('/channel/channellist', {mock: true})

export default {
    searchChannelList
}