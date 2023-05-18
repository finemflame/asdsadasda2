export default defineEventHandler((event) => {
const redirectUrl = "https://markmystories.com" + event.req.url;
sendRedirect(event, redirectUrl);
})
