const scraper = require("./scraper");
const fs = require("fs");

describe("Scraper extration module test", () => {
  let eveningHtml, postHtml, postHtmlNoComments;

  beforeAll(async () => {
    eveningHtml = await fs.readFileSync("./evening.test.html");
    evening2Html = await fs.readFileSync("./evening.test2.html");
    postHtml = await fs.readFileSync("./post.0.test.html");
    postHtmlNoComments = await fs.readFileSync("./post.1.test.html");
    postHtml2 = await fs.readFileSync("./post.2.test.html");
    moreCommentsHtml = await fs.readFileSync("./moreComments.test.html");
  });

  it("get link to all posts which have comments", () => {
    const links = scraper.scrapePostsWithComments(eveningHtml);

    expect(links.length).toBe(4);
  });

  it("gets link to all posts which have comments", () => {
    const links = scraper.scrapePostsWithComments(evening2Html);

    expect(links.length).toBe(4);
  });

  it("gets the 'Show More' on Facebook post page", () => {
    const showMoreLink = scraper.scrapeShowMoreLink(eveningHtml);
    const showMoreLink2 = scraper.scrapeShowMoreLink(evening2Html);

    expect(showMoreLink).toBe(
      "/eveningstandard?sectionLoadingID=m_timeline_loading_div_1596265199_0_36_timeline_unit%3A1%3A00000000001594121447%3A04611686018427387904%3A09223372036854775803%3A04611686018427387904&unit_cursor=timeline_unit%3A1%3A00000000001594121447%3A04611686018427387904%3A09223372036854775803%3A04611686018427387904&timeend=1596265199&timestart=0&tm=AQA5hgXwJEDrN4El&refid=17&__ccr=ARYoj0YMSQqPDnT4qkePczzq81SqfVxuos77M5u-BKXCIA"
    );

    expect(showMoreLink2).toBe(
      "/eveningstandard?sectionLoadingID=m_timeline_loading_div_1596265199_0_36_timeline_unit%3A1%3A00000000001594572375%3A04611686018427387904%3A09223372036854775803%3A04611686018427387904&unit_cursor=timeline_unit%3A1%3A00000000001594572375%3A04611686018427387904%3A09223372036854775803%3A04611686018427387904&timeend=1596265199&timestart=0&tm=AQA5hgXwJEDrN4El&refid=17&__ccr=ARa-MPNS_EuX311i2JUpGujI1TF-T5aHijwIH9CSGuwOjw"
    );
  });

  it("Extracts all comments and shows if more comments V2", () => {
    const commentsAndViewMore = scraper.scrapeCommentsFromPost(postHtml2);
    expect(commentsAndViewMore.comments[0]).toBe(
      "Women stopped cooking and relied on fast food, which is the reason, and it is not financial conditions at all😡"
    );
    expect(commentsAndViewMore.comments.length).toBe(10);
  });

  it("extracts all commments from post html and says if there's more comments to be viewed", () => {
    const commentsWithViewMoreCommentsLink = scraper.scrapeCommentsFromPost(
      postHtml
    );
    expect(commentsWithViewMoreCommentsLink.comments.length).toBe(6);
    expect(commentsWithViewMoreCommentsLink.viewMoreCommentsLink).toBeDefined();
  });

  it("Extracts comments when more comments is viewed", () => {
    const postWithMoreCommentsViewed = scraper.scrapeCommentsFromPost(
      moreCommentsHtml
    );

    expect(postWithMoreCommentsViewed.comments[0]).toBe(
      "if people don't want to get on buses and trains and plane's your can't force them every thing is going to quick"
    );
    expect(postWithMoreCommentsViewed.comments.length).toBe(10);
  });

  it("handles posts with no comments and no more view more comments", () => {
    const comments = scraper.scrapeCommentsFromPost(postHtmlNoComments);
    expect(comments.comments.length).toBe(0);
    expect(comments.viewMoreCommentsLink).toBeUndefined();
  });
});
