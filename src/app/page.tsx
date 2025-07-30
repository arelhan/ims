import { redirect } from 'next/navigation';

export default function RootPage() {
  // Varsayılan locale'e yönlendir
  redirect('/tr');
}
