import ChannelConfig from '../pages/channel/channel-config/IndexPage'
import MerchantsConfig from '../pages/channel/merchants-config/IndexPage'
import ContractConfig from '../pages/channel/contract-config/IndexPage'

export default [{
    path: 'channel/config',
    name: 'channelConfig',
    meta: {
        menuCode: 'CHANNEL_CHANNEL_CONFIG'
    },
    component: ChannelConfig
}, {
    path: 'channel/merchants',
    name: 'merchantsConfig',
    meta: {
        menuCode: 'CHANNEL_MERCHANTS_CONFIG'
    },
    component: MerchantsConfig
}, {
    path: 'channel/contract',
    name: 'contractConfig',
    meta: {
        menuCode: 'CHANNEL_CONTRACT_CONFIG'
    },
    component: ContractConfig
}]