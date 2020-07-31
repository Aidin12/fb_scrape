const cheerio = require("cheerio");

function scrapeShowMoreLink(pageHtml) {
  const $ = cheerio.load(pageHtml);
  let showMoreLink = $(
    "#structured_composer_async_container > div:nth-child(2) > a"
  ).attr("href");
  return showMoreLink;
}

function scrapePostsWithComments(facebookPageHtml) {
  const $ = cheerio.load(facebookPageHtml);
  let linksToPostsComments = $("footer > div > a")
    .filter((i, link) => /\d+\sComments/.test($(link).text()))
    .map((i, el) => $(el).attr("href"));

  return linksToPostsComments;
}

function scrapeCommentsFromPost(postHtml) {
  const $ = cheerio.load(postHtml);

  const comments = $("div > h3 > a")
    .map((i, el) => $(el).parent().next().text())
    .get();

  const viewMoreCommentsLink = $("div[id*='see_next']")
    .first()
    .children()
    .attr("href");
  return {
    comments,
    viewMoreCommentsLink,
  };
}

module.exports = {
  scrapePostsWithComments,
  scrapeCommentsFromPost,
  scrapeShowMoreLink,
};
