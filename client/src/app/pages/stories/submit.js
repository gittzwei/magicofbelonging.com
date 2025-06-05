import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import StoryForm from '../../components/StoryForm';

export default function SubmitStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Layout title="Loading...">Loading...</Layout>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmitSuccess = (story) => {
    router.push(`/stories/${story._id}`);
  };

  return (
    <Layout title="Submit Your Story">
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Share Your Story</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-dark sm:text-4xl">
              Contribute to the Diaspora Narrative
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Your experiences matter. Share your journey with the community.
            </p>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            <StoryForm 
              onSubmitSuccess={handleSubmitSuccess}
              userId={session.user.id} // Now using the session data
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}