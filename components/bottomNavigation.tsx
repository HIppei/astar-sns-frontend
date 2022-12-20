import { useRouter } from 'next/router';
import { useState } from 'react';

import Footer from './organisms/footer';

export default function BottomNavigation() {
  const router = useRouter();
  const [witchScreen, setWitchScreen] = useState(router.pathname.replace(/[/]/g, ''));

  return <Footer selectedScreen={witchScreen} setSelectedScreen={setWitchScreen} />;
}
