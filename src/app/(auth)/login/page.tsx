import { redirect } from 'next/navigation';

export default function LoginRedirectPage() {
  // Varsayılan locale ile login sayfasına yönlendir
  redirect('/tr/login');
}
