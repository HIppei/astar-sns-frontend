import { useRouter } from 'next/router';

import Header from './organisms/header';

export default function TopBar(props: any) {
  const router = useRouter();
  const selectedScreen = router.pathname.replace(/[/]/g, '');
  return (
    <Header
      selectedScreen={selectedScreen}
      imgUrl={props.imgUrl}
      idList={props.idList}
      setActingAccount={props.setActingAccount}
      balance={props.balance}
    />
  );
}
