import { redirect, RedirectType } from 'next/navigation';

export default async function Home() {
  redirect('/dashboard', RedirectType.push);

  return null;
}
