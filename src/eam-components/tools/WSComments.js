import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSComments {

    //
    //COMMENTS
    //
    readComments(entityCode, entityKeyCode, config = {}) {
        entityKeyCode = encodeURIComponent(entityKeyCode);
        return WS._get(`/comments?entityCode=${entityCode}&entityKeyCode=${entityKeyCode}`, config);
    }

    createComment(comment, config = {}) {
        return WS._post('/comments/', comment, config);
    }

    updateComment(comment, config = {}) {
        return WS._put('/comments/', comment, config);
    }

}

export default new WSComments();