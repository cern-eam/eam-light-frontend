import WS from '../../../tools/WS'

class MenuTools {
    refreshCache(showNotificatoin, showError) {
        WS.refreshCache().then(response => {
            showNotificatoin(response.body.data)
        }).catch(error => {
            showError('EAM Light Cache Refresh has failed.')
        })
    }
}

export default new MenuTools();