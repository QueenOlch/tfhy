import lunr from 'lunr'
import hostedIndex from './index.js'

let index = hostedIndex.getIndex();

export async function search(query) {
    const results = index.search(query);
    return results.map((result) => result.ref);
}