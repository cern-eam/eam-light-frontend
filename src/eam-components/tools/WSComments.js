import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSComments {
    readComments = (entityCode, entityKeyCode, config = {}) => 
        WS._get(`/comments?entityCode=${entityCode}&entityKeyCode=${entityKeyCode}`, config);

    createComment = (comment, config = {}) => WS._post('/comments/', comment, config);
    
    updateComment= (comment, config = {}) => WS._put('/comments/', comment, config);
}

export default new WSComments();