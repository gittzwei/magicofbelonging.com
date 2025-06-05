import Link from 'next/link';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Stories', href: '/admin/stories' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminNav() {
  const router = useRouter();

  return (
    <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={`${
                router.pathname === item.href
                  ? 'bg-primary-50 border-primary-500 text-primary-700 hover:bg-primary-50 hover:text-primary-700'
                  : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900'
              } group border-l-4 px-3 py-2 flex items-center text-sm font-medium`}
            >
              <span className="truncate">{item.name}</span>
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}