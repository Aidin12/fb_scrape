const defaultOptions = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
  },
  jar: true,
};

const request = require("request-promise").defaults(defaultOptions);
const fs = require("fs");
const scraper = require("./scraper");

const baseURL = "https://m.facebook.com";

async function main() {
  const options = {
    method: "POST",
    uri: baseURL + "/login/?next&ref=dbl&fl&refid=8",
    form: {
      email: "khadwilliams6@gmail.com",
      pass: "$Copperrose1$",
    },
    simple: false,
    resolveWithFullResponse: true,
  };

  let totalComments = 0;

  try {
    const loginResult = await request(options); //login
    console.log(loginResult.statusCode);
    let eveningStandardHtml = await request.get(baseURL + "/guardiantt");
    fs.writeFileSync("./evening.debug.html", eveningStandardHtml);
    while (totalComments <= 10) {
      const linksToPostsWithComments = await scraper.scrapePostsWithComments(
        eveningStandardHtml
      );
      const noOfCommentsScraped = await requestAllCommentsFromPosts(
        linksToPostsWithComments
      );
      totalComments += noOfCommentsScraped;
      console.log("TOTAL COMMENTS: " + totalComments);
      const viewMorePostsLink = scraper.scrapeShowMoreLink(eveningStandardHtml);
      eveningStandardHtml = await request.get(baseURL + viewMorePostsLink);
    }
  } catch (error) {
    console.error(error);
  }
}

async function requestAllCommentsFromPosts(commentLinks) {
  let noOfCommentsScraped = 0;
  for (let i = 0; i < commentLinks.length; i++) {
    try {
      const postUrl = baseURL + commentLinks[i];
      console.log("Scraping " + postUrl);
      const postHtml = await request.get(postUrl);
      await sleepRandomTimeInterval();
      fs.writeFileSync("./test-pages/post." + i + ".debug.html", postHtml);
      let { viewMoreCommentsLink, comments } = scraper.scrapeCommentsFromPost(
        postHtml
      );
      console.log("post index " + i);
      console.log(viewMoreCommentsLink);
      if (typeof viewMoreCommentsLink !== "undefined") {
        console.log(viewMoreCommentsLink);
        comments = await scrapeAllCommentsLoop(comments, viewMoreCommentsLink);
      }
      const result = { comments, postUrl };
      noOfCommentsScraped += comments.length;
      //TODO Save to MONGODB database here
      const json = JSON.stringify(result);
      console.log("Writing JSON for post index " + i);
      fs.writeFileSync("postComments." + i + ".json", json);
    } catch (err) {
      console.error(err);
    }
  }
  return noOfCommentsScraped;
}

async function scrapeAllCommentsLoop(allComments, viewMoreCommentsLink) {
  let index = 0;
  while (viewMoreCommentsLink) {
    try {
      console.log("Scraping all comments:");
      console.log(allComments);
      console.log(viewMoreCommentsLink);
      await sleepRandomTimeInterval();
      const viewMoreCommentsHtml = await request.get(
        baseURL + viewMoreCommentsLink
      );
      fs.writeFileSync("./moreComments.debug.html", viewMoreCommentsHtml);
      const result = scraper.scrapeCommentsFromPost(viewMoreCommentsHtml);
      allComments = [...allComments, ...result.comments];
      viewMoreCommentsLink = result.viewMoreCommentsLink;
      index++;
    } catch (err) {
      console.error(err);
    }
  }
  return allComments;
}

async function sleepRandomTimeInterval() {
  const randomSleepTime = Math.floor(Math.random() * 700 + 2000); //In case Facebook notices you always have exact same sleep time
  return new Promise((resolve) => setTimeout(resolve, randomSleepTime));
}

main();
