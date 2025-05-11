import { useSession } from 'next-auth/react';

export default function Avatar() {
  const { data: session } = useSession();
  const user = session?.user;
  
  if (!user) return null;

  // If user has an image, use it
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.name || 'User avatar'}
        className="h-10 w-10 rounded-full"
      />
    );
  }

  // Otherwise, show initial in a colored circle
  const initial = user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
  ];
  
  // Generate a consistent color based on the user's name/email
  const colorIndex = (user.name || user.email || '')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  return (
    <div className={`h-10 w-10 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold text-lg`}>
      {initial}
    </div>
  );
} 