import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';
import { getStories } from '../utils/api';

export default function Home({ stories }) {
  return (
    <Layout title="Home">
      <div className="py-12 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Welcome to</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-dark sm:text-4xl">
              Magic of Belonging
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connecting the Kenyan diaspora through stories of identity, heritage, and community.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-dark mb-6">Featured Stories</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map(story => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const stories = await getStories();
  return {
    props: { stories },
  };
}