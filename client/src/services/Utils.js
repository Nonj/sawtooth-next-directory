/* Copyright 2019 Contributors to Hyperledger Sawtooth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
----------------------------------------------------------------------------- */


/**
 * Create a URL-friendly string
 *
 * @param {string} id Object ID
 * @param {object} parent
 *        Object containing name field to poll on
 *        availability.
 *
 *        If an object is passed before it is ready
 *        to render, the function will be polled by Redux
 *        until a name field exists and a slug can be created
 * @returns {string}
 */
export const createSlug = (id, parent) => {
  const slug = parent && parent.id ? parent.id : id;
  try {
    return slug;
  } catch (error) {
    console.error('Invalid resource ID.');
    return '';
  }
};


/**
 * Instruct the client to use the first recommended pack
 * or role loaded in place of the default landing screen.
 * To display a landing screen instead, set the value of
 * REACT_APP_DEFAULT_LANDING to 1.
 *
 * @param {array} packs Recommended packs
 * @param {array} roles Recommended roles
 * @returns {string}
 */
export const createHomeLink = (packs = [], roles = []) => {
  try {
    if (process.env.REACT_APP_DEFAULT_LANDING !== '1') {
      if (packs && packs.length > 0)
        return `/packs/${createSlug(packs[0])}`;
      else if (roles && roles.length > 0)
        return `/roles/${createSlug(roles[0].id)}`;
    }
    return '/';
  } catch (error) {
    console.error(error);
    console.error('Error creating home link.');
    return '/';
  }
};


export const groupBy = (array, key) => {
  return array && array.reduce((prev, curr) => {
    prev[curr[key]] = prev[curr[key]] || [];
    prev[curr[key]].push(curr);
    return prev;
  }, Object.create(null));
};

export const filterBy = (array, key, me) => {
  return array && array.filter(
    proposal =>  proposal.opener !== me.id ).reduce((prev, curr) => {
    prev[curr[key]] = prev[curr[key]] || [];
    prev[curr[key]].push(curr);
    return prev;
  }, Object.create(null));
};


/**
 * Uniquely merge arrays
 * @param {array} array1 1st array
 * @param {array} array2 2nd array
 * @param {array} key Unique object property
 * @returns {array}
 */
export const merge = (array1, array2, key = 'id') => {
  try {
    const join = [...new Set([
      ...array2,
      ...array1,
    ])];
    const result = [];
    const map = new Map();

    for (const item of join) {
      if (!map.has(item[key])) {
        map.set(item[key], true);
        result.push(item);
      }
    }
    return result;
  } catch (error) {
    console.error(error);
    console.error('Error merging arrays. Check values:', array1, array2);
    return null;
  }
};


export const arraysEqual = (array1, array2) => {
  if (array1 === array2) return true;
  if (array1 == null || array2 == null) return false;
  if (array1.length !== array2.length) return false;

  for (let i = 0; i < array1.length; ++i)
    if (array1[i] !== array2[i]) return false;

  return true;
};


export const nearestMinute = (seconds = 1000 * 60) =>
  new Date(Math.round(new Date().getTime() / seconds) * seconds).getTime();


export const sort = (array, key) =>
  array.sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });


export const countLabel = (count, name, showMeLabelIfOne) => {
  const youLabel = showMeLabelIfOne ? ' (You)' : '';
  return `${count} ${count > 1 || count === 0 ? name + 's' : name} ${youLabel}`;
};


export const isWhitespace = (string) =>
  !string.replace(/\s/g, '').length;


export const formatDate = (timestamp) =>
  new Date(timestamp * 1e3).toLocaleDateString();


export const toTitleCase = (string) => {
  string = string.toLowerCase().split(' ');
  for (let i = 0; i < string.length; i++)
    string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
  return string.join(' ');
};


export const noop = () => {};
