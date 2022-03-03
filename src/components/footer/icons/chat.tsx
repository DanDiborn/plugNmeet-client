import React, { useState, useEffect } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import {
  useAppSelector,
  RootState,
  useAppDispatch,
  store,
} from '../../../store';
import { updateIsActiveChatPanel } from '../../../store/slices/bottomIconsActivitySlice';
import { IRoomMetadata } from '../../../store/slices/interfaces/session';

const isActiveChatPanelSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity.isActiveChatPanel,
  (isActiveChatPanel) => isActiveChatPanel,
);

const ChatIcon = () => {
  const dispatch = useAppDispatch();
  const showTooltip = store.getState().session.userDeviceType === 'desktop';
  const { t } = useTranslation();

  const isActiveChatPanel = useAppSelector(isActiveChatPanelSelector);
  const [iconCSS, setIconCSS] = useState<string>('brand-color1');
  const [allowChat, setAllowChat] = useState<boolean>(true);

  useEffect(() => {
    if (isActiveChatPanel) {
      setIconCSS('brand-color2');
    } else {
      setIconCSS('brand-color1');
    }
  }, [isActiveChatPanel]);

  useEffect(() => {
    const metadata = store.getState().session.currentRoom
      .metadata as IRoomMetadata;
    if (!metadata.room_features?.chat_features.allow_chat) {
      setAllowChat(false);
      dispatch(updateIsActiveChatPanel(false));
    }
  }, [dispatch]);

  const toggleChatPanel = () => {
    dispatch(updateIsActiveChatPanel(!isActiveChatPanel));
  };

  const render = () => {
    return (
      <div
        className={`message h-[35px] lg:h-[40px] w-[35px] lg:w-[40px] relative rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] mr-3 lg:mr-6 flex items-center justify-center cursor-pointer ${
          showTooltip ? 'has-tooltip' : ''
        }`}
        onClick={() => toggleChatPanel()}
      >
        <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-red-500 -mt-16 text-[10px] w-max">
          {isActiveChatPanel
            ? t('footer.icons.hide-chat-panel')
            : t('footer.icons.show-chat-panel')}
        </span>

        <i className={`pnm-chat ${iconCSS} text-[12px] lg:text-[16px]`} />
        <div className="unseen-message-count bg-brandRed w-5 h-5 rounded-full text-xs text-white absolute -top-2 -right-1 flex justify-center items-center">
          29
        </div>
      </div>
    );
  };

  return <React.Fragment>{allowChat ? render() : null}</React.Fragment>;
};

export default ChatIcon;
