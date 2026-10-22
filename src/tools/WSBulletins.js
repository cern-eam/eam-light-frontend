import WS from './WS.js';

class WSBulletins {

    getUserBulletins(config = {}) {
        return WS._post('/proxy/userbulletins', config);
    }

    acknowledgeBulletin(bulletinCode, languageCode) {
        return WS._post(
            '/proxy/userbulletinacknowledgement',
            {
                "UserBulletin": {
                    "BULLETINCODE": bulletinCode,
                    "LANGUAGECODE": languageCode
                }
            }
        );
    }

    getBulletinHistory(config = {}) {
        return WS._get('/proxy/bulletinhistory', config);
    }

    getBulletinHistoryById(id, languageCode, config = {}) {
        return WS._get(`/proxy/bulletinhistory/${id}%23${languageCode}`);
    }
}

export default new WSBulletins();