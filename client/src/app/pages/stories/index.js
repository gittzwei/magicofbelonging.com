import Layout from '../../components/Layout';
import StoryCard from '../../components/StoryCard';
import { getStories } from '../../utils/api';

export default function StoriesPage({ stories }) {
  return (
    <Layout title="Diaspora Stories">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-dark sm:text-4xl">
              Diaspora Stories
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Stories from second-generation Kenyans worldwide
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.map(story => (
              <StoryCard key={story._id} story={story} />
            ))}
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