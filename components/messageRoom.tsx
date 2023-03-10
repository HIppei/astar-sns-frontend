import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React, { Dispatch, useEffect, useState } from 'react';

import { FormBox } from '../components/molecules/formBox';
import { MessageBar } from '../components/organisms/messageBar';
import { getMessageList, MessageType } from '../hooks/messageFunction';
import { sendMessage } from '../hooks/messageFunction';
import Message from './message';

type Props = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta | undefined;
  messageListId: string;
  userImgUrl: string;
  userName: string;
  setShowMessageModal: Dispatch<React.SetStateAction<boolean>>;
  myUserId: string;
  myImgUrl: string;
};

export default function MessageRoom(props: Props) {
  const [messegaList, setMessageList] = useState<MessageType[]>([]);

  useEffect(() => {
    getMessageList({
      api: props.api,
      id: Number(props.messageListId),
    }).then((res: any) => {
      setMessageList(res);
    });
  }, []);

  const submit = async (event: any) => {
    event.preventDefault();
    if (!props.actingAccount) return;

    await sendMessage({
      api: props.api,
      actingAccount: props.actingAccount,
      message: event.target.message.value,
      id: props.messageListId,
    });
    event.target.message.value = '';

    const now = new Date();
    while (new Date().getTime() - now.getTime() <= 3000) {
      // wait for some time.
    }

    getMessageList({
      api: props.api,
      id: Number(props.messageListId),
    }).then((res: any) => {
      setMessageList(res);
    });
  };

  return (
    <div className="flex justify-center items-center bg-gray-200 w-screen h-screen ">
      <main className="items-center h-screen w-1/3 flex bg-white flex-col">
        <MessageBar
          userImgUrl={props.userImgUrl}
          userName={props.userName}
          setShowMessageModal={props.setShowMessageModal}
        />
        <div className="flex-1 overflow-auto w-full">
          {messegaList.map((message, index) => (
            <div key={index}>
              <Message
                account_id={props.myUserId}
                img_url={props.myUserId == message.senderId ? props.myImgUrl : props.userImgUrl}
                time={message.createdTime}
                message={message.message}
                senderId={message.senderId}
              />
            </div>
          ))}
        </div>
        <FormBox submit={submit} />
      </main>
    </div>
  );
}
