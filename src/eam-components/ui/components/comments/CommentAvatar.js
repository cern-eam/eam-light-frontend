import React from 'react';
import UserAvatar from 'react-user-avatar';

const userAvatarColors = [
    '#E1BEE7',
    '#FFCDD2',
    '#F8BBD0',
    '#90CAF9',
    '#9FA8DA',
    '#B39DDB',
    '#DCEDC8',
    '#E6EE9C',
    '#81C784',
    '#FFF176',
    '#FFD54F',
    '#FFCC80',
    '#9E9E9E',
    '#E0E0E0',
    '#FFAB91',
    '#FF7043',
    '#B0BEC5',
];

const DEFAULT_SIZE = 48;

const CommentAvatar = (props) => {
    const { name } = props;
    const preferredInitials = name?.toUpperCase().slice(0, 2);

    return (
        <UserAvatar
            size={DEFAULT_SIZE}
            colors={userAvatarColors}
            {...props}
            style={{
                textTransform: 'uppercase',
            }}
            // <name> (<preferred initials>)
            // The name is still being sent so that the deterministic algorithm
            // for color selection does not return the same color for the same initials
            name={`${name || 'UNKNOWN USER'} (${preferredInitials})`}
        />
    );
};

export default CommentAvatar;
