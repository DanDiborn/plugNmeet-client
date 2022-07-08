import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createSelector } from '@reduxjs/toolkit';

import {
  RootState,
  store,
  useAppDispatch,
  useAppSelector,
} from '../../../store';
import { updateDisplayExternalLinkRoomModal } from '../../../store/slices/bottomIconsActivitySlice';
import sendAPIRequest from '../../../helpers/api/plugNmeetAPI';

const isActiveSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .display_external_link_features.is_active,
  (is_active) => is_active,
);

const DisplayExternalLinkModal = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isActive = useAppSelector(isActiveSelector);
  const [link, setLink] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>();
  const [extraValues, setExtraValues] = useState({
    name: false,
    userId: false,
    role: false,
    meetingId: false,
  });

  const closeStartModal = () => {
    dispatch(updateDisplayExternalLinkRoomModal(false));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(undefined);

    let url;
    try {
      url = new URL(link);
    } catch (_) {
      setErrorMsg(t('external-display-link-display.link-invalid'));
      return;
    }

    const session = store.getState().session;
    if (extraValues.name) {
      url.searchParams.set('name', session.currentUser?.name ?? '');
    }
    if (extraValues.userId) {
      url.searchParams.set('userId', session.currentUser?.userId ?? '');
    }
    if (extraValues.role) {
      url.searchParams.set(
        'role',
        session.currentUser?.metadata?.is_admin ? 'admin' : 'participant',
      );
    }
    if (extraValues.meetingId) {
      url.searchParams.set('meetingId', session.currentRoom.room_id);
    }

    const id = toast.loading(t('please-wait'), {
      type: 'info',
    });

    const body = {
      task: 'start',
      url: url.toString(),
    };
    const res = await sendAPIRequest('externalDisplayLink', body);

    if (!res.status) {
      toast.update(id, {
        render: t(res.msg),
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }

    toast.dismiss(id);
    dispatch(updateDisplayExternalLinkRoomModal(false));
  };

  const renderDisplayForm = () => {
    return (
      <>
        <Transition appear show={!isActive} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-[9999] overflow-y-auto"
            onClose={() => false}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <button
                    className="close-btn absolute top-8 right-6 w-[25px] h-[25px] outline-none"
                    type="button"
                    onClick={() => closeStartModal()}
                  >
                    <span className="inline-block h-[1px] w-[20px] bg-primaryColor absolute top-0 left-0 rotate-45" />
                    <span className="inline-block h-[1px] w-[20px] bg-primaryColor absolute top-0 left-0 -rotate-45" />
                  </button>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-left mb-2"
                  >
                    {t('external-display-link-display.modal-title')}
                  </Dialog.Title>
                  <hr />
                  <div className="mt-6">
                    <form method="POST" onSubmit={(e) => onSubmit(e)}>
                      <div className="">
                        <label
                          htmlFor="stream-key"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('external-display-link-display.url')}
                        </label>
                        <input
                          type="text"
                          name="stream-key"
                          id="stream-key"
                          value={link}
                          onChange={(e) => setLink(e.currentTarget.value)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 border border-solid border-black/50"
                        />
                        <div className="absolute text-xs py-2">
                          {t('external-display-link-display.note')}
                        </div>
                        {errorMsg ? (
                          <div className="error-msg absolute text-xs text-red-600 py-2">
                            {errorMsg}
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-10">
                        <fieldset>
                          <div
                            className="text-base font-medium text-gray-900"
                            aria-hidden="true"
                          >
                            {t(
                              'external-display-link-display.send-extra-values',
                            )}
                          </div>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="name"
                                  name="name"
                                  type="checkbox"
                                  checked={extraValues.name}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.name = !extraValues.name;
                                    setExtraValues(tmp);
                                  }}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="name"
                                  className="font-medium text-gray-700"
                                >
                                  {t('external-display-link-display.name')}
                                </label>
                                <p className="text-gray-500">
                                  {t('external-display-link-display.name-des')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="user-id"
                                  name="user-id"
                                  type="checkbox"
                                  checked={extraValues.userId}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.userId = !extraValues.userId;
                                    setExtraValues(tmp);
                                  }}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="user-id"
                                  className="font-medium text-gray-700"
                                >
                                  {t('external-display-link-display.user-id')}
                                </label>
                                <p className="text-gray-500">
                                  {t(
                                    'external-display-link-display.user-id-des',
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="user-role"
                                  name="user-role"
                                  type="checkbox"
                                  checked={extraValues.role}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.role = !extraValues.role;
                                    setExtraValues(tmp);
                                  }}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="user-role"
                                  className="font-medium text-gray-700"
                                >
                                  {t('external-display-link-display.user-role')}
                                </label>
                                <p className="text-gray-500">
                                  {t(
                                    'external-display-link-display.user-role-des',
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="meeting-id"
                                  name="meeting-id"
                                  type="checkbox"
                                  checked={extraValues.meetingId}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.meetingId = !extraValues.meetingId;
                                    setExtraValues(tmp);
                                  }}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="meeting-id"
                                  className="font-medium text-gray-700"
                                >
                                  {t(
                                    'external-display-link-display.meeting-id',
                                  )}
                                </label>
                                <p className="text-gray-500">
                                  {t(
                                    'external-display-link-display.meeting-id-des',
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div className="pb-3 pt-4 bg-gray-50 text-right mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primaryColor hover:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-secondaryColor"
                        >
                          {t('external-display-link-display.display')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return <>{!isActive ? renderDisplayForm() : null}</>;
};

export default DisplayExternalLinkModal;
