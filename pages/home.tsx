import { ApiPromise } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useEffect, useState } from 'react';

import { PostButton } from '../components/atoms/postButton';
import BottomNavigation from '../components/bottomNavigation';
import Post from '../components/post';
import PostModal from '../components/postModal';
import TopBar from '../components/topBar';
import { balenceOf, distributeReferLikes } from '../hooks/FT';
import { connectToContract } from '../hooks/connect';
import type { PostType } from '../hooks/postFunction';
import { getGeneralPost } from '../hooks/postFunction';
import { checkCreatedInfo, createProfile, getProfileForHome } from '../hooks/profileFunction';

export default function Home() {
  const [api, setApi] = useState<ApiPromise>();
  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isDistributed, setIsDistributed] = useState(false);

  const [imgUrl, setImgUrl] = useState('');
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>();
  const [generalPostList, setGeneralPostList] = useState<PostType[]>([]);
  const [balance, setBalance] = useState<string>('0');

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
    if (!api || !actingAccount) return;

    checkCreatedInfo({
      api: api,
      userId: actingAccount.address,
      setIsCreatedProfile: setIsCreatedProfile,
    });

    // Initial value is true, then first attempt skips.
    // Based on checkCreatedInfo result, createProfile runs.
    if (!isCreatedProfile) createProfile({ api: api, actingAccount: actingAccount });
  }, [isSetup, isCreatedProfile, actingAccount]);

  // Set information for the screen.
  useEffect(() => {
    if (!isSetup || !isCreatedProfile || !api || !actingAccount) return;
    getGeneralPost({ api: api, setGeneralPostList: setGeneralPostList });

    getProfileForHome({
      api: api,
      userId: actingAccount.address,
      setImgUrl: setImgUrl,
    });
    balenceOf({
      api: api,
      actingAccount: actingAccount,
      setBalance: setBalance,
    });

    if (isDistributed) return;
    setIsDistributed(true);
    distributeReferLikes({
      api: api,
      actingAccount: actingAccount,
    }).finally(() => {
      setIsDistributed(false);
    });
  }, [isSetup, isCreatedProfile, actingAccount]);

  return (
    <div className="flex justify-center items-center bg-gray-200 w-screen h-screen relative">
      <main className="items-center justify-center h-screen w-1/3 flex bg-white flex-col">
        <PostModal
          isOpen={showNewPostModal}
          afterOpenFn={setShowNewPostModal}
          api={api}
          actingAccount={actingAccount}
          setGeneralPostList={setGeneralPostList}
        />
        <TopBar idList={accountList} imgUrl={imgUrl} setActingAccount={setActingAccount} balance={balance} />
        <div className="flex-1 overflow-auto">
          {generalPostList.map((post) => (
            <Post
              key={post.postId}
              actingAccount={actingAccount}
              name={post.name}
              time={post.createdTime}
              description={post.description}
              num_of_likes={post.numOfLikes}
              user_img_url={post.userImgUrl}
              post_img_url={post.imgUrl}
              userId={post.userId}
              postId={post.postId}
              api={api}
              setGeneralPostList={setGeneralPostList}
            />
          ))}
        </div>
        <div className="w-full">
          <BottomNavigation />
        </div>
        <PostButton setShowNewPostModal={setShowNewPostModal} />
      </main>
    </div>
  );
}
