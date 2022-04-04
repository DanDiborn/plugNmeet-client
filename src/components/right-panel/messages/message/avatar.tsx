import React from 'react';
import { IParticipant } from '../../../../store/slices/interfaces/participant';
import { ICurrentUser } from '../../../../store/slices/interfaces/session';

interface IAvatarProps {
  participant?: IParticipant;
  from: ICurrentUser;
}

const Avatar = ({ participant, from }: IAvatarProps) => {
  const render = () => {
    if (participant?.metadata?.profile_pic) {
      return (
        <img src={participant?.metadata.profile_pic} alt={participant.name} />
      );
    } else {
      let name = from.name;
      if (participant?.name) {
        name = participant?.name;
      }
      return <React.Fragment>{name?.slice(0, 2).toUpperCase()}</React.Fragment>;
    }
  };
  return (
    <div className="avatar flex items-center justify-center text-white h-8 w-8 overflow-hidden rounded-full shadow-header bg-brandColor1">
      {render()}
    </div>
  );
};

export default Avatar;
