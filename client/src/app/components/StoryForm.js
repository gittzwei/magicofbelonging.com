import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const StorySchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  excerpt: Yup.string().required('Required').max(200, 'Excerpt must be 200 characters or less'),
  content: Yup.string().required('Required'),
  region: Yup.string().required('Required'),
  theme: Yup.string().required('Required')
});

export default function StoryForm({ initialValues, onSubmitSuccess }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      excerpt: '',
      content: '',
      region: '',
      theme: '',
      featuredImage: ''
    },
    validationSchema: StorySchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError('');
      
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
          }
        };

        const body = JSON.stringify(values);
        
        let response;
        if (initialValues && initialValues._id) {
          response = await axios.put(`/api/stories/${initialValues._id}`, body, config);
        } else {
          response = await axios.post('/api/stories', body, config);
        }

        if (onSubmitSuccess) {
          onSubmitSuccess(response.data);
        } else {
          router.push(`/stories/${response.data._id}`);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.msg || 'Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title ? (
          <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Excerpt (short summary)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          value={formik.values.excerpt}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.excerpt && formik.errors.excerpt ? (
          <p className="mt-2 text-sm text-red-600">{formik.errors.excerpt}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Full Story
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.content && formik.errors.content ? (
          <p className="mt-2 text-sm text-red-600">{formik.errors.content}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <select
            id="region"
            name="region"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={formik.values.region}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a region</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Africa">Africa</option>
            <option value="Australia">Australia</option>
            <option value="Middle East">Middle East</option>
          </select>
          {formik.touched.region && formik.errors.region ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.region}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={formik.values.theme}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a theme</option>
            <option value="Identity">Identity</option>
            <option value="Culture">Culture</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Family">Family</option>
            <option value="Challenges">Challenges</option>
          </select>
          {formik.touched.theme && formik.errors.theme ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.theme}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
          Featured Image URL (optional)
        </label>
        <input
          id="featuredImage"
          name="featuredImage"
          type="url"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          value={formik.values.featuredImage}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Story'}
        </button>
      </div>
    </form>
  );
}