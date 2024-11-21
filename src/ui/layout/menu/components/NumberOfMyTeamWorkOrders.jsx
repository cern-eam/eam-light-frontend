import React from 'react';
import NumberBadge from './NumberBadge'; 
import useMyTeamWorkOrdersStore from '../../../../state/myTeamWorkOrdersStore';

const NumberOfMyTeamWorkOrders = () => {
  const { myTeamWorkOrders } = useMyTeamWorkOrdersStore();

  return <NumberBadge count={myTeamWorkOrders.length} />;
};

export default NumberOfMyTeamWorkOrders;
