import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { AiFillHeart } from 'react-icons/ai';

import { addLikes, getGeneralPost, PostType } from '../hooks/postFunction';
import { SmallerProfileIcon } from './atoms/smallerProfileIcon';

type Props = {
  api?: ApiPromise;
  actingAccount: InjectedAccountWithMeta | undefined;
  userId: string;
  user_img_url: string;
  name: string;
  postId: number;
  time: string;
  description: string;
  post_img_url: string;
  num_of_likes: number;
  setGeneralPostList?: Dispatch<SetStateAction<PostType[]>>;
};

export default function Post(props: Props) {
  return (
    <div className="px-3 items-center border-b-2 py-1 ">
      <div className="flex flex-row justify-center">
        <SmallerProfileIcon
          imgUrl={props.user_img_url}
          api={props.api}
          actingAccount={props.actingAccount}
          userId={props.userId}
        />
        <div className="flex items-center flex-col w-[400px]">
          <div className="flex flex-row items-center w-full ">
            <div className="mr-3 font-semibold text-xl">{props.name}</div>
            <div className="text-gray-400">{props.time}</div>
          </div>
          <div className="text-xl w-full">{props.description}</div>
          {props.post_img_url && (
            <Image
              className="mr-3"
              src={props.post_img_url}
              alt="profile_logo"
              width={250}
              height={250}
              quality={100}
            />
          )}
          <div className="flex flex-row w-full pl-[85px] items-center">
            <div className="text-xl mr-1">{props.num_of_likes}</div>
            <AiFillHeart
              onClick={async () => {
                if (!props.api || !props.actingAccount || !props.setGeneralPostList) return;
                await addLikes({
                  api: props.api,
                  actingAccount: props.actingAccount,
                  postId: props.postId,
                });
                const now = new Date();
                while (new Date().getTime() - now.getTime() <= 500) {
                  // wait for around 500 ms
                }
                await getGeneralPost({ api: props.api, setGeneralPostList: props.setGeneralPostList });
              }}
              className="fill-[#FD3509] h-[30px] w-[30px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
