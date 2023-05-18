<script setup>
import { useHead } from '@vueuse/head';
import axios from 'axios';

export async function getStaticProps() {
  try {
    const apiUrl = 'https://markmystories.com/wp-json/wp/v2/posts?slug=my-post-slug';
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.length > 0) {
      const postData = data[0];
      const metaData = postData.yoast_head_json;

      const meta = [
        { property: 'og:title', content: metaData.title },
        { property: 'og:description', content: metaData.og_description },
      ];

      if (metaData.og_image) {
        const ogImage = metaData.og_image[0];
        meta.push(
          { property: 'og:image', content: ogImage.url },
          { property: 'og:image:width', content: ogImage.width },
          { property: 'og:image:height', content: ogImage.height },
          { property: 'og:image:type', content: ogImage.type }
        );
      }

      return {
        props: {
          postData,
          meta
        }
      };
    } else {
      throw { statusCode: 404, message: 'Post not found' };
    }
  } catch (error) {
    return {
      props: {
        error: error.message
      }
    };
  }
}

const { postData, meta, error } = await getStaticProps();

if (error) {
  throw { statusCode: 404, message: error };
}

const formatDate = (date) => {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${year}-${month}-${day}`;
};

useHead({
  title: postData.yoast_head_json?.title,
  meta: [
    ...meta,
    {
      name: 'description',
      content: postData.yoast_head_json?.og_description,
    },
  ],
  link: [
    { rel: 'icon', sizes: '32x32', href: '/_nuxt/assets/img/32x32.png' },
    { rel: 'icon', sizes: '192x192', href: '/_nuxt/assets/img/192x192.png' },
    { rel: 'apple-touch-icon', href: '/_nuxt/assets/img/180x180.png' },
  ],
});
</script>
