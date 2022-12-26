import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Modal from 'react-modal';

import { getGeneralPost, PostType, releasePost } from '../hooks/postFunction';
import { InputGroup } from './organisms/inputGroup';

type Props = {
  isOpen: boolean;
  afterOpenFn: Dispatch<React.SetStateAction<boolean>>;
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta | undefined;
  setGeneralPostList: Dispatch<SetStateAction<PostType[]>>;
};

export default function PostModal(props: Props) {
  const submit = async (event: any) => {
    event.preventDefault();
    if (!props.api || !props.actingAccount) return;
    await releasePost({
      api: props.api,
      actingAccount: props.actingAccount,
      description: event.target.description.value,
      imgUrl: event.target.imgUrl.value,
    });
    props.afterOpenFn(false);
    alert(`Image URL: ${event.target.imgUrl.value}\nDescription: ${event.target.description.value}`);

    await getGeneralPost({ api: props.api, setGeneralPostList: props.setGeneralPostList });
  };

  useEffect(() => {
    Modal.setAppElement(document.querySelector('body')!);
  }, []);

  return (
    <Modal ariaHideApp={false} className="flex items-center justify-center h-screen" isOpen={props.isOpen}>
      <InputGroup message="Post" submit={submit} afterOpenFn={props.afterOpenFn} />
    </Modal>
  );
}
