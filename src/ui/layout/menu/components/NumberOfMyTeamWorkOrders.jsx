import React from 'react';
import NumberBadge from './NumberBadge'; 
import useMyTeamWorkOrdersStore from '../../../../state/useMyTeamWorkOrdersStore';

const NumberOfMyTeamWorkOrders = () => {
  const { myTeamWorkOrders } = useMyTeamWorkOrdersStore();

  return <NumberBadge count={myTeamWorkOrders.length} />;
};

export default NumberOfMyTeamWorkOrders;
