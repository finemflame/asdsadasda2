<script setup>
import { useHead } from '@vueuse/head';

const route = useRoute();
let data;

if (route.params.slug) {
  const id = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
  const apiUrl = `https://markmystories.com/wp-json/wp/v2/posts?slug=${id}`;
  const response = await fetch(apiUrl);
  const json = await response.json();

  if (json.length > 0) {
    data = json[0];
    const metaData = data.yoast_head_json;

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

    useHead({
      title: metaData.title,
      meta,
      link: [
        { rel: 'icon', sizes: '32x32', href: '/_nuxt/assets/img/32x32.png' },
        { rel: 'icon', sizes: '192x192', href: '/_nuxt/assets/img/192x192.png' },
        { rel: 'apple-touch-icon', href: '/_nuxt/assets/img/180x180.png' }
      ]
    });
  } else {
    throw { statusCode: 404, message: 'Post not found' };
  }
}

const formatDate = (date) => {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${year}-${month}-${day}`;
};
</script>
