import { createActions } from 'spunky';
import Neon from '@cityofzion/neon-js';

export const ID = 'nameService';

// TODO: Configurable network settings and script hash
const NS_SCRIPT_HASH = '0xe60a3fa8149a853eb4dff4f6ed93c931646a9e22';
const URL = 'http://localhost:30333';

const client = Neon.create.rpcClient(URL);

const isNOS = (query) => {
  return query === 'nos.neo';
};

const isLocal = (query) => {
  return /^(localhost|127.0.0.1|0.0.0.0|::1)/.test(query);
};

const lookup = async (query) => {
  if (isNOS(query)) {
    return { query, target: 'welcome.html' };
  } if (isLocal(query)) {
    return { query, target: `http://${query}` };
  } else {
    const storageKey = Neon.u.str2hexstring(`${query}.target`);
    const response = await client.getStorage(NS_SCRIPT_HASH, storageKey);
    if (response) {
      const target = Neon.u.hexstring2str(response);
      return { query, target };
    }
    // TODO: Show an error in the status if target not found??
    return { query, target: null };
  }
};

export default createActions(ID, (query) => async () => lookup(query));
