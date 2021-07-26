import React from 'react';
import EquipmentTree from '../../pages/equipment/components/tree/EquipmentTree';
/**
 * To get the value of a parameter from the URL
 * @param name (Key) of the parameter
 * @returns {string} The value of the parameter,or an empty string
 */
const getURLParameterByName = (name) => {
    const url = window.location.href;
    name = name.replace(/[[]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const EqpTree = (props) => {
    const eqpCode = getURLParameterByName('eqpCode');
    return <EquipmentTree equipmentCode={eqpCode} hideHeader={true} />;
};

export default EqpTree;
