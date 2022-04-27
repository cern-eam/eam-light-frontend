import React from 'react';
import { EAMCellField } from 'eam-components/ui/components/grids/eam/utils';

const colorMap = {
  amber: '#f2bc41',
  amethyst: '#a38db7',
  azure: '#69b5dd',
  citrine: '#feeb70',
  cobalt: '#297af1',
  coral: '#eb8444',
  emerald: '#89c064',
  graphite: '#999999',
  jade: '#b7d675',
  ruby: '#c65f5f',
  sapphire: '#5967c9',
  topaz: '#7dd6f2',
  tourmaline: '#ff80a2',
  turquoise: '#7cc0b5'
}

const StatusIcon = ({ column, value }) => {
    const [name, color] = value.split('@')

    if(!color || !color.length) {
        return EAMCellField({ column, value });
    }

    const colorValue = color.toLowerCase().trim();

    if(!colorValue.length || !colorMap[colorValue]) {
        return EAMCellField({ column, value });
    }

    return (
        <>
            <span
                style={{
                    width: '1rem',
                    height: '1rem',
                    position: 'relative',
                    top: '2px',
                    borderRadius: '1rem',
                    display: 'inline-block',
                    marginRight: '2px',
                    background: colorMap[colorValue]
                }}
            />
            {name}
        </>
    )
}

export default StatusIcon;
