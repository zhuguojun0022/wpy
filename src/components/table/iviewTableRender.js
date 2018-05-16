function tagProcess (cfg) {
    if (cfg.tag === 'Tag') {
        if (!cfg.type) {
            cfg.type = 'border'
        } else if (cfg.type === 'fill') {
            delete cfg.type
        }
    }
}

export const TablePlugins = {
    install (Vue, opts) {
        Vue.prototype.getCellRender = (h, cfgs, type = 'Button') => {
            const comps = []
            cfgs.forEach(cfg => {
                cfg.size = cfg.size || 'small'
                cfg.color = cfg.color || 'green'
                cfg.disabled = cfg.disabled || false
                tagProcess(cfg)
                comps.push(h(cfg.tag || type, {
                    props: {...cfg},
                    on: cfg.on,
                    style: {...cfg.style},
                    'class': {...cfg.class}
                }, cfg.label, cfg.render))
            })
            return h('div', {
                style: {display: 'inline-block'}
            }, comps)
        }
    }
}