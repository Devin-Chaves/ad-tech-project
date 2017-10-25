import cheerio from 'cheerio'
import article from './data/articles.js';
const $ = cheerio.load(article)

export default function injectMidContentAds(article) {
  var div = `<div class="ad"></div>`;

  // 400 word check
  var items = $('article > *');
  var words = 0;
  var elementWith400th = null;
  for (var i = 0; i < items.length; i++) {
    words += items[i].innerText.split(' ').length;
    if (words >= 400) {
      elementWith400th = items[i];
      break;
    }
  }
  // img check
  var imgNextSibling = if ( elementWith400th.nextElementSibling.getElementsByTagName('img').length > 0) {
    var pre400 = elementWith400th.previousElementSibling;
    insertAfter(pre400, div);
  }

  // Helper function to insert after selected element
  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  // Blacklist check
  var isBlacklisted = article.blacklist.some(
    word => article.html.indexOf(word) !== -1
  );
  // Ad injection
  if (elementWith400th != null && !isBlacklisted && !imgNextSibling) {
    insertAfter(elementWith400th, div);
  }

  return article.html;
}
