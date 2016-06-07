/* eslint-disable max-len */
const strings = {
  noStoreDidChange: 'A component that uses a McFly Store mixin is not implementing storeDidChange. onChange will be called instead, but this will no longer be supported from version 1.0.',
  noCHangeHandler: 'A change handler is missing from a component with a McFly mixin. Notifications from Stores are not being handled.',
  reservedCallback: '"callback" is a reserved name and cannot be used as a method name.',
  reservedMixin: '"mixin" is a reserved name and cannot be used as a method name.',
  reservedDispatcherIds: '"dispatcherIds" is a reserved name and cannot be used as a method name.',
  reservedState: '"state" is a reserved name and cannot be used as a method name',
  noDispatcherTokens: 'cannot get dispatcherTokens from a namespace of type %%%.',
  existingNamespace: 'namespace %%% is already registered with the dispatcher.',
  payloadObject: 'Payload needs to be an object',
  payloadRequiresActionType: 'Payload object requires an actionType property',
};
/* eslint-enable */

const pattern = '%%%';

function hasPlaceholder(string) {
  return string.indexOf(pattern) > -1;
}

const message = (key, replacement = '') => {
  let output = strings[key];
  if (replacement && hasPlaceholder(output)) {
    output = output.replace(pattern, replacement);
  }
  return output;
};

export default message;
