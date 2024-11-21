import React from 'react';
import NumberBadge from './NumberBadge'; 
import useMyOpenWorkOrdersStore from '../../../../state/myOpenWorkOrdersStore';

const NumberOfMyOpenWorkOrders = () => {
  const { myOpenWorkOrders } = useMyOpenWorkOrdersStore();

  return <NumberBadge count={myOpenWorkOrders.length} />;
};

export default NumberOfMyOpenWorkOrders;