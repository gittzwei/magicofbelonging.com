import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';
import Search from '../components/Search';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      const searchStories = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`/api/stories/search?query=${q}`);
          setResults(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      searchStories();
    }
  }, [q]);

  return (
    <Layout title={`Search: ${q || ''}`}>
      <div className="py-12 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Search initialValue={q} />
          </div>
          
          {loading ? (
            <p className="text-center">Searching...</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-dark mb-6">
                {results.length} results for &quot;{q}&quot;
              </h1>
              
              {results.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {results.map(story => (
                    <StoryCard key={story._id} story={story} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No stories found matching your search.</p>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}