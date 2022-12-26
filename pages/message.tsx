import { ApiPromise } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useEffect, useState } from 'react';
import BottomNavigation from '../components/bottomNavigation';
import MessageRoom from '../components/messageRoom';
import MessageMember from '../components/message_member';
import TopBar from '../components/topBar';
import { balenceOf } from '../hooks/FT';
import { connectToContract } from '../hooks/connect';
import { getLastMessage } from '../hooks/messageFunction';
import type { ProfileType } from '../hooks/profileFunction';
import {
  checkCreatedInfo,
  createProfile,
  getProfileForMessage,
  getSimpleProfileForMessage,
} from '../hooks/profileFunction';

export default function Message() {
  // variable related to contract
  const [api, setApi] = useState<ApiPromise>();
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>();

  const [imgUrl, setImgUrl] = useState('');
  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImgUrl, setUserImgUrl] = useState('');
  const [myImgUrl, setMyImgUrl] = useState('');
  const [messageListId, setMessageListId] = useState<string>('');
  const [messageMemberList, setMessageMemberList] = useState<JSX.Element[]>([]);
  const [myUserId, setMyUserId] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [profile, setProfile] = useState<ProfileType>();
  const [balance, setBalance] = useState<string>('0');

  // create message member list UI
  const createMessageMemberList = async () => {
    const memberList: Array<JSX.Element> = [];
    for (let i = 0; i < friendList.length; i++) {
      const friendProfile = await getSimpleProfileForMessage({
        api: api,
        userId: friendList[i],
      });
      const idList = profile?.messageListIdList || [];
      let lastMessage = '';

      console.log('idList', idList);

      if (idList !== null) {
        lastMessage = await getLastMessage({ api: api, id: idList[i] });
      }
      // @ts-ignore
      const name = friendProfile?.name;
      // @ts-ignore
      const imgUrl = friendProfile?.imgUrl;

      const memberListFactor = (
        <div
          key={i}
          onClick={() => {
            setShowMessageModal(!showMessageModal);
            setUserName(name);
            setUserImgUrl(imgUrl);
            setMessageListId(String(idList[i]));
            setMyUserId(String(profile?.userId));
          }}
        >
          <MessageMember name={name} img_url={imgUrl} last_message={lastMessage} />
        </div>
      );
      memberList.push(memberListFactor);
    }
    setMessageMemberList(memberList);
  };

  // Connection establishment.
  useEffect(() => {
    connectToContract({
      setApi: setApi,
      setAccountList: setAccountList,
      setActingAccount: setActingAccount,
      setIsSetup: setIsSetup,
    });
  }, []);

  // Profile check and creation.
  useEffect(() => {
    // Confirm if the connection establishes.
    if (!isSetup) return;

    // Check parameters exist to pass proper values.
    if (!api || !actingAccount?.address) return;

    checkCreatedInfo({
      api: api,
      userId: actingAccount.address,
      setIsCreatedProfile: setIsCreatedProfile,
    });

    // Initial value is true, then first attempt skips.
    // Based on checkCreatedInfo result, createProfile runs.
    if (!isCreatedProfile) createProfile({ api: api, actingAccount: actingAccount });
  }, [isSetup, isCreatedProfile, actingAccount]);

  useEffect(() => {
    //connect to contract
    if (!isSetup || !api || !actingAccount) return;

    // get profile
    getProfileForMessage({
      api: api,
      userId: actingAccount?.address,
      setImgUrl: setImgUrl,
      setMyImgUrl: setMyImgUrl,
      setFriendList: setFriendList,
      setProfile: setProfile,
    });

    balenceOf({
      api: api,
      actingAccount: actingAccount,
      setBalance: setBalance,
    });
  }, [isSetup, actingAccount]);

  useEffect(() => {
    if (!isSetup || !api || !actingAccount) return;
    // create message member list UI
    createMessageMemberList();
  }, [friendList]);

  return !showMessageModal ? (
    <div className="flex justify-center items-center bg-gray-200 w-screen h-screen relative">
      <main className="items-center h-screen w-1/3 flex bg-white flex-col">
        <TopBar idList={accountList} imgUrl={imgUrl} setActingAccount={setActingAccount} balance={balance} />
        <div className="flex-1 overflow-auto w-full mt-1">{messageMemberList}</div>
        <div className="w-full">
          <BottomNavigation />
        </div>
      </main>
    </div>
  ) : (
    <MessageRoom
      setShowMessageModal={setShowMessageModal}
      userName={userName}
      userImgUrl={userImgUrl}
      myImgUrl={myImgUrl}
      myUserId={myUserId}
      api={api}
      actingAccount={actingAccount}
      messageListId={messageListId}
    />
  );
}
