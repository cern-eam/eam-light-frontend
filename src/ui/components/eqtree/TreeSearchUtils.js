import {remove as removeFrenchCharacters} from "diacritics";

/**
 * Search method with following functionalities:
 * - case insensitive,
 * - french accents insensitive
 * @param node the tree node.
 * @param searchQuery search phrase.
 * @returns {boolean} true if node satisfies passed search criteria.
 */
export const searchMethod = ({
                               node = {
                                 title: '',
                                 description: ''
                               },
                               searchQuery = ''
                             } = {}) => {
  const finalSearchQuery = removeFrenchCharacters(searchQuery.toLowerCase());
  if (searchQuery) {
    const title = removeFrenchCharacters(node.title.toLowerCase());
    const description = removeFrenchCharacters(node.description.toLowerCase());
    if (title.indexOf(finalSearchQuery) > -1) {
      return true;
    } else if (description.indexOf(finalSearchQuery) > -1) {
      return true;
    }
  }
  return false;
};
